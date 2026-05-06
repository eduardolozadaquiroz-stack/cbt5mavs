/**
 * GET  /api/reinscripcion/mi-solicitud  — Obtener mi solicitud del ciclo actual
 * POST /api/reinscripcion/mi-solicitud  — Crear solicitud (si no existe)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // Obtener el ciclo activo desde site_config
  const { data: cfg } = await admin
    .from("site_config")
    .select("config")
    .eq("id", 1)
    .single();
  const cicloEscolar: string = (cfg?.config as Record<string, unknown>)?.reinscripcion
    ? ((cfg!.config as Record<string, unknown>).reinscripcion as Record<string, unknown>).cicloEscolar as string
    : "";

  const { data, error } = await admin
    .from("reinscripcion_solicitudes")
    .select(`
      id, estado, notas_admin, ciclo_escolar, created_at, updated_at,
      reinscripcion_documentos ( id, nombre, url, estado, notas, created_at )
    `)
    .eq("alumno_id", user.db_id)
    .eq("ciclo_escolar", cicloEscolar)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Error al obtener solicitud" }, { status: 500 });

  return NextResponse.json({ solicitud: data ?? null, cicloEscolar });
}

export async function POST(_request: NextRequest) {
  const [user, err] = await requireRole("alumno");
  if (err) return err;

  const admin = createSupabaseAdminClient();

  // Obtener ciclo activo
  const { data: cfg } = await admin.from("site_config").select("config").eq("id", 1).single();
  const reinConfig = (cfg?.config as Record<string, unknown>)?.reinscripcion as Record<string, unknown> | undefined;
  const cicloEscolar = (reinConfig?.cicloEscolar as string | undefined) ?? "";
  const habilitada   = (reinConfig?.habilitada as boolean | undefined) ?? false;

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
    return NextResponse.json({ error: "Error al crear solicitud" }, { status: 500 });
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
