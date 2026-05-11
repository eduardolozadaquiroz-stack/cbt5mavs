/**
 * GET  /api/reinscripcion/mi-solicitud  — Obtener mi solicitud del ciclo actual
 * POST /api/reinscripcion/mi-solicitud  — Crear solicitud (si no existe)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export const runtime = 'edge';

export async function GET() {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // Fuente primaria: ciclo activo en ciclos_escolares (lo que el admin realmente configura)
  // Fallback: site_config.reinscripcion.cicloEscolar
  // Paso A: leer ciclo activo y config (diagnóstico explícito)
  const { data: cicloActivo, error: cicloError } = await admin
    .from("ciclos_escolares")
    .select("nombre")
    .eq("activo", true)
    .maybeSingle();

  if (cicloError) {
    console.error("[reinscripcion GET] ciclos_escolares error:", cicloError.code, cicloError.message);
    return NextResponse.json({ error: "Error al leer ciclo escolar", detail: cicloError.message, step: "ciclos_escolares" }, { status: 500 });
  }

  const { data: cfg } = await admin.from("site_config").select("config").eq("id", 1).single();

  const reinConfig = (cfg?.config as Record<string, unknown>)?.reinscripcion as Record<string, unknown> | undefined;
  const cicloEscolar: string =
    cicloActivo?.nombre ??
    (typeof reinConfig?.cicloEscolar === "string" ? reinConfig.cicloEscolar : "");

  if (!cicloEscolar) {
    return NextResponse.json({ solicitud: null, cicloEscolar: "", debug: "no hay ciclo activo" });
  }

  try {
    // Paso 1: buscar la solicitud (sin join embebido para evitar problemas de schema cache)
    const { data: sol, error: solError } = await admin
      .from("reinscripcion_solicitudes")
      .select("id, estado, notas_admin, ciclo_escolar, created_at, updated_at")
      .eq("alumno_id", user.db_id)
      .eq("ciclo_escolar", cicloEscolar)
      .maybeSingle();

    if (solError) {
      console.error("[reinscripcion GET] solicitudes error:", solError.code, solError.message);
      return NextResponse.json({ error: "Error al obtener solicitud", detail: solError.message, step: "reinscripcion_solicitudes", alumno_id: user.db_id, ciclo: cicloEscolar }, { status: 500 });
    }

    // Paso 2: si hay solicitud, buscar sus documentos
    let documentos: unknown[] = [];
    if (sol) {
      const { data: docs, error: docsError } = await admin
        .from("reinscripcion_documentos")
        .select("id, nombre, url, estado, notas, created_at")
        .eq("solicitud_id", sol.id)
        .order("created_at", { ascending: true });

      if (!docsError) documentos = docs ?? [];
    }

    const solicitud = sol ? { ...sol, reinscripcion_documentos: documentos } : null;
    return NextResponse.json({ solicitud, cicloEscolar });
  } catch (e) {
    console.error("[reinscripcion GET] unhandled:", e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(_request: NextRequest) {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // Fuente primaria: ciclo activo en ciclos_escolares
  const [{ data: cicloActivo }, { data: cfg }] = await Promise.all([
    admin.from("ciclos_escolares").select("nombre").eq("activo", true).maybeSingle(),
    admin.from("site_config").select("config").eq("id", 1).single(),
  ]);

  const reinConfig = (cfg?.config as Record<string, unknown>)?.reinscripcion as Record<string, unknown> | undefined;
  const cicloEscolar: string =
    cicloActivo?.nombre ??
    (typeof reinConfig?.cicloEscolar === "string" ? reinConfig.cicloEscolar : "");
  const habilitada = (reinConfig?.habilitada as boolean | undefined) ?? false;

  if (!habilitada) {
    return NextResponse.json({ error: "El proceso de reinscripción no está habilitado" }, { status: 403 });
  }

  if (!cicloEscolar) {
    return NextResponse.json(
      { error: "El ciclo escolar aún no está configurado. Contacta al administrador." },
      { status: 400 }
    );
  }

  // Upsert sin .single() — con ignoreDuplicates:true no se devuelve fila cuando ya existe
  const { error: upsertError } = await admin
    .from("reinscripcion_solicitudes")
    .upsert(
      { alumno_id: user.db_id, ciclo_escolar: cicloEscolar, estado: "borrador" },
      { onConflict: "alumno_id,ciclo_escolar", ignoreDuplicates: true }
    );

  if (upsertError && upsertError.code !== "23505") {
    console.error("[reinscripcion POST] upsert error:", upsertError.code, upsertError.message);
    return NextResponse.json({ error: "Error al crear solicitud", detail: upsertError.message }, { status: 500 });
  }

  // Buscar la solicitud existente o recién creada
  const { data: existing } = await admin
    .from("reinscripcion_solicitudes")
    .select("id, estado, ciclo_escolar")
    .eq("alumno_id", user.db_id)
    .eq("ciclo_escolar", cicloEscolar)
    .single();

  return NextResponse.json({ solicitud: existing }, { status: 201 });
}
