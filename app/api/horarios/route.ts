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

const DIA_NUM: Record<string, number> = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function GET(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const grupo_id_param = searchParams.get("grupo_id") ?? "";

  const admin = createSupabaseAdminClient();

  const selectFields = `
    id, dia_semana, hora_inicio, hora_fin, aula,
    grupo_materia:grupo_materia!inner(
      id,
      materia:materias(id, nombre, clave, horas_semanales),
      grupo:grupos(id, nombre, semestre, turno, carrera:carreras(nombre)),
      maestro:maestros(id, especialidad, usuarios(nombre))
    )
  `;

  let query = admin.from("horarios").select(selectFields).order("dia_semana").order("hora_inicio");

  if (user.rol === "alumno") {
    // Verificar si el alumno está en prácticas o servicio social
    const { data: alumnoData } = await admin
      .from("alumnos")
      .select("estatus")
      .eq("id", user.db_id)
      .single();

    if (alumnoData?.estatus === "practicas" || alumnoData?.estatus === "servicio_social") {
      // Obtener detalles de la actividad activa
      const { data: actividad } = await admin
        .from("alumno_actividad_especial")
        .select("tipo, empresa, responsable, fecha_inicio, fecha_fin, horas_requeridas, horas_cumplidas")
        .eq("alumno_id", user.db_id)
        .eq("estatus", "activo")
        .maybeSingle();

      return NextResponse.json({
        horarios: [],
        estatus_especial: alumnoData.estatus,
        actividad: actividad ?? null,
      });
    }

    // alumnos.id = usuarios.id = user.db_id — usar directamente como alumno_id en alumno_grupo
    const { data: alumnoGrupo } = await admin
      .from("alumno_grupo")
      .select("grupo_id")
      .eq("alumno_id", user.db_id)
      .eq("activo", true)
      .maybeSingle();

    if (!alumnoGrupo) return NextResponse.json({ horarios: [], estatus_especial: null });
    query = query.eq("grupo_materia.grupo_id", alumnoGrupo.grupo_id);

  } else if (user.rol === "maestro") {
    // maestros.id = usuarios.id = user.db_id — usar directamente como maestro_id en horarios
    query = query.eq("grupo_materia.maestro_id", user.db_id);

  } else if (user.rol === "admin" || user.rol === "padres") {
    if (grupo_id_param && isUUID(grupo_id_param)) {
      query = query.eq("grupo_materia.grupo_id", grupo_id_param);
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 });

  const horarios = ((data ?? []) as Array<{
    id: string;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    aula: string | null;
    grupo_materia: unknown;
  }>).map((slot) => {
    const gm = firstOrSelf(slot.grupo_materia as {
      id: string;
      materia: unknown;
      grupo: unknown;
      maestro: { usuarios?: unknown } | null;
    } | Array<{
      id: string;
      materia: unknown;
      grupo: unknown;
      maestro: { usuarios?: unknown } | null;
    }> | null);
    const maestro = gm?.maestro
      ? { ...gm.maestro, usuarios: firstOrSelf(gm.maestro.usuarios as { nombre: string } | { nombre: string }[] | null) }
      : null;

    return {
      id: slot.id,
      dia_semana: DIA_NUM[slot.dia_semana] ?? slot.dia_semana,
      dia_semana_key: slot.dia_semana,
      hora_inicio: slot.hora_inicio,
      hora_fin: slot.hora_fin,
      aula: slot.aula,
      grupo_materia_id: gm?.id ?? null,
      materia: firstOrSelf(gm?.materia as { id: string; nombre: string; clave: string; horas_semanales: number } | Array<{ id: string; nombre: string; clave: string; horas_semanales: number }> | null),
      grupo: firstOrSelf(gm?.grupo as { id: string; nombre: string; semestre: number; turno: string; carrera: { nombre: string } } | Array<{ id: string; nombre: string; semestre: number; turno: string; carrera: { nombre: string } }> | null),
      maestro,
    };
  });

  return NextResponse.json({ horarios });
}
