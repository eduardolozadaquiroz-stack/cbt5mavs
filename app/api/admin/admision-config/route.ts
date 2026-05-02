/**
 * GET  /api/admin/admision-config  — público: lee secciones habilitadas (navbar)
 * POST /api/admin/admision-config  — protegido: solo rol "admin"
 *
 * Estado persiste en DB (site_config) en lugar de variable en memoria.
 * La variable en memoria se pierde con cada restart — esto lo corrige.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireRole } from "@/lib/auth";

export type SectionKey =
  | "inicio"
  | "carreras"
  | "admision"
  | "avisos"
  | "contacto"
  | "nosotros";

const VALID_SECTIONS: SectionKey[] = [
  "inicio",
  "carreras",
  "admision",
  "avisos",
  "contacto",
  "nosotros",
];

const DEFAULT_SECTIONS: Record<SectionKey, { enabled: boolean }> = {
  inicio:    { enabled: true },
  carreras:  { enabled: true },
  admision:  { enabled: true },
  avisos:    { enabled: true },
  contacto:  { enabled: true },
  nosotros:  { enabled: true },
};

// GET — público (navbar lo usa sin auth)
export async function GET() {
  try {
    const db = createServiceClient();
    const { data } = await db
      .from("site_config")
      .select("config")
      .eq("id", 1)
      .single();

    const config = data?.config as Record<string, unknown> | undefined;
    const secciones = (config?.secciones ?? {}) as Record<string, { enabled: boolean }>;

    // Si la sección admision no tiene estado explícito en secciones,
    // usar config.admision.habilitada como fuente de verdad
    const admisionEnabled =
      secciones?.admision?.enabled !== undefined
        ? secciones.admision.enabled
        : ((config?.admision as Record<string, unknown>)?.habilitada as boolean ?? true);

    const sections = {
      ...DEFAULT_SECTIONS,
      ...secciones,
      admision: { enabled: admisionEnabled },
    };

    return NextResponse.json(sections);
  } catch {
    return NextResponse.json(DEFAULT_SECTIONS);
  }
}

// POST — solo administradores autenticados
export async function POST(request: NextRequest) {
  const [, authErr] = await requireRole("admin");
  if (authErr) return authErr;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
  }

  const { section, enabled } = (body ?? {}) as {
    section: unknown;
    enabled: unknown;
  };

  if (
    typeof section !== "string" ||
    !VALID_SECTIONS.includes(section as SectionKey) ||
    typeof enabled !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Parámetros inválidos" },
      { status: 400 }
    );
  }

  const db = createServiceClient();

  // Leer config actual
  const { data: current } = await db
    .from("site_config")
    .select("config")
    .eq("id", 1)
    .single();

  const config = (current?.config as Record<string, unknown>) ?? {};
  const secciones = (config.secciones as Record<string, unknown>) ?? {};

  secciones[section] = {
    enabled,
    lastUpdated: new Date().toISOString(),
  };

  const { error } = await db.from("site_config").upsert(
    {
      id: 1,
      config: { ...config, secciones },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  return NextResponse.json({ success: true, section, enabled });
}
