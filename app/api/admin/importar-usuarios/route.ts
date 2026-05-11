/**
 * POST /api/admin/importar-usuarios
 * Importa usuarios en masa desde datos CSV parseados en el cliente.
 * Solo accesible por administradores.
 *
 * Body: { usuarios: UsuarioCSV[] }
 * Cada fila: { nombre, apellido_paterno, apellido_materno?, email, rol, matricula?, curp?, fecha_nacimiento?, carrera?, semestre? }
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createLogger } from "@/lib/logger";
import { generatePasswordRecoveryLink, sendAuthEmail } from "@/lib/email";

export const runtime = 'edge';

const log = createLogger("api/admin/importar-usuarios");

interface UsuarioCSV {
  nombre:            string;
  apellido_paterno:  string;
  apellido_materno?: string;
  email:             string;
  rol:               string;
  matricula?:        string;
  curp?:             string;
  fecha_nacimiento?: string;
  carrera?:          string;
  semestre?:         string;
}

const VALID_ROLES = ["alumno", "maestro", "admin", "padres"];
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function generateTempPassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const specials = "!@#$%&*";
  let pwd = "";
  for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  // Garantizar al menos un especial y un número
  pwd += specials[Math.floor(Math.random() * specials.length)];
  pwd += "123456789"[Math.floor(Math.random() * 9)];
  // Mezclar
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  // Verificar sesión y rol admin
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: adminUser } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("auth_id", user.id)
    .single();

  if (adminUser?.rol !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  // Parsear body
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { usuarios } = body as { usuarios?: UsuarioCSV[] };
  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    return NextResponse.json({ error: "No se enviaron usuarios" }, { status: 400 });
  }
  if (usuarios.length > 500) {
    return NextResponse.json({ error: "Máximo 500 usuarios por importación" }, { status: 400 });
  }

  // Procesar cada fila
  const resultados: { email: string; ok: boolean; error?: string; contrasena_temp?: string }[] = [];

  for (const row of usuarios) {
    const email  = (row.email ?? "").trim().toLowerCase();
    const nombre = (row.nombre ?? "").trim();
    const ap     = (row.apellido_paterno ?? "").trim();
    const rol    = (row.rol ?? "").trim().toLowerCase();

    // Validaciones básicas
    if (!EMAIL_RE.test(email)) {
      resultados.push({ email: email || "(vacío)", ok: false, error: "Email inválido" });
      continue;
    }
    if (!nombre || !ap) {
      resultados.push({ email, ok: false, error: "Nombre o apellido vacío" });
      continue;
    }
    if (!VALID_ROLES.includes(rol)) {
      resultados.push({ email, ok: false, error: `Rol inválido: ${rol}` });
      continue;
    }

    const contrasena_temp = generateTempPassword();

    try {
      // 1. Crear en Supabase Auth (service role para bypasear confirmación de email)
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: contrasena_temp,
        email_confirm: true, // marcar email como confirmado automáticamente
      });

      if (authError || !authUser.user) {
        resultados.push({ email, ok: false, error: authError?.message ?? "Error auth" });
        continue;
      }

      // 2. Insertar en tabla usuarios
      const { error: dbError } = await supabase.from("usuarios").insert({
        auth_id:          authUser.user.id,
        email,
        rol,
        nombre,
        apellido_paterno: ap,
        apellido_materno: (row.apellido_materno ?? "").trim() || null,
        activo:           true,
        primer_acceso:    true,
      });

      if (dbError) {
        // Revertir auth user si falla la DB
        await supabase.auth.admin.deleteUser(authUser.user.id);
        resultados.push({ email, ok: false, error: `DB: ${dbError.message}` });
        continue;
      }

      // 3. Si es alumno y hay matrícula, insertar en tabla alumnos
      if (rol === "alumno" && row.matricula) {
        const { data: usuarioRow } = await supabase
          .from("usuarios")
          .select("id")
          .eq("auth_id", authUser.user.id)
          .single();

        if (usuarioRow?.id) {
          await supabase.from("alumnos").insert({
            usuario_id:       usuarioRow.id,
            matricula:        row.matricula.trim(),
            curp:             row.curp?.trim() || null,
            fecha_nacimiento: row.fecha_nacimiento?.trim() || null,
          });
        }
      }

      resultados.push({ email, ok: true, contrasena_temp });
      log.info("Usuario importado", { email, rol });

      // Generar el enlace con Supabase Auth, pero enviar el correo desde el proyecto.
      try {
        const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? request.nextUrl.origin;
        const redirectTo = `${origin.replace(/\/$/, "")}/auth/reset-password`;
        const actionUrl = await generatePasswordRecoveryLink(supabase, email, redirectTo);

        await sendAuthEmail({
          to: email,
          actionUrl,
          kind: "welcome",
          name: nombre,
        });
      } catch {
        // No fallar la importación si el correo no se pudo enviar
        log.info("Correo de bienvenida no enviado (email provider no configurado?)", { email });
      }

    } catch (err) {
      resultados.push({ email, ok: false, error: String(err) });
    }
  }

  const exitosos = resultados.filter(r => r.ok).length;
  const fallidos = resultados.filter(r => !r.ok).length;

  log.info("Importación completada", { exitosos, fallidos });

  return NextResponse.json({ ok: true, exitosos, fallidos, resultados });
}
