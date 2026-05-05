/**
 * POST   /api/reinscripcion/mi-solicitud/documentos  — Subir documento
 * DELETE /api/reinscripcion/mi-solicitud/documentos  — Eliminar documento (?id=xxx)
 * POST   /api/reinscripcion/mi-solicitud/enviar      — Cambiar estado a "enviada"
 *
 * Nota: el archivo ya debe estar subido al storage (usa /api/storage/upload).
 *       Este endpoint solo registra la URL en la tabla.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

function sanitize(v: unknown, max = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max).replace(/[\x00-\x1F\x7F]/g, "");
}
function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

// ── Verificar que la solicitud pertenece al alumno y está en estado editable ──
async function getSolicitudPropia(admin: ReturnType<typeof createSupabaseAdminClient>, alumnoId: string, solicitudId: string) {
  const { data } = await admin
    .from("reinscripcion_solicitudes")
    .select("id, estado")
    .eq("id", solicitudId)
    .eq("alumno_id", alumnoId)
    .maybeSingle();
  return data;
}

export async function POST(request: NextRequest) {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const solicitud_id = sanitize(body.solicitud_id);
  const nombre       = sanitize(body.nombre, 120);
  const url          = sanitize(body.url, 500);

  if (!isUUID(solicitud_id) || !nombre || !url) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const solicitud = await getSolicitudPropia(admin, user.db_id, solicitud_id);

  if (!solicitud) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (!["borrador", "enviada"].includes(solicitud.estado)) {
    return NextResponse.json({ error: "No se pueden modificar documentos en este estado" }, { status: 403 });
  }

  const { data, error } = await admin
    .from("reinscripcion_documentos")
    .insert({ solicitud_id, nombre, url, estado: "pendiente" })
    .select("id, nombre, url, estado, created_at")
    .single();

  if (error) return NextResponse.json({ error: "Error al registrar documento" }, { status: 500 });

  // Si estaba "enviada" y se sube nuevo doc, regresar a "en_revision"
  if (solicitud.estado === "enviada") {
    await admin
      .from("reinscripcion_solicitudes")
      .update({ estado: "en_revision" })
      .eq("id", solicitud_id);
  }

  return NextResponse.json({ documento: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const doc_id      = searchParams.get("id") ?? "";
  const solicitud_id = searchParams.get("solicitud_id") ?? "";

  if (!isUUID(doc_id) || !isUUID(solicitud_id)) {
    return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const solicitud = await getSolicitudPropia(admin, user.db_id, solicitud_id);
  if (!solicitud) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (solicitud.estado !== "borrador") {
    return NextResponse.json({ error: "Solo se pueden eliminar documentos en estado borrador" }, { status: 403 });
  }

  const { error } = await admin
    .from("reinscripcion_documentos")
    .delete()
    .eq("id", doc_id)
    .eq("solicitud_id", solicitud_id);

  if (error) return NextResponse.json({ error: "Error al eliminar documento" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
