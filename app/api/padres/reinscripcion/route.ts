/**
 * GET /api/padres/reinscripcion
 * Retorna el estado de reinscripción de todos los alumnos vinculados al padre.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const [user, err] = await requireRole("padres");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // Obtener ciclo activo y config
  const { data: cfg } = await admin.from("site_config").select("config").eq("id", 1).single();
  const reinConfig = ((cfg?.config as Record<string, unknown>)?.reinscripcion as Record<string, unknown>) ?? {};
  const habilitada   = reinConfig.habilitada as boolean ?? false;

  // Usar ciclos_escolares como fuente canónica (igual que el alumno al crear la solicitud)
  const { data: cicloActivo } = await admin.from("ciclos_escolares").select("nombre").eq("activo", true).maybeSingle();
  const cicloEscolar: string = cicloActivo?.nombre ?? (reinConfig.cicloEscolar as string) ?? "";

  // Obtener alumnos vinculados
  const { data: vinculos } = await admin
    .from("alumno_tutor")
    .select("alumno_id, alumnos( id, matricula, semestre_actual, usuarios( nombre, apellido_paterno, apellido_materno ) )")
    .eq("tutor_id", user.db_id);

  if (!vinculos || vinculos.length === 0) {
    return NextResponse.json({ alumnos: [], cicloEscolar, habilitada });
  }

  const alumnoIds = vinculos.map(v => v.alumno_id as string);

  // Obtener solicitudes del ciclo activo para esos alumnos
  const { data: solicitudes } = await admin
    .from("reinscripcion_solicitudes")
    .select(`
      id, alumno_id, estado, notas_admin, updated_at,
      reinscripcion_documentos ( id, nombre, estado )
    `)
    .in("alumno_id", alumnoIds)
    .eq("ciclo_escolar", cicloEscolar);

  const solicitudMap = new Map((solicitudes ?? []).map(s => [s.alumno_id as string, s]));

  const alumnos = vinculos.map(v => {
    const alumno  = v.alumnos as unknown as Record<string, unknown> | null;
    const usuario = alumno?.usuarios as Record<string, unknown> | null;
    const sol     = solicitudMap.get(v.alumno_id as string) ?? null;
    const docs    = (sol?.reinscripcion_documentos as { id: string; nombre: string; estado: string }[] | null) ?? [];

    return {
      alumno_id: v.alumno_id,
      nombre: usuario
        ? [usuario.apellido_paterno, usuario.apellido_materno, usuario.nombre].filter(Boolean).join(" ")
        : "Alumno",
      matricula:   alumno?.matricula as string ?? "—",
      semestre:    alumno?.semestre_actual as number ?? 0,
      solicitud_id:     sol?.id ?? null,
      estado:           sol?.estado ?? "sin_solicitud",
      notas_admin:      sol?.notas_admin ?? null,
      updated_at:       sol?.updated_at ?? null,
      total_docs:       docs.length,
      docs_aprobados:   docs.filter(d => d.estado === "aprobado").length,
      docs_rechazados:  docs.filter(d => d.estado === "rechazado").length,
    };
  });

  return NextResponse.json({ alumnos, cicloEscolar, habilitada });
}
