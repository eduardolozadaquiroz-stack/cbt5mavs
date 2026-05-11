/**
 * GET    /api/admin/usuarios/[id]   — Detalle de un usuario
 * PATCH  /api/admin/usuarios/[id]   — Actualizar usuario
 * DELETE /api/admin/usuarios/[id]   — Desactivar usuario (soft delete)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

function sanitize(v: unknown, maxLen = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, "");
}
function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}
const ROLES_VALIDOS = ["alumno", "maestro", "admin", "padres"];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("usuarios")
    .select("id, nombre, apellido_paterno, apellido_materno, correo:email, rol, telefono, foto_url, activo, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  // Obtener datos extendidos según el rol
  let alumno = null, maestro = null, padre = null;
  if (data.rol === "alumno") {
    const { data: a } = await admin
      .from("alumnos")
      .select("matricula, curp, carrera_id, semestre_actual, sexo, alumno_grupo(grupo_id, activo)")
      .eq("id", id)
      .maybeSingle();
    const grupoActivo = (a?.alumno_grupo as Array<{ grupo_id: string; activo: boolean }> | null)
      ?.find(g => g.activo);
    alumno = a ? { ...a, grupo_id: grupoActivo?.grupo_id ?? null } : null;
  } else if (data.rol === "maestro") {
    const { data: m } = await admin
      .from("maestros")
      .select("rfc, especialidad, tipo_contrato")
      .eq("id", id)
      .maybeSingle();
    maestro = m ?? null;
  } else if (data.rol === "padres") {
    const { data: p } = await admin
      .from("padres_tutores")
      .select("curp, parentesco")
      .eq("id", id)
      .maybeSingle();
    padre = p ?? null;
  }

  return NextResponse.json({ ...data, alumno, maestro, padre });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const updates: Record<string, string | boolean | null> = {};
  if (typeof body.nombre            === "string") updates.nombre           = sanitize(body.nombre, 120);
  if (typeof body.apellido_paterno  === "string") updates.apellido_paterno = sanitize(body.apellido_paterno, 80);
  if (body.apellido_materno !== undefined) updates.apellido_materno = body.apellido_materno === null ? null : sanitize(body.apellido_materno as string, 80) || null;
  if (typeof body.telefono          === "string") updates.telefono         = sanitize(body.telefono, 20);
  if (typeof body.foto_url          === "string") updates.foto_url         = sanitize(body.foto_url, 500);
  if (typeof body.activo            === "boolean") updates.activo          = body.activo;
  if (typeof body.rol === "string" && ROLES_VALIDOS.includes(body.rol)) updates.rol = body.rol;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios válidos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("usuarios").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });

  // Actualizar tabla alumnos si se proporcionaron campos específicos
  const alumnoUpdates: Record<string, unknown> = {};
  if (typeof body.matricula === "string")       alumnoUpdates.matricula       = sanitize(body.matricula, 20);
  if (typeof body.curp === "string")            alumnoUpdates.curp            = sanitize((body.curp as string).toUpperCase(), 18);
  if (typeof body.carrera_id === "string" && isUUID(body.carrera_id as string)) alumnoUpdates.carrera_id = body.carrera_id;
  if (typeof body.semestre_actual === "number") alumnoUpdates.semestre_actual = body.semestre_actual;
  if (typeof body.sexo === "string")            alumnoUpdates.sexo            = ["M", "F", "NB"].includes(body.sexo as string) ? body.sexo : null;
  if (Object.keys(alumnoUpdates).length > 0) {
    await admin.from("alumnos").update(alumnoUpdates).eq("id", id);
  }

  // Actualizar grupo del alumno si se proporcionó grupo_id
  if ("grupo_id" in body) {
    // Desactivar asignaciones previas
    await admin.from("alumno_grupo").update({ activo: false }).eq("alumno_id", id);
    // Asignar nuevo grupo si se proporcionó uno
    const nuevoGrupo = body.grupo_id as string | null;
    if (nuevoGrupo && isUUID(nuevoGrupo)) {
      // alumno_grupo requiere ciclo_id NOT NULL → usar el ciclo activo
      const { data: cicloActivo } = await admin
        .from("ciclos_escolares")
        .select("id")
        .eq("activo", true)
        .maybeSingle();
      if (cicloActivo?.id) {
        await admin.from("alumno_grupo").upsert(
          { alumno_id: id, grupo_id: nuevoGrupo, ciclo_id: cicloActivo.id, activo: true },
          { onConflict: "alumno_id,grupo_id,ciclo_id" }
        );
      }
    }
  }

  // Actualizar tabla maestros si se proporcionaron campos específicos
  const maestroUpdates: Record<string, unknown> = {};
  if (typeof body.rfc === "string")          maestroUpdates.rfc          = sanitize((body.rfc as string).toUpperCase(), 13) || null;
  if (typeof body.especialidad === "string") maestroUpdates.especialidad = sanitize(body.especialidad as string, 100) || null;
  if (typeof body.tipo_contrato === "string" && ["base","horas","interino"].includes(body.tipo_contrato as string))
    maestroUpdates.tipo_contrato = body.tipo_contrato;
  if (Object.keys(maestroUpdates).length > 0) {
    await admin.from("maestros").update(maestroUpdates).eq("id", id);
  }

  // Actualizar tabla padres_tutores si se proporcionaron campos específicos
  const padresUpdates: Record<string, unknown> = {};
  if (typeof body.curp_tutor === "string")  padresUpdates.curp       = sanitize((body.curp_tutor as string).toUpperCase(), 18) || null;
  if (typeof body.parentesco === "string" && ["padre","madre","tutor_legal","otro"].includes(body.parentesco as string))
    padresUpdates.parentesco = body.parentesco;
  if (Object.keys(padresUpdates).length > 0) {
    await admin.from("padres_tutores").update(padresUpdates).eq("id", id);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { id } = await context.params;
  if (!isUUID(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  // Soft delete — no eliminar la cuenta auth ni los registros relacionados
  const { error } = await admin.from("usuarios").update({ activo: false }).eq("id", id);
  if (error) return NextResponse.json({ error: "Error al desactivar usuario" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
