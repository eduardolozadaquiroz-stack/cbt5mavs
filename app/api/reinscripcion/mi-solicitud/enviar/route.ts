/**
 * POST /api/reinscripcion/mi-solicitud/enviar — Enviar solicitud al administrador
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export const runtime = 'edge';

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function POST(request: NextRequest) {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const solicitud_id = typeof body.solicitud_id === "string" ? body.solicitud_id.trim() : "";
  if (!isUUID(solicitud_id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  // Verificar pertenencia
  const { data: solicitud } = await admin
    .from("reinscripcion_solicitudes")
    .select("id, estado")
    .eq("id", solicitud_id)
    .eq("alumno_id", user.db_id)
    .maybeSingle();

  if (!solicitud) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (!["borrador", "en_revision"].includes(solicitud.estado)) {
    return NextResponse.json({ error: "Esta solicitud ya fue enviada" }, { status: 400 });
  }

  // Verificar que tenga al menos un documento
  const { count } = await admin
    .from("reinscripcion_documentos")
    .select("id", { count: "exact", head: true })
    .eq("solicitud_id", solicitud_id);

  if (!count || count === 0) {
    return NextResponse.json({ error: "Debes subir al menos un documento antes de enviar" }, { status: 400 });
  }

  const { error } = await admin
    .from("reinscripcion_solicitudes")
    .update({ estado: "enviada" })
    .eq("id", solicitud_id);

  if (error) return NextResponse.json({ error: "Error al enviar solicitud" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
