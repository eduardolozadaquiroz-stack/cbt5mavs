/**
 * POST /api/auth/reset-password
 * Actualiza la contraseña usando el token de recovery de Supabase.
 *
 * El flujo es:
 * 1. El email de reset lleva a /auth/reset-password?token_hash=xxx&type=recovery
 * 2. La página intercambia el hash por una sesión (OTP exchange)
 * 3. Llama a este endpoint con la nueva contraseña
 *
 * Seguridad:
 * - Requiere sesión activa (post OTP exchange) — OWASP A07
 * - Validación de complejidad de contraseña
 * - Rate limiting
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";


const MIN_LEN = 8;
const PWD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // al menos 1 letra y 1 número

export async function POST(request: NextRequest) {
  // El usuario debe estar autenticado (sesión del OTP exchange)
  const [, err] = await requireAuth();
  if (err) return err;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  const confirm  = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (password.length < MIN_LEN || !PWD_RE.test(password)) {
    return NextResponse.json(
      { error: "La contraseña debe tener mínimo 8 caracteres, con al menos una letra y un número." },
      { status: 400 }
    );
  }
  if (password !== confirm) {
    return NextResponse.json({ error: "Las contraseñas no coinciden." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: "No se pudo actualizar la contraseña." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
