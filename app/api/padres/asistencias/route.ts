/**
 * GET /api/padres/asistencias   — Asistencias del hijo vinculado al padre autenticado
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export const runtime = 'edge';

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(request: NextRequest) {
  const [user, err] = await requireRole("padres");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const alumno_id  = searchParams.get("alumno_id") ?? "";
  const fecha_from = searchParams.get("fecha_from") ?? "";
  const fecha_to   = searchParams.get("fecha_to") ?? "";

  if (!alumno_id || !isUUID(alumno_id)) {
    return NextResponse.json({ error: "alumno_id requerido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // SECURITY: verificar vínculo padre-hijo
  const { data: vinculo } = await admin
    .from("alumno_tutor")
    .select("id")
    .eq("tutor_id", user.db_id)
    .eq("alumno_id", alumno_id)
    .maybeSingle();

  if (!vinculo) {
    return NextResponse.json({ error: "Sin acceso a este estudiante" }, { status: 403 });
  }

  let query = admin
    .from("asistencias")
    .select(`
      id, fecha, estatus, justificacion,
      materia:materias(id, nombre),
      grupo:grupos(id, nombre, semestre)
    `)
    .eq("alumno_id", alumno_id)
    .order("fecha", { ascending: false });

  if (fecha_from) query = query.gte("fecha", fecha_from);
  if (fecha_to)   query = query.lte("fecha", fecha_to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener asistencias" }, { status: 500 });

  return NextResponse.json({ asistencias: data ?? [] });
}
