/**
 * POST /api/auth/login
 *
 * Seguridad implementada:
 * - A07 (Auth Failures): rate limiting por IP, bloqueo tras 5 intentos
 * - A03 (Injection): validación y sanitización de inputs
 * - A02 (Cryptographic): sesión via cookie HttpOnly+Secure gestionada por Supabase SSR
 * - A01 (Access Control): verifica rol del usuario contra la tabla usuarios
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase-server";
import { loginLimiter } from "@/lib/rate-limit";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/auth/login");

// ── Helper: obtener IP real del CDN de confianza ─────────────────────────────
// Orden de prioridad: Cloudflare → Vercel → x-forwarded-for → x-real-ip
// Estos headers son sobrescritos por el CDN y no pueden ser falsificados
// por el cliente si el tráfico siempre pasa por el CDN.
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ??          // Cloudflare (más confiable)
    request.headers.get("x-vercel-forwarded-for") ??    // Vercel
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ── Validación de inputs ─────────────────────────────────────────────────────
function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 254).replace(/[\x00-\x1F\x7F]/g, "");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // ── Rate limiting (OWASP A07) ──────────────────────────────────────────────
  const rl = loginLimiter.check(ip);
  if (!rl.allowed) {
    const retryMin = Math.ceil(rl.retryAfterMs / 60_000);
    log.warn("Rate limit alcanzado", { ip: ip.slice(0, 7) + "***" });
    return NextResponse.json(
      { error: `Demasiados intentos fallidos. Espera ${retryMin} minutos.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
          "X-RateLimit-Limit":     "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // ── Parsear y validar body ─────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  // Acepta "identifier" (puede ser email o matrícula de alumno) o "email" directo
  const identifier = sanitizeString(raw.identifier ?? raw.email);
  const password   = typeof raw.password === "string" ? raw.password.slice(0, 128) : "";
  const rol        = sanitizeString(raw.rol);

  const VALID_ROLES = ["alumno", "maestro", "admin", "padres"];

  if (!identifier || identifier.length < 3) {
    return NextResponse.json({ error: "Identificador inválido" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Contraseña inválida" }, { status: 400 });
  }
  if (!VALID_ROLES.includes(rol)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  // Si es matrícula (solo dígitos) y rol alumno → buscar email en DB
  let email = identifier;
  if (rol === "alumno" && /^\d+$/.test(identifier)) {
    const db = createSupabaseServerClient();
    const resolved = await (await db)
      .from("alumnos")
      .select("usuarios!inner(email)")
      .eq("matricula", identifier)
      .single();

    if (resolved.error || !resolved.data) {
      // No revelar si la matrícula existe (OWASP A07)
      const rlFail = loginLimiter.check(ip); // ya incrementó, solo leemos remaining
      log.warn("Matrícula no encontrada en login", { remaining: rlFail.remaining });
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos." },
        { status: 401 }
      );
    }
    const usr = (resolved.data as unknown as { usuarios: { email: string } }).usuarios;
    email = usr?.email ?? identifier;
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Correo electrónico inválido" }, { status: 400 });
  }

  // ── Autenticar con Supabase Auth ───────────────────────────────────────────
  const supabase = await createSupabaseServerClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    // Registrar intento fallido — check() ya incrementó el contador anterior,
    // hacemos un segundo check para actualizar el remaining visible.
    const rlFail = loginLimiter.check(ip);
    // Mensaje genérico — no revelar si el email existe (OWASP A07)
    const msg =
      rlFail.remaining <= 0
        ? "Cuenta bloqueada temporalmente por intentos fallidos."
        : "Correo o contraseña incorrectos.";
    log.warn("Intento de login fallido", { remaining: rlFail.remaining });
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  // ── Verificar que el rol del usuario coincide con lo solicitado ────────────
  // Usamos el access_token recién obtenido de signInWithPassword para crear
  // un cliente autenticado. Esto evita depender del service role key en runtime
  // y funciona correctamente con RLS en Cloudflare Workers.
  const { createClient: createBrowserClient } = await import("@supabase/supabase-js");
  const authedDb = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${authData.session!.access_token}`,
        },
      },
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
  const { data: dbUser, error: dbError } = await authedDb
    .from("usuarios")
    .select("id, rol, activo, primer_acceso")
    .eq("auth_id", authData.user.id)
    .single();

  if (dbError || !dbUser) {
    await supabase.auth.signOut();
    log.error("Usuario auth sin registro en DB", { authId: authData.user.id });
    // DEBUG TEMPORAL — se quitará después de resolver el problema
    return NextResponse.json(
      {
        error: "Usuario no encontrado en el sistema",
        _debug: {
          authId: authData.user.id,
          dbErrorCode: dbError?.code,
          dbErrorMsg: dbError?.message,
          dbErrorDetails: dbError?.details,
          hasSession: !!authData.session,
        },
      },
      { status: 403 }
    );
  }

  if (!dbUser.activo) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Cuenta desactivada. Contacta a administración." },
      { status: 403 }
    );
  }

  if (dbUser.rol !== rol) {
    await supabase.auth.signOut();
    // No revelar el rol real del usuario
    return NextResponse.json(
      { error: "Acceso denegado para el rol seleccionado." },
      { status: 403 }
    );
  }

  // ── Éxito: limpiar rate limit ──────────────────────────────────────────────
  loginLimiter.reset(ip);
  log.info("Login exitoso", { rol: dbUser.rol, primer_acceso: dbUser.primer_acceso });

  // Si es primer acceso → forzar cambio de contraseña
  if (dbUser.primer_acceso) {
    return NextResponse.json({
      ok: true,
      rol: dbUser.rol,
      redirect: "/cambiar-contrasena?forzado=true",
      primer_acceso: true,
    });
  }

  // La sesión ya fue guardada en cookie HttpOnly por createSupabaseServerClient
  return NextResponse.json({
    ok: true,
    rol: dbUser.rol,
    redirect: rolToDashboard(dbUser.rol),
  });
}

function rolToDashboard(rol: string): string {
  const map: Record<string, string> = {
    alumno:  "/dashboard/alumno",
    maestro: "/dashboard/maestro",
    admin:   "/dashboard/administrador",
    padres:  "/dashboard/padres",
  };
  return map[rol] ?? "/login";
}
