/**
 * GET  /api/admin/actividades?alumno_id=<uuid>   — Lista actividades de un alumno
 * POST /api/admin/actividades                     — Registrar nueva actividad (prácticas/SS)
 * PATCH /api/admin/actividades                    — Actualizar horas, estatus, fecha_fin
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, auditLog } from "@/lib/auth";
import { sanitize } from "@/lib/validate";

export const runtime = 'edge';

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

const TIPOS_VALIDOS     = ["practicas", "servicio_social"] as const;
const ESTATUSES_VALIDOS = ["activo", "completado", "cancelado"] as const;

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin", "maestro");
  if (err) return err;

  const alumno_id = sanitize(request.nextUrl.searchParams.get("alumno_id") ?? "", 36);
  if (!alumno_id || !isUUID(alumno_id)) {
    return NextResponse.json({ error: "alumno_id requerido (UUID)" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("alumno_actividad_especial")
    .select(`
      id, tipo, empresa, responsable, fecha_inicio, fecha_fin,
      horas_requeridas, horas_cumplidas, estatus, semestre_id,
      documento_url, observaciones, created_at,
      ciclo:ciclos_escolares(nombre, periodo)
    `)
    .eq("alumno_id", alumno_id)
    .order("fecha_inicio", { ascending: false });

  if (error) return NextResponse.json({ error: "Error al obtener actividades" }, { status: 500 });
  return NextResponse.json({ actividades: data ?? [] });
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const alumno_id       = sanitize(body.alumno_id as string, 36);
  const tipo            = sanitize(body.tipo as string, 20);
  const empresa         = sanitize(body.empresa as string, 200);
  const responsable     = sanitize(body.responsable as string, 120);
  const fecha_inicio    = sanitize(body.fecha_inicio as string, 10);
  const fecha_fin       = sanitize(body.fecha_fin as string ?? "", 10);
  const horas_requeridas = typeof body.horas_requeridas === "number" ? body.horas_requeridas : 480;
  const semestre_id     = typeof body.semestre_id === "number" ? body.semestre_id : null;
  const ciclo_id        = sanitize(body.ciclo_id as string ?? "", 36);
  const observaciones   = sanitize(body.observaciones as string ?? "", 1000);
  const documento_url   = sanitize(body.documento_url as string ?? "", 500);

  if (!isUUID(alumno_id)) return NextResponse.json({ error: "alumno_id inválido" }, { status: 400 });
  if (!TIPOS_VALIDOS.includes(tipo as typeof TIPOS_VALIDOS[number])) {
    return NextResponse.json({ error: `tipo debe ser: ${TIPOS_VALIDOS.join(" | ")}` }, { status: 400 });
  }
  if (!fecha_inicio) return NextResponse.json({ error: "fecha_inicio requerida" }, { status: 400 });
  if (horas_requeridas < 1 || horas_requeridas > 2000) {
    return NextResponse.json({ error: "horas_requeridas debe estar entre 1 y 2000" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Verificar que el alumno existe
  const { data: alumno } = await admin
    .from("alumnos")
    .select("id, semestre_actual")
    .eq("id", alumno_id)
    .single();
  if (!alumno) return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });

  // Actualizar estatus del alumno al tipo de actividad
  await admin
    .from("alumnos")
    .update({ estatus: tipo })
    .eq("id", alumno_id);

  const { data: nueva, error: insertError } = await admin
    .from("alumno_actividad_especial")
    .insert({
      alumno_id,
      tipo,
      empresa:          empresa || null,
      responsable:      responsable || null,
      fecha_inicio,
      fecha_fin:        fecha_fin || null,
      horas_requeridas,
      semestre_id:      semestre_id ?? alumno.semestre_actual,
      ciclo_id:         ciclo_id && isUUID(ciclo_id) ? ciclo_id : null,
      observaciones:    observaciones || null,
      documento_url:    documento_url || null,
      registrado_por:   adminUser.db_id,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: "Error al registrar actividad" }, { status: 500 });
  }

  await auditLog(adminUser.db_id, "alumno_actividad_especial", "INSERT", nueva.id, { alumno_id, tipo });
  return NextResponse.json({ ok: true, id: nueva.id }, { status: 201 });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const id            = sanitize(body.id as string, 36);
  const estatus       = sanitize(body.estatus as string ?? "", 20);
  const horas_cumplidas = typeof body.horas_cumplidas === "number" ? body.horas_cumplidas : undefined;
  const fecha_fin     = sanitize(body.fecha_fin as string ?? "", 10);
  const observaciones = sanitize(body.observaciones as string ?? "", 1000);
  const documento_url = sanitize(body.documento_url as string ?? "", 500);

  if (!isUUID(id)) return NextResponse.json({ error: "id inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  // Obtener actividad actual para auditoría y validaciones
  const { data: actual } = await admin
    .from("alumno_actividad_especial")
    .select("id, alumno_id, estatus, horas_requeridas")
    .eq("id", id)
    .single();
  if (!actual) return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });

  if (estatus && !ESTATUSES_VALIDOS.includes(estatus as typeof ESTATUSES_VALIDOS[number])) {
    return NextResponse.json({ error: `estatus debe ser: ${ESTATUSES_VALIDOS.join(" | ")}` }, { status: 400 });
  }
  if (horas_cumplidas !== undefined && horas_cumplidas > actual.horas_requeridas) {
    return NextResponse.json({ error: "horas_cumplidas no puede superar horas_requeridas" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (estatus)              updates.estatus         = estatus;
  if (horas_cumplidas !== undefined) updates.horas_cumplidas = horas_cumplidas;
  if (fecha_fin)            updates.fecha_fin        = fecha_fin;
  if (observaciones)        updates.observaciones    = observaciones;
  if (documento_url)        updates.documento_url    = documento_url;

  const { error: updateError } = await admin
    .from("alumno_actividad_especial")
    .update(updates)
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: "Error al actualizar actividad" }, { status: 500 });

  // Si se completa/cancela → restaurar estatus del alumno a 'regular'
  if (estatus === "completado" || estatus === "cancelado") {
    await admin
      .from("alumnos")
      .update({ estatus: "regular" })
      .eq("id", actual.alumno_id);
  }

  await auditLog(adminUser.db_id, "alumno_actividad_especial", "UPDATE", id, updates);
  return NextResponse.json({ ok: true });
}
