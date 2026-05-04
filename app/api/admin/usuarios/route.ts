/**
 * GET  /api/admin/usuarios         — Lista usuarios (admin)
 * POST /api/admin/usuarios         — Crear usuario + cuenta auth (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, auditLog } from "@/lib/auth";
import { sanitize, isEmail } from "@/lib/validate";

const ROLES_VALIDOS = ["alumno", "maestro", "admin", "padres"];

export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
  const rol    = sanitize(searchParams.get("rol") ?? "", 20);
  const search = sanitize(searchParams.get("search") ?? "", 100);
  const from   = (page - 1) * limit;
  const to     = from + limit - 1;

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("usuarios")
    .select("id, nombre, apellido_paterno, apellido_materno, correo:email, rol, telefono, activo, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (rol && ROLES_VALIDOS.includes(rol)) query = query.eq("rol", rol);
  if (search) query = query.ilike("nombre", `%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });

  return NextResponse.json({ usuarios: data ?? [], total: count ?? 0, page, limit });
}

export async function POST(request: NextRequest) {
  const [adminUser, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const nombre            = sanitize(body.nombre, 120);
  const apellido_paterno  = sanitize(body.apellido_paterno, 80);
  const apellido_materno  = sanitize(body.apellido_materno ?? "", 80);
  const correo            = sanitize(body.correo, 254);
  const rol               = sanitize(body.rol, 20);
  const telefono          = sanitize(body.telefono ?? "", 20);
  const password          = typeof body.password === "string" ? body.password : "";

  if (!nombre || !apellido_paterno || !isEmail(correo) || !ROLES_VALIDOS.includes(rol) || password.length < 8) {
    return NextResponse.json(
      { error: "nombre, apellido paterno, correo válido, rol válido y password ≥8 chars son requeridos" },
      { status: 400 }
    );
  }

  const admin = createSupabaseAdminClient();

  // Crear cuenta en Supabase Auth
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: correo,
    password,
    email_confirm: true, // Admin-created users don't need to verify email
  });

  if (authError || !authData.user) {
    const msg = authError?.message?.includes("already registered")
      ? "El correo ya está registrado"
      : "Error al crear cuenta";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Crear registro en tabla usuarios
  const { data: dbUser, error: dbError } = await admin
    .from("usuarios")
    .insert({
      auth_id: authData.user.id,
      nombre,
      apellido_paterno,
      apellido_materno: apellido_materno || null,
      email: correo,
      rol,
      telefono: telefono || null,
      activo: true,
    })
    .select("id")
    .single();

  if (dbError) {
    // Rollback: eliminar la cuenta auth creada
    await admin.auth.admin.deleteUser(authData.user.id);
    // Determinar causa probable
    let msg = "Error al crear usuario en la base de datos";
    if (dbError.code === "23505") {
      // Unique violation
      if (dbError.message?.includes("correo")) msg = "El correo ya existe en el sistema";
      else if (dbError.message?.includes("auth_id")) msg = "Ya existe un usuario con esa cuenta de autenticación";
      else msg = "Ya existe un registro duplicado";
    } else if (dbError.code === "23503") {
      msg = "Error de referencia: verifique que los datos relacionados existan";
    }
    console.error("[usuarios POST] DB error:", dbError.code, dbError.message);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // Si es alumno, crear registro en tabla alumnos
  if (rol === "alumno") {
    const matricula       = sanitize(body.matricula ?? "", 20);
    const curp            = sanitize(body.curp ?? "", 18);
    const fecha_nacimiento = sanitize(body.fecha_nacimiento ?? "", 10);
    const carrera_id      = typeof body.carrera_id === "string" && body.carrera_id ? body.carrera_id.trim() : null;
    const semestre_actual = typeof body.semestre_actual === "number" ? body.semestre_actual : 1;
    const sexo            = sanitize(body.sexo ?? "", 2);

    if (!matricula || !curp || !fecha_nacimiento) {
      // Rollback
      await admin.auth.admin.deleteUser(authData.user.id);
      await admin.from("usuarios").delete().eq("id", dbUser.id);
      return NextResponse.json(
        { error: "matrícula, CURP y fecha de nacimiento son requeridos para alumnos" },
        { status: 400 }
      );
    }

    const { error: alumnoError } = await admin.from("alumnos").insert({
      id: dbUser.id,
      matricula,
      curp,
      fecha_nacimiento,
      carrera_id,
      semestre_actual: semestre_actual >= 1 && semestre_actual <= 6 ? semestre_actual : 1,
      sexo: ["M", "F", "NB"].includes(sexo) ? sexo : null,
    });

    if (alumnoError) {
      // Rollback completo
      await admin.auth.admin.deleteUser(authData.user.id);
      await admin.from("usuarios").delete().eq("id", dbUser.id);
      let msg = "Error al crear registro de alumno";
      if (alumnoError.code === "23505") {
        if (alumnoError.message?.includes("matricula")) msg = "Ya existe un alumno con esa matrícula";
        else if (alumnoError.message?.includes("curp")) msg = "Ya existe un alumno con ese CURP";
      }
      console.error("[usuarios POST] alumnos insert error:", alumnoError.code, alumnoError.message);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // Si es maestro, crear registro en tabla maestros
  if (rol === "maestro") {
    const rfc          = sanitize(body.rfc ?? "", 13);
    const especialidad = sanitize(body.especialidad ?? "", 100);
    const tipo_contrato = sanitize(body.tipo_contrato ?? "horas", 20);
    const { error: maestroError } = await admin.from("maestros").insert({
      id: dbUser.id,
      rfc: rfc || null,
      especialidad: especialidad || null,
      tipo_contrato: ["base", "horas", "interino"].includes(tipo_contrato) ? tipo_contrato : "horas",
    });
    if (maestroError) {
      console.error("[usuarios POST] maestros insert warning:", maestroError.code, maestroError.message);
    }
  }

  // Si es padre/tutor, crear registro en tabla padres_tutores
  if (rol === "padres") {
    const curp_tutor  = sanitize(body.curp_tutor ?? "", 18);
    const parentesco  = sanitize(body.parentesco ?? "tutor_legal", 20);
    const { error: padresError } = await admin.from("padres_tutores").insert({
      id: dbUser.id,
      curp: curp_tutor || null,
      parentesco: ["padre", "madre", "tutor_legal", "otro"].includes(parentesco) ? parentesco : "tutor_legal",
    });
    if (padresError) {
      console.error("[usuarios POST] padres_tutores insert warning:", padresError.code, padresError.message);
    }
  }

  // A09 – Audit log: creación de cuentas es evento crítico
  await auditLog(adminUser.db_id, "usuarios", "INSERT", dbUser.id, { rol, correo });

  return NextResponse.json({ ok: true, id: dbUser.id }, { status: 201 });
}
