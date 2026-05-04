/**
 * POST /api/admin/reinscripcion
 *   Avanza el semestre de uno o varios alumnos al nuevo ciclo escolar.
 *
 * Body:
 *   { ciclo_origen_id, ciclo_destino_id, alumno_ids?: string[] }
 *   - Si alumno_ids se omite → reinscripción masiva de todos los alumnos activos del ciclo origen.
 *   - Si alumno_ids se provee → solo esos alumnos.
 *
 * GET /api/admin/reinscripcion?alumno_id=<uuid>
 *   Historial de reinscripciones de un alumno.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, auditLog } from "@/lib/auth";
import { sanitize } from "@/lib/validate";

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

// ── GET: historial de un alumno ───────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const alumno_id = sanitize(request.nextUrl.searchParams.get("alumno_id") ?? "", 36);
  if (!alumno_id || !isUUID(alumno_id)) {
    return NextResponse.json({ error: "alumno_id requerido y debe ser UUID válido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("reinscripcion_log")
    .select(`
      id, semestre_origen, semestre_destino, observaciones, created_at,
      ciclo_origen:ciclos_escolares!ciclo_origen_id(nombre, periodo),
      ciclo_destino:ciclos_escolares!ciclo_destino_id(nombre, periodo),
      grupo_destino:grupos(nombre),
      realizado_por:usuarios(nombre, apellido_paterno)
    `)
    .eq("alumno_id", alumno_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  return NextResponse.json({ historial: data ?? [] });
}

// ── POST: procesar reinscripción ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const ciclo_origen_id  = sanitize(body.ciclo_origen_id as string, 36);
  const ciclo_destino_id = sanitize(body.ciclo_destino_id as string, 36);
  const grupo_destino_id = sanitize((body.grupo_destino_id as string) ?? "", 36);
  const alumno_ids_raw   = Array.isArray(body.alumno_ids) ? (body.alumno_ids as unknown[]) : null;

  if (!isUUID(ciclo_origen_id) || !isUUID(ciclo_destino_id)) {
    return NextResponse.json({ error: "ciclo_origen_id y ciclo_destino_id son requeridos (UUIDs)" }, { status: 400 });
  }
  if (ciclo_origen_id === ciclo_destino_id) {
    return NextResponse.json({ error: "Los ciclos origen y destino deben ser diferentes" }, { status: 400 });
  }

  const alumno_ids = alumno_ids_raw
    ? alumno_ids_raw.filter((id): id is string => typeof id === "string" && isUUID(id))
    : null;

  const admin = createSupabaseAdminClient();

  // Verificar que ambos ciclos existen
  const { data: ciclos } = await admin
    .from("ciclos_escolares")
    .select("id, nombre")
    .in("id", [ciclo_origen_id, ciclo_destino_id]);

  if (!ciclos || ciclos.length < 2) {
    return NextResponse.json({ error: "Uno o ambos ciclos no existen" }, { status: 400 });
  }

  // Obtener alumnos a reinscribir
  let alumnosQuery = admin
    .from("alumnos")
    .select("id, semestre_actual, estatus")
    .in("estatus", ["regular", "en_riesgo", "critico"]);

  if (alumno_ids && alumno_ids.length > 0) {
    alumnosQuery = alumnosQuery.in("id", alumno_ids);
  } else {
    // Solo los que están en el ciclo origen
    const { data: agData } = await admin
      .from("alumno_grupo")
      .select("alumno_id")
      .eq("ciclo_id", ciclo_origen_id)
      .eq("activo", true);
    const ids = (agData ?? []).map((r: { alumno_id: string }) => r.alumno_id);
    if (ids.length === 0) return NextResponse.json({ procesados: 0, resultados: [] });
    alumnosQuery = alumnosQuery.in("id", ids);
  }

  const { data: alumnos, error: alumnosError } = await alumnosQuery;
  if (alumnosError) return NextResponse.json({ error: "Error al obtener alumnos" }, { status: 500 });

  const resultados: Array<{ alumno_id: string; resultado: string }> = [];

  for (const alumno of alumnos ?? []) {
    const nuevo_semestre = alumno.semestre_actual + 1;
    const egresado       = nuevo_semestre > 6;

    // Actualizar semestre / estatus
    await admin
      .from("alumnos")
      .update({
        semestre_actual: egresado ? 6 : nuevo_semestre,
        estatus:         egresado ? "egresado" : alumno.estatus,
      })
      .eq("id", alumno.id);

    // Desactivar grupo del ciclo anterior
    await admin
      .from("alumno_grupo")
      .update({ activo: false })
      .eq("alumno_id", alumno.id)
      .eq("ciclo_id", ciclo_origen_id);

    // Si se especifica grupo destino → inscribir al nuevo grupo
    if (grupo_destino_id && isUUID(grupo_destino_id) && !egresado) {
      await admin
        .from("alumno_grupo")
        .upsert({
          alumno_id: alumno.id,
          grupo_id:  grupo_destino_id,
          ciclo_id:  ciclo_destino_id,
          activo:    true,
          fecha_inscripcion: new Date().toISOString().slice(0, 10),
        }, { onConflict: "alumno_id,grupo_id,ciclo_id" });
    }

    // Log de reinscripción
    await admin
      .from("reinscripcion_log")
      .insert({
        alumno_id:        alumno.id,
        ciclo_origen_id,
        ciclo_destino_id,
        semestre_origen:  alumno.semestre_actual,
        semestre_destino: egresado ? 6 : nuevo_semestre,
        grupo_destino_id: grupo_destino_id && isUUID(grupo_destino_id) ? grupo_destino_id : null,
        realizado_por:    adminUser.db_id,
        observaciones:    egresado ? "Egresado al completar 6° semestre" : null,
      });

    resultados.push({
      alumno_id: alumno.id,
      resultado: egresado ? "egresado" : `reinscrito_sem${nuevo_semestre}`,
    });
  }

  await auditLog(adminUser.db_id, "reinscripcion_log", "INSERT", ciclo_destino_id, {
    ciclo_origen_id,
    ciclo_destino_id,
    total: resultados.length,
  });

  return NextResponse.json({
    ok:          true,
    procesados:  resultados.length,
    resultados,
  });
}
