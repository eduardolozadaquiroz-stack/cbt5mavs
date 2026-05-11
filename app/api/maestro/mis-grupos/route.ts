/**
 * GET /api/maestro/mis-grupos
 * Devuelve los grupos del maestro autenticado (via grupo_materia) con sus alumnos.
 * Cada grupo incluye la lista de materias con su grupo_materia_id para captura de calificaciones.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";


export async function GET() {
  const [user, err] = await requireRole("maestro");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // maestros.id = usuarios.id — user.db_id es el maestro_id directo en grupo_materia
  const { data: gmRaw, error: gmErr } = await admin
    .from("grupo_materia")
    .select(`
      id,
      grupo:grupos(
        id, nombre, semestre, turno,
        carrera:carreras(nombre, clave),
        ciclo:ciclos_escolares(id, nombre)
      ),
      materia:materias(id, nombre, clave)
    `)
    .eq("maestro_id", user.db_id);

  if (gmErr) {
    console.error("[GET /api/maestro/mis-grupos]", gmErr.message);
    return NextResponse.json({ grupos: [] });
  }

  // Agrupar las asignaciones por grupo_id
  const grupoMap = new Map<string, {
    id: string; nombre: string; semestre: number; turno: string;
    carrera: { nombre: string; clave: string };
    ciclo: { id: string; nombre: string } | null;
    materias: { grupo_materia_id: string; materia_id: string; nombre: string; clave: string }[];
  }>();

  (gmRaw ?? []).forEach((gm) => {
    const grupoRaw = gm.grupo as unknown as {
      id: string; nombre: string; semestre: number; turno: string;
      carrera: { nombre: string; clave: string }[];
      ciclo: { id: string; nombre: string }[];
    } | null;
    const materiaRaw = gm.materia as unknown as { id: string; nombre: string; clave: string } | null;

    if (!grupoRaw || !materiaRaw) return;

    const carreraObj = Array.isArray(grupoRaw.carrera) ? grupoRaw.carrera[0] : null;
    const cicloObj   = Array.isArray(grupoRaw.ciclo)   ? grupoRaw.ciclo[0]   : null;
    const gid = grupoRaw.id;

    if (!grupoMap.has(gid)) {
      grupoMap.set(gid, {
        id:       gid,
        nombre:   grupoRaw.nombre,
        semestre: grupoRaw.semestre,
        turno:    grupoRaw.turno,
        carrera:  { nombre: carreraObj?.nombre ?? "—", clave: carreraObj?.clave ?? "" },
        ciclo:    cicloObj ? { id: cicloObj.id, nombre: cicloObj.nombre } : null,
        materias: [],
      });
    }

    const entry = grupoMap.get(gid)!;
    // Evitar duplicados por si la consulta retorna múltiples filas iguales
    if (!entry.materias.find((m) => m.grupo_materia_id === gm.id)) {
      entry.materias.push({
        grupo_materia_id: gm.id,
        materia_id:       materiaRaw.id,
        nombre:           materiaRaw.nombre,
        clave:            materiaRaw.clave,
      });
    }
  });

  const grupos = [...grupoMap.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));

  // Para cada grupo, obtener lista de alumnos activos
  const gruposConAlumnos = await Promise.all(grupos.map(async (g) => {
    const { data: agRaw } = await admin
      .from("alumno_grupo")
      .select(`
        alumno_id,
        alumnos(
          matricula,
          promedio_general,
          estatus,
          usuarios(nombre, apellido_paterno, apellido_materno)
        )
      `)
      .eq("grupo_id", g.id)
      .eq("activo", true);

    const alumnos = (agRaw ?? []).map((r) => {
      const a = (r.alumnos as unknown) as {
        matricula: string; promedio_general: number | null; estatus: string;
        usuarios: { nombre: string; apellido_paterno: string; apellido_materno: string }[];
      } | null;
      const u = Array.isArray(a?.usuarios) ? a!.usuarios[0] : null;
      return {
        alumno_id: r.alumno_id as string,
        matricula: a?.matricula ?? "—",
        nombre: u
          ? [u.apellido_paterno, u.apellido_materno, u.nombre].filter(Boolean).join(" ")
          : "—",
        promedio_general: a?.promedio_general ?? null,
        estatus: a?.estatus ?? "regular",
      };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));

    const reprobados = alumnos.filter((a) => a.promedio_general !== null && a.promedio_general < 6).length;
    return { ...g, alumnos, reprobados };
  }));

  return NextResponse.json({ grupos: gruposConAlumnos });
}
