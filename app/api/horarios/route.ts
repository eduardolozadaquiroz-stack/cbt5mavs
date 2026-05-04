/**
 * GET /api/horarios   — Horario del usuario autenticado
 * Alumno: horario de su grupo | Maestro: su carga horaria | Admin: cualquier grupo (param grupo_id)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const grupo_id_param = searchParams.get("grupo_id") ?? "";

  const admin = createSupabaseAdminClient();

  const selectFields = `
    id, dia_semana, hora_inicio, hora_fin, aula,
    materia:materias(id, nombre, clave, horas_semanales),
    grupo:grupos(id, nombre, semestre, turno, carrera:carreras(nombre)),
    maestro:maestros(id, especialidad, usuarios(nombre))
  `;

  let query = admin.from("horarios").select(selectFields).order("dia_semana").order("hora_inicio");

  if (user.rol === "alumno") {
    // alumnos.id = usuarios.id = user.db_id — usar directamente como alumno_id en alumno_grupo
    const { data: alumnoData } = await admin
      .from("alumno_grupo")
      .select("grupo_id")
      .eq("alumno_id", user.db_id)
      .eq("activo", true)
      .maybeSingle();

    if (!alumnoData) return NextResponse.json({ horarios: [] });
    query = query.eq("grupo_id", alumnoData.grupo_id);

  } else if (user.rol === "maestro") {
    // maestros.id = usuarios.id = user.db_id — usar directamente como maestro_id en horarios
    query = query.eq("maestro_id", user.db_id);

  } else if (user.rol === "admin" || user.rol === "padres") {
    if (grupo_id_param && isUUID(grupo_id_param)) {
      query = query.eq("grupo_id", grupo_id_param);
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 });

  return NextResponse.json({ horarios: data ?? [] });
}
