/**
 * GET  /api/avisos          — Lista avisos paginados (autenticado o anónimo para públicos)
 * POST /api/avisos          — Crea aviso (admin o maestro)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, getAuthUser, auditLog } from "@/lib/auth";
import { sanitize, isSafeImageUrl } from "@/lib/validate";


export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit   = Math.min(50, parseInt(searchParams.get("limit") ?? "10", 10));
  const tipo    = sanitize(searchParams.get("tipo") ?? "", 50);
  const showAll = searchParams.get("all") === "1";
  const para    = sanitize(searchParams.get("para") ?? "", 20); // alumnos|maestros|padres|todos
  const from    = (page - 1) * limit;
  const to      = from + limit - 1;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("avisos")
    .select("id, titulo, contenido, tipo, estado, fotos, videos, pdfs, fecha_publicacion, destinatario, autor_id, es_evento, evento_inicio, evento_fin, evento_lugar, evento_vestimenta, evento_enlace", { count: "exact" })
    .order("fecha_publicacion", { ascending: false })
    .range(from, to);

  if (showAll) {
    // Solo admins/maestros autenticados pueden ver todos los avisos (incluyendo inactivos)
    const user = await getAuthUser();
    if (!user || (user.rol !== "admin" && user.rol !== "maestro")) {
      query = query.eq("estado", "publicado");
    }
  } else {
    query = query.eq("estado", "publicado");
  }

  if (tipo) query = query.eq("tipo", tipo);

  // Filtrar por destinatario:
  // – con ?para=X  → solo 'Todos' + ese rol
  // – sin ?para y sin all=1 (página pública) → excluir 'Padres' (avisos privados)
  // – sin ?para + all=1 + admin/maestro → ver todo
  const DEST_MAP: Record<string, string> = { alumnos: "Alumnos", maestros: "Maestros", padres: "Padres" };
  if (para && DEST_MAP[para.toLowerCase()]) {
    query = query.or(`destinatario.eq.Todos,destinatario.eq.${DEST_MAP[para.toLowerCase()]}`);
  } else if (!showAll) {
    // Página pública: nunca exponer avisos exclusivos de padres
    query = query.neq("destinatario", "Padres");
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener avisos" }, { status: 500 });

  // Mapear columnas del schema al shape esperado por el frontend
  const avisos = (data ?? []).map((a) => ({
    id: a.id,
    titulo: a.titulo,
    cuerpo: a.contenido,
    tipo: a.tipo,
    firmado: null as string | null,
    activo: a.estado === "publicado",
    fotos: (a.fotos as string[]) ?? [],
    videos: (a.videos as string[]) ?? [],
    pdfs: (a.pdfs as string[]) ?? [],
    fecha_publicacion: a.fecha_publicacion,
    destinatario: (a.destinatario as string) ?? "Todos",
    autor_id: a.autor_id,
    es_evento: (a.es_evento as boolean) ?? false,
    evento_inicio: (a.evento_inicio as string | null) ?? null,
    evento_fin: (a.evento_fin as string | null) ?? null,
    evento_lugar: (a.evento_lugar as string | null) ?? null,
    evento_vestimenta: (a.evento_vestimenta as string | null) ?? null,
    evento_enlace: (a.evento_enlace as string | null) ?? null,
  }));

  return NextResponse.json({ avisos, total: count ?? 0, page, limit });
}

export async function POST(request: NextRequest) {
  const [user, err] = await requireRole("admin", "maestro");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const titulo    = sanitize(body.titulo as string, 200);
  const cuerpo    = sanitize(body.cuerpo as string, 4000);
  const tipo      = sanitize(body.tipo as string, 50).toLowerCase();
  const activoRaw = body.activo !== false; // default true

  // Aceptar fotos como array de URLs (máx. 5)
  const fotosRaw = Array.isArray(body.fotos) ? (body.fotos as unknown[]) : [];
  const fotosArr = fotosRaw
    .filter((u): u is string => typeof u === "string")
    .map((u) => sanitize(u, 500))
    .filter((u) => isSafeImageUrl(u))
    .slice(0, 5);

  // Videos y PDFs (solo URLs de Supabase Storage)
  function pickStorageUrls(raw: unknown, max: number): string[] {
    if (!Array.isArray(raw)) return [];
    return (raw as unknown[])
      .filter((u): u is string => typeof u === "string")
      .map((u) => sanitize(u, 500))
      .filter((u) => isSafeImageUrl(u))
      .slice(0, max);
  }
  const videosArr = pickStorageUrls(body.videos, 3);
  const pdfsArr   = pickStorageUrls(body.pdfs, 5);

  // Campos de evento
  const esEvento       = body.es_evento === true;
  const eventoInicio   = esEvento && typeof body.evento_inicio === "string"   ? body.evento_inicio   : null;
  const eventoFin      = esEvento && typeof body.evento_fin === "string"      ? body.evento_fin      : null;
  const eventoLugar    = esEvento && typeof body.evento_lugar === "string"    ? sanitize(body.evento_lugar, 300)    : null;
  const eventoVest     = esEvento && typeof body.evento_vestimenta === "string" ? sanitize(body.evento_vestimenta, 200) : null;
  const eventoEnlace   = esEvento && typeof body.evento_enlace === "string"   ? sanitize(body.evento_enlace, 500)   : null;
  const VALID_DEST = ["Todos", "Alumnos", "Maestros", "Padres"];
  const destinatario = VALID_DEST.includes(body.destinatario as string)
    ? (body.destinatario as string)
    : "Todos";

  if (!titulo || !cuerpo || !tipo) {
    return NextResponse.json({ error: "titulo, cuerpo y tipo son requeridos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("avisos")
    .insert({
      titulo,
      contenido: cuerpo,
      tipo,
      destinatario,
      fotos: fotosArr,
      videos: videosArr,
      pdfs: pdfsArr,
      es_evento: esEvento,
      evento_inicio: eventoInicio,
      evento_fin: eventoFin,
      evento_lugar: eventoLugar,
      evento_vestimenta: eventoVest,
      evento_enlace: eventoEnlace,
      autor_id: user.db_id,
      estado: activoRaw ? "publicado" : "borrador",
      fecha_publicacion: activoRaw ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Error al crear aviso" }, { status: 500 });

  // A09 – Audit log
  await auditLog(user.db_id, "avisos", "INSERT", data.id, { tipo, titulo });

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
