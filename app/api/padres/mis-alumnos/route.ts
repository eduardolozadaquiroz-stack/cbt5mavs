/**
 * GET /api/padres/mis-alumnos
 *
 * Retorna ÚNICAMENTE los alumnos vinculados al padre/tutor autenticado.
 *
 * Seguridad (A01 – Broken Access Control):
 * - Requiere JWT válido con rol "padres"
 * - Consulta la tabla alumno_tutor usando el ID del tutor autenticado
 * - Nunca acepta un alumno_id externo — solo consulta los vínculos del DB
 * - Un padre NO puede acceder a datos de alumnos que no sean sus hijos
 */
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/padres/mis-alumnos");

export async function GET() {
  // 1. Verificar JWT y rol padres
  const [authUser, authErr] = await requireRole("padres");
  if (authErr) return authErr;

  const supabase = await createSupabaseServerClient();

  // 2. Consultar solo los alumnos vinculados a ESTE tutor
  //    La columna tutor_id = authUser.db_id (ID interno, no auth_id externo)
  const { data, error } = await supabase
    .from("alumno_tutor")
    .select(`
      alumno_id,
      alumnos (
        matricula,
        semestre_actual,
        estatus,
        carreras ( nombre, clave ),
        usuarios ( nombre, apellido_paterno, apellido_materno )
      )
    `)
    .eq("tutor_id", authUser.db_id);

  if (error) {
    log.error("Error al consultar alumnos vinculados", { message: error.message });
    return NextResponse.json(
      { error: "Error al obtener alumnos vinculados" },
      { status: 500 }
    );
  }

  // 3. Transformar a formato limpio para el cliente
  //    NOTA: Supabase retorna el join con el nombre de la tabla en plural ("alumnos"),
  //    no como "alumno". Acceder a la clave correcta es crítico para que los datos aparezcan.
  const alumnos = (data ?? []).map((row: Record<string, unknown>) => {
    // ✅ Corrección: la clave es "alumnos" (nombre de la tabla), no "alumno"
    const alumno  = row.alumnos  as Record<string, unknown> | null;
    const usuario = alumno?.usuarios as Record<string, unknown> | null;
    const carrera = alumno?.carreras as Record<string, unknown> | null;

    return {
      alumno_id: row.alumno_id as string,
      matricula: alumno?.matricula as string,
      nombre: usuario
        ? [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno]
            .filter(Boolean)
            .join(" ")
        : "Alumno",
      semestre: alumno?.semestre_actual as number,
      grupo:    "—",
      carrera:  (carrera?.nombre as string) ?? "—",
      estatus:  alumno?.estatus as string,
    };
  });

  return NextResponse.json({ alumnos });
}
