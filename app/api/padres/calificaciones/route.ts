/**
 * GET /api/padres/calificaciones   — Calificaciones del hijo vinculado al padre autenticado
 * El alumno_id viene como query param y se valida contra alumno_tutor
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(request: NextRequest) {
  const [user, err] = await requireRole("padres");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const alumno_id = searchParams.get("alumno_id") ?? "";

  if (!alumno_id || !isUUID(alumno_id)) {
    return NextResponse.json({ error: "alumno_id requerido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // SECURITY: verificar que este padre tiene ese alumno vinculado en alumno_tutor
  const { data: vinculo } = await admin
    .from("alumno_tutor")
    .select("id")
    .eq("tutor_id", user.db_id)
    .eq("alumno_id", alumno_id)
    .maybeSingle();

  if (!vinculo) {
    // No revelar si el alumno existe — solo que no tiene acceso
    return NextResponse.json({ error: "Sin acceso a este estudiante" }, { status: 403 });
  }

  const { data, error } = await admin
    .from("calificaciones")
    .select(`
      id, parcial, calificacion, fecha_registro, observaciones,
      materia:materias(id, nombre, clave),
      grupo:grupos(id, nombre, semestre, carrera:carreras(nombre)),
      maestro:maestros(id, usuarios(nombre))
    `)
    .eq("alumno_id", alumno_id)
    .order("fecha_registro", { ascending: false });

  if (error) return NextResponse.json({ error: "Error al obtener calificaciones" }, { status: 500 });

  return NextResponse.json({ calificaciones: data ?? [] });
}
