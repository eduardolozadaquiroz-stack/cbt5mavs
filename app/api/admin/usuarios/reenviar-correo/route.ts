/**
 * POST /api/admin/usuarios/reenviar-correo
 * Reenvía el correo de activación/bienvenida a un usuario existente.
 * Solo accesible por administradores.
 *
 * Body: { correo: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";
import { isEmail } from "@/lib/validate";
import { generatePasswordRecoveryLink, sendAuthEmail } from "@/lib/email";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const correo = typeof body.correo === "string" ? body.correo.trim().toLowerCase() : "";
  if (!correo || !isEmail(correo)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Verificar que el usuario exista en la BD
  const { data: usuario } = await admin
    .from("usuarios")
    .select("id, nombre")
    .eq("email", correo)
    .maybeSingle();

  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Generar el enlace con Supabase Auth, pero enviar el correo desde el proyecto.
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? request.nextUrl.origin;
  const redirectTo = `${origin.replace(/\/$/, "")}/auth/reset-password`;

  try {
    const actionUrl = await generatePasswordRecoveryLink(admin, correo, redirectTo);
    await sendAuthEmail({
      to: correo,
      actionUrl,
      kind: "welcome",
      name: usuario.nombre,
    });
  } catch (emailError) {
    console.error("[reenviar-correo] email error:", emailError);
    return NextResponse.json({ error: "No se pudo enviar el correo. Verifica la configuración SMTP de Gmail." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
