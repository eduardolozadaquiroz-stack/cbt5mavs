/**
 * GET  /api/calificaciones   — Lista calificaciones del usuario autenticado
 *                              (alumno: sus propias | maestro: sus grupos | admin: todas)
 * POST /api/calificaciones   — Registra/actualiza calificación (maestro o admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth, requireRole, auditLog } from "@/lib/auth";
import { isUUID } from "@/lib/validate";

export async function GET(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const ciclo_id    = searchParams.get("ciclo_id") ?? "";
  const alumno_id   = searchParams.get("alumno_id") ?? "";
  const grupo_id    = searchParams.get("grupo_id") ?? "";

  const admin = createSupabaseAdminClient();

  let query = admin
    .from("calificaciones")
    .select(`
      id, parcial, calificacion, fecha_registro, observaciones,
      alumno:alumnos(id, matricula, usuarios(nombre)),
      materia:materias(id, nombre, clave),
      grupo:grupos(id, nombre, semestre, carrera:carreras(nombre)),
      maestro:maestros(id, usuarios(nombre))
    `)
    .order("fecha_registro", { ascending: false });

  // Filtro por rol: cada rol solo ve lo que le corresponde (defensa en profundidad)
  if (user.rol === "alumno") {
    // Obtener alumno_id del usuario
    // alumnos.id = usuarios.id (PK compartida)
    query = query.eq("alumno_id", user.db_id);
  } else if (user.rol === "maestro") {
    // maestros.id = usuarios.id (PK compartida)
    query = query.eq("maestro_id", user.db_id);
    if (alumno_id && isUUID(alumno_id)) query = query.eq("alumno_id", alumno_id);
    if (grupo_id  && isUUID(grupo_id))  query = query.eq("grupo_id",  grupo_id);
  } else if (user.rol === "admin") {
    // Admin puede filtrar por cualquier campo
    if (alumno_id && isUUID(alumno_id)) query = query.eq("alumno_id", alumno_id);
    if (grupo_id  && isUUID(grupo_id))  query = query.eq("grupo_id",  grupo_id);
    if (ciclo_id  && isUUID(ciclo_id))  query = query.eq("ciclo_id",  ciclo_id);
  } else {
    // padres: no pueden acceder directamente — usar /api/padres/calificaciones
    return NextResponse.json({ error: "Use /api/padres/calificaciones" }, { status: 403 });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener calificaciones" }, { status: 500 });

  return NextResponse.json({ calificaciones: data ?? [] });
}

export async function POST(request: NextRequest) {
  const [user, err] = await requireRole("admin", "maestro");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const alumno_id    = typeof body.alumno_id === "string" ? body.alumno_id.trim() : "";
  const materia_id   = typeof body.materia_id === "string" ? body.materia_id.trim() : "";
  const grupo_id     = typeof body.grupo_id === "string" ? body.grupo_id.trim() : "";
  const ciclo_id     = typeof body.ciclo_id === "string" ? body.ciclo_id.trim() : "";
  const parcial      = typeof body.parcial === "number" ? body.parcial : parseInt(String(body.parcial), 10);
  const calificacion = typeof body.calificacion === "number" ? body.calificacion : parseFloat(String(body.calificacion));
  const observaciones = typeof body.observaciones === "string" ? body.observaciones.trim().slice(0, 500) : null;

  if (!isUUID(alumno_id) || !isUUID(materia_id) || !isUUID(grupo_id)) {
    return NextResponse.json({ error: "alumno_id, materia_id, grupo_id son requeridos (UUID)" }, { status: 400 });
  }
  if (![1, 2, 3].includes(parcial)) {
    return NextResponse.json({ error: "parcial debe ser 1, 2 o 3" }, { status: 400 });
  }
  if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
    return NextResponse.json({ error: "calificacion debe ser entre 0 y 10" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Para maestro: verificar que tiene asignado este grupo/materia
  let maestro_id: string | null = null;
  if (user.rol === "maestro") {
    const { data: maestroData } = await admin
      .from("maestros")
      .select("id")
      .eq("usuario_id", user.db_id)
      .single();
    if (!maestroData) return NextResponse.json({ error: "Maestro no encontrado" }, { status: 403 });
    maestro_id = maestroData.id;

    // Verificar que el maestro tiene asignado este grupo y materia
    const { data: asignacion } = await admin
      .from("grupo_materia")
      .select("id")
      .eq("grupo_id", grupo_id)
      .eq("materia_id", materia_id)
      .eq("maestro_id", maestro_id)
      .maybeSingle();

    if (!asignacion) {
      return NextResponse.json({ error: "No tienes asignado este grupo/materia" }, { status: 403 });
    }
  }

  // Upsert: si ya existe la calificación para ese alumno/materia/grupo/parcial, actualiza
  const { data, error } = await admin
    .from("calificaciones")
    .upsert(
      {
        alumno_id,
        materia_id,
        grupo_id,
        ciclo_id: ciclo_id || null,
        parcial,
        calificacion,
        observaciones,
        maestro_id,
      },
      { onConflict: "alumno_id,materia_id,grupo_id,parcial" }
    )
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Error al guardar calificación" }, { status: 500 });

  // A09 – Audit log: mutaciones en calificaciones son trazables
  await auditLog(user.db_id, "calificaciones", "UPSERT", data.id, {
    alumno_id, materia_id, grupo_id, parcial, calificacion
  });

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
