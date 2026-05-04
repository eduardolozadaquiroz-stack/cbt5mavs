/**
 * GET /api/maestro/mis-grupos
 * Devuelve los grupos del maestro autenticado (via horarios) con sus alumnos
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const [user, err] = await requireRole("maestro");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // Obtener grupos únicos del maestro desde horarios
  const { data: horRaw } = await admin
    .from("horarios")
    .select(`
      grupo_id,
      materia:materias(nombre),
      grupo:grupos(
        id, nombre, semestre, turno,
        carrera:carreras(nombre, clave),
        ciclo:ciclos_escolares(nombre)
      )
    `)
    .eq("maestro_id", user.db_id);

  // Deduplicar grupos
  const grupoMap = new Map<string, {
    id: string; nombre: string; semestre: number; turno: string;
    carrera: { nombre: string; clave: string };
    ciclo: { nombre: string } | null;
    materias: string[];
  }>();

  (horRaw ?? []).forEach((h) => {
    const g = (h.grupo as unknown) as { id: string; nombre: string; semestre: number; turno: string; carrera: { nombre: string; clave: string }[]; ciclo: { nombre: string }[] } | null;
    if (!g) return;
    const id = g.id;
    const carreraObj = Array.isArray(g.carrera) ? g.carrera[0] : null;
    const cicloObj = Array.isArray(g.ciclo) ? g.ciclo[0] : null;
    const matObj = (h.materia as unknown) as { nombre: string } | null;
    const matNombre = Array.isArray(matObj) ? (matObj as unknown as { nombre: string }[])[0]?.nombre : (matObj as { nombre: string } | null)?.nombre;
    if (!grupoMap.has(id)) {
      grupoMap.set(id, {
        id,
        nombre: g.nombre,
        semestre: g.semestre,
        turno: g.turno,
        carrera: { nombre: carreraObj?.nombre ?? "—", clave: carreraObj?.clave ?? "" },
        ciclo: cicloObj ? { nombre: cicloObj.nombre } : null,
        materias: [],
      });
    }
    const entry = grupoMap.get(id)!;
    if (matNombre && !entry.materias.includes(matNombre)) {
      entry.materias.push(matNombre);
    }
  });

  const grupos = [...grupoMap.values()];

  // Para cada grupo, obtener lista de alumnos con calificaciones del maestro
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
      const a = (r.alumnos as unknown) as { matricula: string; promedio_general: number | null; estatus: string; usuarios: { nombre: string; apellido_paterno: string; apellido_materno: string }[] } | null;
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
