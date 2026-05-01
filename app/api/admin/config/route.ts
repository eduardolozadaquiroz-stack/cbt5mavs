/**
 * GET  /api/admin/config  — público: lee la config del portal
 * POST /api/admin/config  — protegido: solo rol "admin" puede guardar
 *
 * Seguridad:
 * - El middleware ya bloquea POST sin JWT (401 antes de llegar aquí)
 * - requireRole("admin") verifica el rol en DB para prevenir privilege escalation
 */
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireRole } from "@/lib/auth";

const TABLE = "site_config";
const CONFIG_ID = 1;

// GET — público, cualquiera puede leer la config publicada del portal
export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db
    .from(TABLE)
    .select("config")
    .eq("id", CONFIG_ID)
    .single();

  if (error || !data) {
    return NextResponse.json({ config: null });
  }

  return NextResponse.json({ config: data.config });
}

// POST — solo administradores autenticados
export async function POST(req: NextRequest) {
  // Doble verificación: middleware + validación de rol en DB
  const [, authErr] = await requireRole("admin");
  if (authErr) return authErr;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
  }

  const { config } = (body ?? {}) as { config: unknown };

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return NextResponse.json({ error: "Config inválida" }, { status: 400 });
  }

  const db = createServiceClient();

  const { error } = await db.from(TABLE).upsert(
    { id: CONFIG_ID, config, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );

  if (error) {
    console.error("[site_config] Error al guardar:", error.message);
    return NextResponse.json({ error: "Error interno al guardar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
