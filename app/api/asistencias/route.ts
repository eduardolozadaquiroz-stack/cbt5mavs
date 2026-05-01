/**
 * GET  /api/asistencias   — Lista asistencias del usuario autenticado
 * POST /api/asistencias   — Registra asistencia (maestro o admin)
 * PATCH /api/asistencias  — Actualiza estado de asistencia (maestro o admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth, requireRole } from "@/lib/auth";

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

const ESTADOS_VALIDOS = ["P", "F", "J"] as const;
type Estado = typeof ESTADOS_VALIDOS[number];

export async function GET(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const grupo_id   = searchParams.get("grupo_id") ?? "";
  const materia_id = searchParams.get("materia_id") ?? "";
  const fecha_from = searchParams.get("fecha_from") ?? "";
  const fecha_to   = searchParams.get("fecha_to") ?? "";

  const admin = createSupabaseAdminClient();

  let query = admin
    .from("asistencias")
    .select(`
      id, fecha, estatus, justificacion,
      alumno:alumnos(id, matricula, usuarios(nombre)),
      materia:materias(id, nombre),
      grupo:grupos(id, nombre, semestre)
    `)
    .order("fecha", { ascending: false });

  if (user.rol === "alumno") {
    const { data: alumnoData } = await admin
      .from("alumnos")
      .select("id")
      .eq("usuario_id", user.db_id)
      .single();
    if (!alumnoData) return NextResponse.json({ asistencias: [] });
    query = query.eq("alumno_id", alumnoData.id);
  } else if (user.rol === "maestro") {
    const { data: maestroData } = await admin
      .from("maestros")
      .select("id")
      .eq("usuario_id", user.db_id)
      .single();
    if (!maestroData) return NextResponse.json({ asistencias: [] });
    query = query.eq("maestro_id", maestroData.id);
    if (grupo_id   && isUUID(grupo_id))   query = query.eq("grupo_id",   grupo_id);
    if (materia_id && isUUID(materia_id)) query = query.eq("materia_id", materia_id);
  } else if (user.rol === "admin") {
    if (grupo_id   && isUUID(grupo_id))   query = query.eq("grupo_id",   grupo_id);
    if (materia_id && isUUID(materia_id)) query = query.eq("materia_id", materia_id);
  } else {
    return NextResponse.json({ error: "Use /api/padres/asistencias" }, { status: 403 });
  }

  if (fecha_from) query = query.gte("fecha", fecha_from);
  if (fecha_to)   query = query.lte("fecha", fecha_to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener asistencias" }, { status: 500 });

  return NextResponse.json({ asistencias: data ?? [] });
}

export async function POST(request: NextRequest) {
  const [user, err] = await requireRole("admin", "maestro");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  // Permite registrar múltiples asistencias de una vez (lista de alumnos del grupo)
  const registros = Array.isArray(body.registros) ? body.registros : [body];

  const admin = createSupabaseAdminClient();
  let maestro_id: string | null = null;

  if (user.rol === "maestro") {
    const { data: maestroData } = await admin
      .from("maestros")
      .select("id")
      .eq("usuario_id", user.db_id)
      .single();
    if (!maestroData) return NextResponse.json({ error: "Maestro no encontrado" }, { status: 403 });
    maestro_id = maestroData.id;
  }

  // Validar y preparar registros
  const inserts: Array<Record<string, unknown>> = [];
  for (const r of registros) {
    const alumno_id  = typeof r.alumno_id === "string" ? r.alumno_id.trim() : "";
    const materia_id = typeof r.materia_id === "string" ? r.materia_id.trim() : "";
    const grupo_id   = typeof r.grupo_id === "string" ? r.grupo_id.trim() : "";
    const fecha      = typeof r.fecha === "string" ? r.fecha.trim().slice(0, 10) : "";
    const estatus    = typeof r.estatus === "string" ? r.estatus.trim().toUpperCase() : "";

    if (!isUUID(alumno_id) || !isUUID(materia_id) || !isUUID(grupo_id) || !fecha) {
      return NextResponse.json({ error: "Campos requeridos: alumno_id, materia_id, grupo_id, fecha" }, { status: 400 });
    }
    if (!ESTADOS_VALIDOS.includes(estatus as Estado)) {
      return NextResponse.json({ error: "estatus debe ser P, F o J" }, { status: 400 });
    }

    inserts.push({
      alumno_id,
      materia_id,
      grupo_id,
      fecha,
      estatus,
      maestro_id,
      justificacion: typeof r.justificacion === "string" ? r.justificacion.slice(0, 500) : null,
    });
  }

  const { error } = await admin
    .from("asistencias")
    .upsert(inserts, { onConflict: "alumno_id,materia_id,fecha" });

  if (error) return NextResponse.json({ error: "Error al registrar asistencias" }, { status: 500 });

  return NextResponse.json({ ok: true, count: inserts.length }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const [user, err] = await requireRole("admin", "maestro");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!isUUID(id)) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  const updates: Record<string, string | null> = {};
  if (typeof body.estatus === "string" && ESTADOS_VALIDOS.includes(body.estatus.toUpperCase() as Estado)) {
    updates.estatus = body.estatus.toUpperCase();
  }
  if (typeof body.justificacion === "string") {
    updates.justificacion = body.justificacion.slice(0, 500);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios válidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("asistencias").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
