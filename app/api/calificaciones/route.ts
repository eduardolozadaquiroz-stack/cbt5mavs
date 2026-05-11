/**
 * GET  /api/calificaciones   — Lista calificaciones del usuario autenticado
 *                              (alumno: sus propias | maestro: sus grupos | admin: todas)
 * POST /api/calificaciones   — Registra/actualiza calificaciones en batch (maestro o admin)
 *
 * Schema: calificaciones(alumno_id, grupo_materia_id, parcial, calificacion, capturado_por, ...)
 * UNIQUE constraint: (alumno_id, grupo_materia_id, parcial)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth, requireRole, auditLog } from "@/lib/auth";
import { isUUID } from "@/lib/validate";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const grupo_materia_id = searchParams.get("grupo_materia_id") ?? "";
  const alumno_id_param  = searchParams.get("alumno_id") ?? "";
  const parcial_param    = searchParams.get("parcial") ?? "";

  const admin = createSupabaseAdminClient();

  let query = admin
    .from("calificaciones")
    .select(`
      id, parcial, calificacion, calificacion_final, faltas, estatus, observaciones, fecha_captura,
      alumno:alumnos(
        id, matricula,
        usuarios(nombre, apellido_paterno, apellido_materno)
      ),
      grupo_materia:grupo_materia(
        id,
        materia:materias(id, nombre, clave),
        grupo:grupos(id, nombre, semestre, carrera:carreras(nombre)),
        ciclo:ciclos_escolares(id, nombre)
      ),
      capturado_por_usuario:usuarios!capturado_por(nombre)
    `)
    .order("fecha_captura", { ascending: false });

  if (user.rol === "alumno") {
    // alumnos.id = usuarios.id — filtrar por alumno_id directamente
    query = query.eq("alumno_id", user.db_id);

  } else if (user.rol === "maestro") {
    // Obtener los grupo_materia_id asignados a este maestro
    // maestros.id = usuarios.id → user.db_id es directo
    const { data: gmIds } = await admin
      .from("grupo_materia")
      .select("id")
      .eq("maestro_id", user.db_id);

    const ids = (gmIds ?? []).map((r) => r.id as string);
    if (ids.length === 0) return NextResponse.json({ calificaciones: [] });

    query = query.in("grupo_materia_id", ids);
    if (alumno_id_param && isUUID(alumno_id_param)) query = query.eq("alumno_id", alumno_id_param);
    if (grupo_materia_id && isUUID(grupo_materia_id)) query = query.eq("grupo_materia_id", grupo_materia_id);

  } else if (user.rol === "admin") {
    if (grupo_materia_id && isUUID(grupo_materia_id)) query = query.eq("grupo_materia_id", grupo_materia_id);
    if (alumno_id_param  && isUUID(alumno_id_param))  query = query.eq("alumno_id", alumno_id_param);
  } else {
    return NextResponse.json({ error: "Use /api/padres/calificaciones" }, { status: 403 });
  }

  if (parcial_param) {
    const p = parseInt(parcial_param, 10);
    if ([1, 2, 3].includes(p)) query = query.eq("parcial", p);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[GET /api/calificaciones]", error.message);
    return NextResponse.json({ error: "Error al obtener calificaciones" }, { status: 500 });
  }

  return NextResponse.json({ calificaciones: data ?? [] });
}

interface CalifItem {
  alumno_id: string;
  grupo_materia_id: string;
  parcial: number;
  calificacion: number;
  observaciones?: string | null;
}

export async function POST(request: NextRequest) {
  const [user, err] = await requireRole("admin", "maestro");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  // Acepta batch: { calificaciones: [{alumno_id, grupo_materia_id, parcial, calificacion, observaciones?}] }
  const items: unknown[] = Array.isArray(body.calificaciones) ? body.calificaciones : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "calificaciones[] no puede estar vacío" }, { status: 400 });
  }
  if (items.length > 100) {
    return NextResponse.json({ error: "Máximo 100 calificaciones por lote" }, { status: 400 });
  }

  // Validar cada item
  const parsed: CalifItem[] = [];
  for (const item of items) {
    if (typeof item !== "object" || item === null) {
      return NextResponse.json({ error: "Cada elemento debe ser un objeto" }, { status: 400 });
    }
    const it = item as Record<string, unknown>;
    const alumno_id       = typeof it.alumno_id === "string" ? it.alumno_id.trim() : "";
    const grupo_materia_id = typeof it.grupo_materia_id === "string" ? it.grupo_materia_id.trim() : "";
    const parcial         = typeof it.parcial === "number" ? it.parcial : parseInt(String(it.parcial), 10);
    const calificacion    = typeof it.calificacion === "number" ? it.calificacion : parseFloat(String(it.calificacion));
    const observaciones   = typeof it.observaciones === "string" ? it.observaciones.trim().slice(0, 500) : null;

    if (!isUUID(alumno_id) || !isUUID(grupo_materia_id)) {
      return NextResponse.json({ error: "alumno_id y grupo_materia_id deben ser UUID válidos" }, { status: 400 });
    }
    if (![1, 2, 3].includes(parcial)) {
      return NextResponse.json({ error: "parcial debe ser 1, 2 o 3" }, { status: 400 });
    }
    if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
      return NextResponse.json({ error: "calificacion debe ser entre 0 y 10" }, { status: 400 });
    }
    parsed.push({ alumno_id, grupo_materia_id, parcial, calificacion, observaciones });
  }

  const admin = createSupabaseAdminClient();

  // Para maestro: verificar que todos los grupo_materia_id le pertenecen
  if (user.rol === "maestro") {
    const gmIdsReq = [...new Set(parsed.map((p) => p.grupo_materia_id))];
    const { data: gmCheck } = await admin
      .from("grupo_materia")
      .select("id")
      .in("id", gmIdsReq)
      .eq("maestro_id", user.db_id);

    const allowed = new Set((gmCheck ?? []).map((r) => r.id as string));
    const forbidden = gmIdsReq.find((id) => !allowed.has(id));
    if (forbidden) {
      return NextResponse.json({ error: "No tienes permisos para uno o más grupo_materia indicados" }, { status: 403 });
    }
  }

  const now = new Date().toISOString();
  const rows = parsed.map((p) => ({
    alumno_id:        p.alumno_id,
    grupo_materia_id: p.grupo_materia_id,
    parcial:          p.parcial,
    calificacion:     p.calificacion,
    observaciones:    p.observaciones,
    capturado_por:    user.db_id,
    fecha_captura:    now,
    updated_at:       now,
    estatus:          "aprobado" as const,
  }));

  const { data, error } = await admin
    .from("calificaciones")
    .upsert(rows, { onConflict: "alumno_id,grupo_materia_id,parcial" })
    .select("id");

  if (error) {
    console.error("[POST /api/calificaciones]", error.code, error.message);
    return NextResponse.json({ error: "Error al guardar calificaciones" }, { status: 500 });
  }

  await auditLog(user.db_id, "calificaciones", "UPSERT_BATCH", null, {
    count: rows.length,
    grupo_materia_ids: [...new Set(rows.map((r) => r.grupo_materia_id))],
    parcial: rows[0]?.parcial,
  });

  return NextResponse.json({ ok: true, guardados: data?.length ?? 0 }, { status: 201 });
}

