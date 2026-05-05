/**
 * GET   /api/admin/reinscripcion/solicitudes/[id]  — Detalle completo con documentos
 * PATCH /api/admin/reinscripcion/solicitudes/[id]  — Actualizar estado + notas
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

const ESTADOS_VALIDOS = ["borrador","enviada","en_revision","aprobada","rechazada"];

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
    .from("reinscripcion_solicitudes")
    .select(`
      id, estado, notas_admin, ciclo_escolar, created_at, updated_at,
      alumnos (
        id, matricula, semestre_actual,
        usuarios ( nombre, apellido_paterno, apellido_materno, email ),
        carreras ( nombre, clave )
      ),
      reinscripcion_documentos ( id, nombre, url, estado, notas, created_at )
    `)
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  return NextResponse.json({ solicitud: data });
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

  const updates: Record<string, unknown> = {};
  if (typeof body.estado === "string" && ESTADOS_VALIDOS.includes(body.estado)) {
    updates.estado = body.estado;
  }
  if (body.notas_admin !== undefined) {
    updates.notas_admin = typeof body.notas_admin === "string"
      ? body.notas_admin.trim().slice(0, 500) || null
      : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios válidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("reinscripcion_solicitudes")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Error al actualizar solicitud" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
