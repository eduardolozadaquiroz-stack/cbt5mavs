/**
 * GET    /api/avisos/[id]   — Aviso individual
 * PATCH  /api/avisos/[id]   — Actualizar aviso (admin/maestro autor)
 * DELETE /api/avisos/[id]   — Eliminar aviso (soft delete, admin o autor)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, getAuthUser } from "@/lib/auth";

export const runtime = 'edge';

function sanitize(v: unknown, maxLen = 500): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, "");
}

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("avisos")
    .select("*")
    .eq("id", id)
    .eq("estado", "publicado")
    .single();

  if (error || !data) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Aviso exclusivo para padres: solo padres, admin y maestro pueden verlo
  if (data.destinatario === "Padres") {
    const authUser = await getAuthUser();
    if (!authUser || (authUser.rol !== "padres" && authUser.rol !== "admin" && authUser.rol !== "maestro")) {
      // Devolver 404 para no revelar que existe
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [user, err] = await requireRole("admin", "maestro");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Verificar que el aviso existe y el usuario tiene permiso (admin o autor)
  const { data: existing } = await admin
    .from("avisos")
    .select("autor_id, fecha_publicacion")
    .eq("id", id)
    .single();

  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (user.rol !== "admin" && existing.autor_id !== user.db_id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const updates: Record<string, string | boolean | string[] | null> = {};
  if (typeof body.titulo === "string") updates.titulo = sanitize(body.titulo, 200);
  if (typeof body.cuerpo === "string") updates.contenido = sanitize(body.cuerpo, 4000);
  if (typeof body.tipo === "string") updates.tipo = sanitize(body.tipo, 50).toLowerCase();
  if (Array.isArray(body.fotos)) {
    const fotosArr = (body.fotos as unknown[])
      .filter((u): u is string => typeof u === "string")
      .map((u) => sanitize(u, 500))
      .slice(0, 5);
    updates.fotos = fotosArr;
  }
  if (Array.isArray(body.videos)) {
    updates.videos = (body.videos as unknown[])
      .filter((u): u is string => typeof u === "string")
      .map((u) => sanitize(u, 500))
      .slice(0, 3);
  }
  if (Array.isArray(body.pdfs)) {
    updates.pdfs = (body.pdfs as unknown[])
      .filter((u): u is string => typeof u === "string")
      .map((u) => sanitize(u, 500))
      .slice(0, 5);
  }
  if (typeof body.es_evento === "boolean") {
    updates.es_evento = body.es_evento;
    if (!body.es_evento) {
      // limpiar campos de evento al desactivar
      updates.evento_inicio    = null;
      updates.evento_fin       = null;
      updates.evento_lugar     = null;
      updates.evento_vestimenta = null;
      updates.evento_enlace    = null;
    }
  }
  if (typeof body.evento_inicio === "string")    updates.evento_inicio    = body.evento_inicio;
  if (typeof body.evento_fin === "string")       updates.evento_fin       = body.evento_fin;
  if (typeof body.evento_lugar === "string")     updates.evento_lugar     = sanitize(body.evento_lugar, 300);
  if (typeof body.evento_vestimenta === "string") updates.evento_vestimenta = sanitize(body.evento_vestimenta, 200);
  if (typeof body.evento_enlace === "string")    updates.evento_enlace    = sanitize(body.evento_enlace, 500);
  if (typeof body.activo === "boolean") {
    updates.estado = body.activo ? "publicado" : "borrador";
    // Si se está publicando y aún no tiene fecha, asignarla ahora
    if (body.activo && !existing.fecha_publicacion) {
      updates.fecha_publicacion = new Date().toISOString();
    }
  }
  if (typeof body.destinatario === "string") {
    const VALID_DEST = ["Todos", "Alumnos", "Maestros", "Padres"];
    if (VALID_DEST.includes(body.destinatario)) updates.destinatario = body.destinatario;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios" }, { status: 400 });
  }

  const { error } = await admin.from("avisos").update(updates).eq("id", id);
  if (error) {
    console.error("[PATCH /api/avisos] Supabase error:", error.code, error.message);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [user, err] = await requireRole("admin", "maestro");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  const { data: existing } = await admin
    .from("avisos")
    .select("autor_id")
    .eq("id", id)
    .single();

  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (user.rol !== "admin" && existing.autor_id !== user.db_id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  // Hard delete (solo se llega aquí desde el segundo paso del flujo, cuando ya está archivado)
  const { error } = await admin.from("avisos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
