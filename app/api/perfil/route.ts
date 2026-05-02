/**
 * GET   /api/perfil   — Obtiene el perfil del usuario autenticado
 * PATCH /api/perfil   — Actualiza nombre, teléfono, foto_url del usuario autenticado
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

function sanitize(v: unknown, maxLen = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, "");
}

export async function GET(_request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("usuarios")
    .select("id, nombre, correo:email, rol, telefono, foto_url, activo, created_at")
    .eq("id", user.db_id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

  // Si correo está vacío en la tabla, usar el email de auth como fallback
  const correo = data.correo || user.email || null;

  // Datos extra por rol
  let extra: Record<string, unknown> = {};

  if (user.rol === "alumno") {
    const { data: alu } = await admin
      .from("alumnos")
      .select("id, matricula, semestre, turno, carrera:carreras(nombre), grupos(id, nombre)")
      .eq("usuario_id", user.db_id)
      .single();
    if (alu) extra = { alumno: alu };
  } else if (user.rol === "maestro") {
    const { data: mae } = await admin
      .from("maestros")
      .select("id, especialidad, clave_empleado")
      .eq("usuario_id", user.db_id)
      .single();
    if (mae) extra = { maestro: mae };
  }

  return NextResponse.json({ ...data, correo, ...extra });
}

export async function PATCH(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const updates: Record<string, string | null> = {};
  if (typeof body.nombre    === "string") updates.nombre    = sanitize(body.nombre, 120);
  if (typeof body.telefono  === "string") updates.telefono  = sanitize(body.telefono, 20).replace(/[^0-9+ ()-]/g, "");
  if (typeof body.foto_url  === "string") updates.foto_url  = sanitize(body.foto_url, 500);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios válidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("usuarios").update(updates).eq("id", user.db_id);
  if (error) return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
