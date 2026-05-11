/**
 * POST /api/auth/forgot-password
 * Inicia el flujo de recuperación de contraseña.
 * Genera el enlace con Supabase Auth y envía el email desde el proyecto.
 *
 * Seguridad:
 * - Respuesta genérica (no revela si el email existe — OWASP A07)
 * - Rate limiting por IP
 * - Input sanitization
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { generatePasswordRecoveryLink, sendAuthEmail } from "@/lib/email";
import { forgotPasswordLimiter } from "@/lib/rate-limit";

function getIp(req: NextRequest) {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  // A07 – Auth Failures: rate limiting con KV (efectivo en Cloudflare Workers
  // multi-instancia a diferencia de un Map en memoria)
  const rl = await forgotPasswordLimiter.check(ip);
  if (!rl.allowed) {
    // Respuesta genérica para no revelar nada (OWASP A07)
    return NextResponse.json({ ok: true });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const raw = typeof body.identifier === "string" ? body.identifier.trim().slice(0, 254) : "";
  if (!raw) {
    return NextResponse.json({ error: "Identificador requerido" }, { status: 400 });
  }

  // Determinar el email: si parece email úsalo directamente, si no buscar por matrícula
  let email = raw;

  if (!EMAIL_RE.test(raw)) {
    // Podría ser matrícula de alumno
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("alumnos")
      .select("usuarios!inner(email)")
      .eq("matricula", raw)
      .maybeSingle();

    if (data) {
      const usr = (data as unknown as { usuarios: { email: string } }).usuarios;
      email = usr?.email ?? "";
    } else {
      // No revelar si existe o no (OWASP A07)
      return NextResponse.json({ ok: true });
    }
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: true });
  }

  // generateLink solo genera el token; el envío lo hace el proyecto.
  const admin = createSupabaseAdminClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? request.nextUrl.origin;
  const redirectTo = `${origin.replace(/\/$/, "")}/auth/reset-password`;

  try {
    const actionUrl = await generatePasswordRecoveryLink(admin, email, redirectTo);
    await sendAuthEmail({
      to: email,
      actionUrl,
      kind: "password-reset",
    });
  } catch {
    // No propagamos el error (OWASP A07 — no revelar si el email existe)
  }

  return NextResponse.json({ ok: true });
}
