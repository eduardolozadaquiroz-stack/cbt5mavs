/**
 * GET   /api/admin/ciclos           — Lista todos los ciclos escolares
 * POST  /api/admin/ciclos           — Crear nuevo ciclo
 * PATCH /api/admin/ciclos           — Activar o cerrar un ciclo
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, auditLog } from "@/lib/auth";
import { sanitize } from "@/lib/validate";

export const runtime = 'edge';

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("ciclos_escolares")
    .select("id, nombre, periodo, fecha_inicio, fecha_fin, activo, created_at")
    .order("fecha_inicio", { ascending: false });

  if (error) return NextResponse.json({ error: "Error al obtener ciclos" }, { status: 500 });
  return NextResponse.json({ ciclos: data ?? [] });
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const nombre       = sanitize(body.nombre as string, 120);
  const periodo      = sanitize(body.periodo as string, 20);
  const fecha_inicio = sanitize(body.fecha_inicio as string, 10);
  const fecha_fin    = sanitize(body.fecha_fin as string, 10);

  if (!nombre || !periodo || !fecha_inicio || !fecha_fin) {
    return NextResponse.json({ error: "nombre, periodo, fecha_inicio y fecha_fin son requeridos" }, { status: 400 });
  }
  if (fecha_fin <= fecha_inicio) {
    return NextResponse.json({ error: "fecha_fin debe ser posterior a fecha_inicio" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: nuevo, error: insertError } = await admin
    .from("ciclos_escolares")
    .insert({ nombre, periodo, fecha_inicio, fecha_fin, activo: false })
    .select("id, nombre, periodo, fecha_inicio, fecha_fin, activo")
    .single();

  if (insertError) {
    const msg = insertError.code === "23505"
      ? "Ya existe un ciclo con ese periodo (clave única)"
      : "Error al crear el ciclo";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  await auditLog(adminUser.db_id, "ciclos_escolares", "INSERT", nuevo.id, { nombre, periodo });
  return NextResponse.json({ ok: true, ciclo: nuevo }, { status: 201 });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const id     = sanitize(body.id as string, 36);
  const activo = body.activo;

  if (!id || typeof activo !== "boolean") {
    return NextResponse.json({ error: "id y activo (boolean) son requeridos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Si se va a activar, cerrar todos los demás primero (solo 1 activo a la vez)
  if (activo) {
    await admin
      .from("ciclos_escolares")
      .update({ activo: false })
      .neq("id", id);
  }

  const { error: updateError } = await admin
    .from("ciclos_escolares")
    .update({ activo })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: "Error al actualizar ciclo" }, { status: 500 });

  await auditLog(adminUser.db_id, "ciclos_escolares", "UPDATE", id, { activo });
  return NextResponse.json({ ok: true });
}
