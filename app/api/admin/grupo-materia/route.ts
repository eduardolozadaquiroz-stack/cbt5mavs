/**
 * GET    /api/admin/grupo-materia?grupo_id=X  — Lista asignaciones materia+maestro de un grupo
 * POST   /api/admin/grupo-materia             — Crear asignación (materia + maestro → grupo)
 * DELETE /api/admin/grupo-materia?id=X        — Eliminar asignación
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";


function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const grupo_id = request.nextUrl.searchParams.get("grupo_id") ?? "";
  if (!isUUID(grupo_id)) {
    return NextResponse.json({ error: "grupo_id requerido (UUID)" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("grupo_materia")
    .select(`
      id, ciclo_id,
      materia:materias(id, nombre, clave, semestre),
      maestro:maestros(
        id,
        usuarios(id, nombre, apellido_paterno, apellido_materno)
      ),
      ciclo:ciclos_escolares(id, nombre)
    `)
    .eq("grupo_id", grupo_id)
    .order("materia(nombre)");

  if (error) {
    console.error("[GET /api/admin/grupo-materia]", error.message);
    return NextResponse.json({ error: "Error al obtener asignaciones" }, { status: 500 });
  }

  return NextResponse.json({ asignaciones: data ?? [] });
}

export async function POST(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const grupo_id   = typeof body.grupo_id   === "string" ? body.grupo_id.trim()   : "";
  const materia_id = typeof body.materia_id === "string" ? body.materia_id.trim() : "";
  const maestro_id = typeof body.maestro_id === "string" ? body.maestro_id.trim() : "";
  const ciclo_id   = typeof body.ciclo_id   === "string" ? body.ciclo_id.trim()   : "";

  if (!isUUID(grupo_id) || !isUUID(materia_id) || !isUUID(maestro_id) || !isUUID(ciclo_id)) {
    return NextResponse.json(
      { error: "grupo_id, materia_id, maestro_id y ciclo_id son requeridos (UUID)" },
      { status: 400 }
    );
  }

  const admin = createSupabaseAdminClient();

  // Verificar que el maestro existe
  const { data: maestroCheck } = await admin
    .from("maestros")
    .select("id")
    .eq("id", maestro_id)
    .maybeSingle();
  if (!maestroCheck) {
    return NextResponse.json({ error: "Maestro no encontrado" }, { status: 404 });
  }

  const { data, error } = await admin
    .from("grupo_materia")
    .insert({ grupo_id, materia_id, maestro_id, ciclo_id })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Esta materia ya está asignada a este grupo en este ciclo" }, { status: 409 });
    }
    console.error("[POST /api/admin/grupo-materia]", error.message);
    return NextResponse.json({ error: "Error al crear asignación" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!isUUID(id)) {
    return NextResponse.json({ error: "id requerido (UUID)" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("grupo_materia").delete().eq("id", id);

  if (error) {
    console.error("[DELETE /api/admin/grupo-materia]", error.message);
    return NextResponse.json({ error: "Error al eliminar asignación" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
