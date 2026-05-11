/**
 * GET    /api/admin/horarios?grupo_id=...                     — Obtener celdas de horario
 * POST   /api/admin/horarios   { grupo_id, dia, periodo, materia, maestro?, salon?, color? }
 * DELETE /api/admin/horarios?grupo_id=...&dia=...&periodo=... — Eliminar una celda
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export const runtime = 'edge';

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const grupo_id = request.nextUrl.searchParams.get("grupo_id") ?? "";
  if (!grupo_id || !isUUID(grupo_id)) {
    return NextResponse.json({ error: "grupo_id inválido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("horario_celdas")
    .select("id, dia, periodo, materia, maestro, salon, color")
    .eq("grupo_id", grupo_id)
    .order("periodo");

  if (error) return NextResponse.json({ error: "Error al obtener horario" }, { status: 500 });
  return NextResponse.json({ celdas: data ?? [] });
}

export async function POST(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const DIAS_VALIDOS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const grupo_id = typeof body.grupo_id === "string" ? body.grupo_id : "";
  const dia      = typeof body.dia      === "string" ? body.dia.trim() : "";
  const periodo  = typeof body.periodo  === "number" ? body.periodo : 0;
  const materia  = typeof body.materia  === "string" ? body.materia.trim().slice(0, 120) : "";
  const maestro  = typeof body.maestro  === "string" && body.maestro.trim() ? body.maestro.trim().slice(0, 120) : null;
  const salon    = typeof body.salon    === "string" && body.salon.trim()   ? body.salon.trim().slice(0, 60)   : null;
  const color    = typeof body.color    === "string" && body.color.trim()   ? body.color.trim().slice(0, 120)  : null;

  if (!grupo_id || !isUUID(grupo_id)) {
    return NextResponse.json({ error: "grupo_id inválido" }, { status: 400 });
  }
  if (!dia || !DIAS_VALIDOS.includes(dia)) {
    return NextResponse.json({ error: "Día inválido" }, { status: 400 });
  }
  if (periodo < 1 || periodo > 7) {
    return NextResponse.json({ error: "Periodo debe estar entre 1 y 7" }, { status: 400 });
  }
  if (!materia) {
    return NextResponse.json({ error: "La materia es requerida" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("horario_celdas")
    .upsert(
      { grupo_id, dia, periodo, materia, maestro, salon, color, updated_at: new Date().toISOString() },
      { onConflict: "grupo_id,dia,periodo" }
    );

  if (error) return NextResponse.json({ error: "Error al guardar celda" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const grupo_id = searchParams.get("grupo_id") ?? "";
  const dia      = searchParams.get("dia") ?? "";
  const periodo  = parseInt(searchParams.get("periodo") ?? "0", 10);

  if (!grupo_id || !isUUID(grupo_id) || !dia || periodo < 1 || periodo > 7) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("horario_celdas")
    .delete()
    .eq("grupo_id", grupo_id)
    .eq("dia", dia)
    .eq("periodo", periodo);

  if (error) return NextResponse.json({ error: "Error al eliminar celda" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
