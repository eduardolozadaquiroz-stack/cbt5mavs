/**
 * GET /api/padres/horarios?alumno_id=xxx
 * Retorna el horario del grupo del alumno indicado.
 * Solo accesible por padres (o admin).
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";


export async function GET(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  if (user.rol !== "padres" && user.rol !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const alumno_id = request.nextUrl.searchParams.get("alumno_id") ?? "";
  if (!alumno_id) {
    return NextResponse.json({ error: "alumno_id requerido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Obtener el grupo activo del alumno
  const { data: alumnoGrupo, error: grupoError } = await admin
    .from("alumno_grupo")
    .select("grupo_id")
    .eq("alumno_id", alumno_id)
    .eq("activo", true)
    .maybeSingle();

  if (grupoError) {
    return NextResponse.json({ error: "Error al buscar grupo del alumno" }, { status: 500 });
  }

  if (!alumnoGrupo) {
    return NextResponse.json({ horarios: [], grupoInfo: null });
  }

  const { data, error } = await admin
    .from("horarios")
    .select(`
      id, dia_semana, hora_inicio, hora_fin, aula,
      materia:materias(id, nombre, clave),
      grupo:grupos(id, nombre, semestre, turno, carrera:carreras(nombre)),
      maestro:maestros(id, especialidad, usuarios(nombre))
    `)
    .eq("grupo_id", alumnoGrupo.grupo_id)
    .order("dia_semana")
    .order("hora_inicio");

  if (error) {
    return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 });
  }

  return NextResponse.json({ horarios: data ?? [] });
}
