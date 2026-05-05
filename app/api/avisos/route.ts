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
    .select("id, titulo, contenido, tipo, estado, fotos, fecha_publicacion, destinatario, autor_id", { count: "exact" })
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

  // Filtrar por destinatario: mostrar 'Todos' + el rol específico
  const DEST_MAP: Record<string, string> = { alumnos: "Alumnos", maestros: "Maestros", padres: "Padres" };
  if (para && DEST_MAP[para.toLowerCase()]) {
    query = query.or(`destinatario.eq.Todos,destinatario.eq.${DEST_MAP[para.toLowerCase()]}`);
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
    imagen_url: (a.fotos as string[])?.[0] ?? null,
    fecha_publicacion: a.fecha_publicacion,
    destinatario: (a.destinatario as string) ?? "Todos",
    autor_id: a.autor_id,
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

  const titulo     = sanitize(body.titulo as string, 200);
  const cuerpo     = sanitize(body.cuerpo as string, 4000);
  const tipo       = sanitize(body.tipo as string, 50).toLowerCase();
  const imagen_url = sanitize(body.imagen_url as string, 500);
  const activoRaw  = body.activo !== false; // default true
  const VALID_DEST = ["Todos", "Alumnos", "Maestros", "Padres"];
  const destinatario = VALID_DEST.includes(body.destinatario as string)
    ? (body.destinatario as string)
    : "Todos";

  if (!titulo || !cuerpo || !tipo) {
    return NextResponse.json({ error: "titulo, cuerpo y tipo son requeridos" }, { status: 400 });
  }

  // A03 – Prevenir XSS via URL de imagen almacenada
  if (imagen_url && !isSafeImageUrl(imagen_url)) {
    return NextResponse.json({ error: "imagen_url debe ser una URL HTTPS de Supabase Storage" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("avisos")
    .insert({
      titulo,
      contenido: cuerpo,
      tipo,
      destinatario,
      fotos: imagen_url ? [imagen_url] : [],
      autor_id: user.db_id,
      estado: activoRaw ? "publicado" : "borrador",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Error al crear aviso" }, { status: 500 });

  // A09 – Audit log
  await auditLog(user.db_id, "avisos", "INSERT", data.id, { tipo, titulo });

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
