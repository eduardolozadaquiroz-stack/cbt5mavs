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
  const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10", 10));
  const tipo  = sanitize(searchParams.get("tipo") ?? "", 50);
  const from  = (page - 1) * limit;
  const to    = from + limit - 1;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("avisos")
    .select("id, titulo, cuerpo, tipo, firmado, fecha_publicacion, activo, imagen_url", { count: "exact" })
    .eq("activo", true)
    .order("fecha_publicacion", { ascending: false })
    .range(from, to);

  if (tipo) query = query.eq("tipo", tipo);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener avisos" }, { status: 500 });

  return NextResponse.json({ avisos: data ?? [], total: count ?? 0, page, limit });
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
  const tipo       = sanitize(body.tipo as string, 50);
  const firmado    = sanitize(body.firmado as string, 200);
  const imagen_url = sanitize(body.imagen_url as string, 500);

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
      cuerpo,
      tipo,
      firmado: firmado || null,
      imagen_url: imagen_url || null,
      autor_id: user.db_id,
      activo: true,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Error al crear aviso" }, { status: 500 });

  // A09 – Audit log
  await auditLog(user.db_id, "avisos", "INSERT", data.id, { tipo, titulo });

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
