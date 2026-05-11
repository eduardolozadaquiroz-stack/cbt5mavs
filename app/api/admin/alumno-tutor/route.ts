/**
 * GET  /api/admin/alumno-tutor?tutor_id=<uuid>   — Lista alumnos vinculados a un tutor
 * POST /api/admin/alumno-tutor                    — Vincular alumno a tutor (admin)
 * DELETE /api/admin/alumno-tutor                  — Desvincular alumno de tutor (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, auditLog } from "@/lib/auth";

export const runtime = 'edge';

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

// GET — listar alumnos vinculados a un tutor
export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const tutor_id = searchParams.get("tutor_id") ?? "";

  if (!tutor_id || !isUUID(tutor_id)) {
    return NextResponse.json({ error: "tutor_id requerido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("alumno_tutor")
    .select(`
      id,
      alumno_id,
      alumnos (
        matricula,
        semestre_actual,
        usuarios ( nombre, apellido_paterno, apellido_materno )
      )
    `)
    .eq("tutor_id", tutor_id);

  if (error) {
    return NextResponse.json({ error: "Error al obtener vínculos" }, { status: 500 });
  }

  const alumnos = (data ?? []).map((row: Record<string, unknown>) => {
    const alumno = row.alumnos as Record<string, unknown> | null;
    const usr    = alumno?.usuarios as Record<string, unknown> | null;
    return {
      vínculo_id: row.id as string,
      alumno_id:  row.alumno_id as string,
      matricula:  alumno?.matricula as string,
      semestre:   alumno?.semestre_actual as number,
      nombre: usr
        ? [usr.apellido_paterno, usr.apellido_materno, usr.nombre].filter(Boolean).join(" ")
        : "—",
    };
  });

  return NextResponse.json({ alumnos });
}

// POST — crear vínculo alumno-tutor
export async function POST(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const alumno_id = typeof body.alumno_id === "string" ? body.alumno_id.trim() : "";
  const tutor_id  = typeof body.tutor_id  === "string" ? body.tutor_id.trim()  : "";

  if (!isUUID(alumno_id) || !isUUID(tutor_id)) {
    return NextResponse.json({ error: "alumno_id y tutor_id deben ser UUIDs válidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Verificar que el alumno existe en la tabla alumnos
  const { data: alumno } = await admin.from("alumnos").select("id").eq("id", alumno_id).maybeSingle();
  if (!alumno) return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });

  // Verificar que el tutor existe en padres_tutores
  const { data: tutor } = await admin.from("padres_tutores").select("id").eq("id", tutor_id).maybeSingle();
  if (!tutor) return NextResponse.json({ error: "Tutor no encontrado en padres_tutores" }, { status: 404 });

  // Insertar vínculo (idempotente por UNIQUE constraint)
  const { data: vínculo, error: insertError } = await admin
    .from("alumno_tutor")
    .insert({ alumno_id, tutor_id })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ ok: true, message: "El vínculo ya existía" });
    }
    return NextResponse.json({ error: "Error al crear vínculo" }, { status: 500 });
  }

  await auditLog(adminUser.db_id, "alumno_tutor", "INSERT", vínculo.id, { alumno_id, tutor_id });

  return NextResponse.json({ ok: true, id: vínculo.id }, { status: 201 });
}

// DELETE — eliminar vínculo
export async function DELETE(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const alumno_id = typeof body.alumno_id === "string" ? body.alumno_id.trim() : "";
  const tutor_id  = typeof body.tutor_id  === "string" ? body.tutor_id.trim()  : "";

  if (!isUUID(alumno_id) || !isUUID(tutor_id)) {
    return NextResponse.json({ error: "alumno_id y tutor_id requeridos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("alumno_tutor")
    .delete()
    .eq("alumno_id", alumno_id)
    .eq("tutor_id", tutor_id);

  if (error) return NextResponse.json({ error: "Error al eliminar vínculo" }, { status: 500 });

  await auditLog(adminUser.db_id, "alumno_tutor", "DELETE", null, { alumno_id, tutor_id });

  return NextResponse.json({ ok: true });
}
