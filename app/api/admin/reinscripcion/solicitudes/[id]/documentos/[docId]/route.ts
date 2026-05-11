/**
 * PATCH /api/admin/reinscripcion/solicitudes/[id]/documentos/[docId]
 * Aprobar o rechazar un documento individual.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { id, docId } = await context.params;
  if (!isUUID(id) || !isUUID(docId)) return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.estado === "string" && ["pendiente","aprobado","rechazado"].includes(body.estado)) {
    updates.estado = body.estado;
  }
  if (body.notas !== undefined) {
    updates.notas = typeof body.notas === "string" ? body.notas.trim().slice(0, 300) || null : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios válidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("reinscripcion_documentos")
    .update(updates)
    .eq("id", docId)
    .eq("solicitud_id", id);

  if (error) return NextResponse.json({ error: "Error al actualizar documento" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
