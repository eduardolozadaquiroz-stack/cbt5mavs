/**
 * POST /api/perfil/cambiar-contrasena
 * Cambia la contraseña del usuario autenticado (requiere la contraseña actual).
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";


const PWD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export async function POST(request: NextRequest) {
  const [, err] = await requireAuth();
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword     = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirm         = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!currentPassword) {
    return NextResponse.json({ error: "La contraseña actual es requerida" }, { status: 400 });
  }
  if (!PWD_RE.test(newPassword)) {
    return NextResponse.json(
      { error: "La nueva contraseña debe tener mínimo 8 caracteres, con al menos una letra y un número." },
      { status: 400 }
    );
  }
  if (newPassword !== confirm) {
    return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  // Verificar la contraseña actual intentando re-autenticar
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return NextResponse.json({ error: "No se pudo actualizar la contraseña" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
