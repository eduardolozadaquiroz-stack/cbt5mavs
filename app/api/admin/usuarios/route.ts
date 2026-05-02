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
    .select("id, nombre, correo:email, rol, telefono, activo, created_at", { count: "exact" })
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

  const nombre   = sanitize(body.nombre, 120);
  const correo   = sanitize(body.correo, 254);
  const rol      = sanitize(body.rol, 20);
  const telefono = sanitize(body.telefono ?? "", 20);
  const password = typeof body.password === "string" ? body.password : "";

  if (!nombre || !isEmail(correo) || !ROLES_VALIDOS.includes(rol) || password.length < 8) {
    return NextResponse.json(
      { error: "nombre, correo válido, rol válido y password ≥8 chars son requeridos" },
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
    const matricula  = sanitize(body.matricula ?? "", 20);
    const carrera_id = typeof body.carrera_id === "string" ? body.carrera_id.trim() : null;
    // Solo insertar si se proporciona matrícula; curp y fecha_nacimiento son requeridos
    // por el schema pero se omiten en creación rápida — se completan en edición posterior
    if (matricula) {
      const { error: alumnoError } = await admin.from("alumnos").insert({
        id: dbUser.id,
        matricula,
        carrera_id,
        semestre_actual: 1,
        curp: `CBT-${dbUser.id.slice(0, 8).toUpperCase()}`,
        fecha_nacimiento: "2000-01-01",
      });
      if (alumnoError) {
        console.error("[usuarios POST] alumnos insert warning:", alumnoError.code, alumnoError.message);
      }
    }
  }

  // Si es maestro, crear registro en tabla maestros
  if (rol === "maestro") {
    const especialidad = sanitize(body.especialidad ?? "", 100);
    const { error: maestroError } = await admin.from("maestros").insert({
      id: dbUser.id,
      especialidad: especialidad || null,
    });
    if (maestroError) {
      console.error("[usuarios POST] maestros insert warning:", maestroError.code, maestroError.message);
    }
  }

  // A09 – Audit log: creación de cuentas es evento crítico
  await auditLog(adminUser.db_id, "usuarios", "INSERT", dbUser.id, { rol, correo });

  return NextResponse.json({ ok: true, id: dbUser.id }, { status: 201 });
}
