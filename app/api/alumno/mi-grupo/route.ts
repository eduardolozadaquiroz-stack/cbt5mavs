/**
 * GET /api/alumno/mi-grupo
 * Devuelve el grupo activo del alumno autenticado + compañeros + materias
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export const runtime = 'edge';

export async function GET() {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // Grupo activo del alumno
  const { data: ag } = await admin
    .from("alumno_grupo")
    .select(`
      grupo_id,
      grupo:grupos(
        id, nombre, semestre, turno, activo,
        carrera:carreras(nombre, clave),
        ciclo:ciclos_escolares(nombre)
      )
    `)
    .eq("alumno_id", user.db_id)
    .eq("activo", true)
    .maybeSingle();

  if (!ag) return NextResponse.json({ grupo: null, companeros: [], materias: [] });

  const grupo_id = ag.grupo_id;

  // Compañeros del mismo grupo
  const { data: compRaw } = await admin
    .from("alumno_grupo")
    .select(`
      alumno_id,
      alumnos(
        matricula,
        usuarios(nombre, apellido_paterno, apellido_materno)
      )
    `)
    .eq("grupo_id", grupo_id)
    .eq("activo", true);

  const companeros = (compRaw ?? [])
    .filter((r) => r.alumno_id !== user.db_id)
    .map((r) => {
      const a = (r.alumnos as unknown) as { matricula: string; usuarios: { nombre: string; apellido_paterno: string; apellido_materno: string }[] } | null;
      const u = Array.isArray(a?.usuarios) ? a!.usuarios[0] : null;
      return {
        alumno_id: r.alumno_id,
        matricula: a?.matricula ?? "—",
        nombre: u
          ? [u.apellido_paterno, u.apellido_materno, u.nombre].filter(Boolean).join(" ")
          : "—",
      };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  // Materias del grupo (a través de horarios)
  const { data: hRaw } = await admin
    .from("horarios")
    .select(`
      materia:materias(id, nombre),
      aula,
      maestro:maestros(id, usuarios(nombre))
    `)
    .eq("grupo_id", grupo_id);

  // Deduplicar por materia id
  const materiasMap = new Map<string, { nombre: string; maestro: string; aula: string | null }>();
  (hRaw ?? []).forEach((h) => {
    const m = (h.materia as unknown) as { id: string; nombre: string }[] | null;
    const mat = Array.isArray(m) ? m[0] : null;
    if (!mat) return;
    if (!materiasMap.has(mat.id)) {
      const mae = (h.maestro as unknown) as { id: string; usuarios: { nombre: string }[] }[] | null;
      const maeObj = Array.isArray(mae) ? mae[0] : null;
      const maeU = Array.isArray(maeObj?.usuarios) ? maeObj!.usuarios[0] : null;
      materiasMap.set(mat.id, {
        nombre: mat.nombre,
        maestro: maeU?.nombre ?? "—",
        aula: h.aula ?? null,
      });
    }
  });

  return NextResponse.json({
    grupo: ag.grupo,
    companeros,
    materias: [...materiasMap.values()],
  });
}
