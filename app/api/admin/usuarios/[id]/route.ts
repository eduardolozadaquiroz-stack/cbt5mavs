/**
 * GET    /api/admin/usuarios/[id]   — Detalle de un usuario
 * PATCH  /api/admin/usuarios/[id]   — Actualizar usuario
 * DELETE /api/admin/usuarios/[id]   — Desactivar usuario (soft delete)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

function sanitize(v: unknown, maxLen = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, "");
}
function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}
const ROLES_VALIDOS = ["alumno", "maestro", "admin", "padres"];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("usuarios")
    .select("id, nombre, correo, rol, telefono, foto_url, activo, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const updates: Record<string, string | boolean | null> = {};
  if (typeof body.nombre   === "string") updates.nombre   = sanitize(body.nombre, 120);
  if (typeof body.telefono === "string") updates.telefono = sanitize(body.telefono, 20);
  if (typeof body.foto_url === "string") updates.foto_url = sanitize(body.foto_url, 500);
  if (typeof body.activo   === "boolean") updates.activo  = body.activo;
  if (typeof body.rol === "string" && ROLES_VALIDOS.includes(body.rol)) updates.rol = body.rol;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios válidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("usuarios").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  // Soft delete — no eliminar la cuenta auth ni los registros relacionados
  const { error } = await admin.from("usuarios").update({ activo: false }).eq("id", id);
  if (error) return NextResponse.json({ error: "Error al desactivar usuario" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
