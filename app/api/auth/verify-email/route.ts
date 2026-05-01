/**
 * GET /api/auth/verify-email?token_hash=xxx&type=signup
 * Verifica el email de un usuario recién registrado.
 * Supabase envía el enlace de verificación que apunta aquí.
 * Tras verificar, redirige al login con ?verified=1
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "signup" | "recovery" | null;

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=link_invalido`);
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=link_expirado`);
  }

  if (type === "recovery") {
    // Para recuperación de contraseña: ir a la página de nueva contraseña
    return NextResponse.redirect(`${origin}/auth/reset-password`);
  }

  // Para verificación de email: login con confirmación
  return NextResponse.redirect(`${origin}/login?verified=1`);
}
