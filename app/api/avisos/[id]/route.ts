/**
 * GET    /api/avisos/[id]   — Aviso individual
 * PATCH  /api/avisos/[id]   — Actualizar aviso (admin/maestro autor)
 * DELETE /api/avisos/[id]   — Eliminar aviso (soft delete, admin o autor)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, getAuthUser } from "@/lib/auth";

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
    .eq("activo", true)
    .single();

  if (error || !data) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
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
    .select("autor_id")
    .eq("id", id)
    .single();

  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (user.rol !== "admin" && existing.autor_id !== user.db_id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const updates: Record<string, string | boolean | null> = {};
  if (typeof body.titulo === "string") updates.titulo = sanitize(body.titulo, 200);
  if (typeof body.cuerpo === "string") updates.cuerpo = sanitize(body.cuerpo, 4000);
  if (typeof body.tipo === "string") updates.tipo = sanitize(body.tipo, 50);
  if (typeof body.firmado === "string") updates.firmado = sanitize(body.firmado, 200);
  if (typeof body.imagen_url === "string") updates.imagen_url = sanitize(body.imagen_url, 500);
  if (typeof body.activo === "boolean") updates.activo = body.activo;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios" }, { status: 400 });
  }

  const { error } = await admin.from("avisos").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });

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

  // Soft delete
  const { error } = await admin.from("avisos").update({ activo: false }).eq("id", id);
  if (error) return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
