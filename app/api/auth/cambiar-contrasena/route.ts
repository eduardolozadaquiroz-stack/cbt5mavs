/**
 * POST /api/auth/cambiar-contrasena
 * Cambia la contraseña del usuario autenticado y limpia el flag primer_acceso.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createLogger } from "@/lib/logger";

export const runtime = 'edge';

const log = createLogger("api/auth/cambiar-contrasena");

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { nueva_contrasena } = body as Record<string, unknown>;

  if (typeof nueva_contrasena !== "string" || !PASSWORD_REGEX.test(nueva_contrasena)) {
    return NextResponse.json(
      { error: "La contraseña no cumple los requisitos de seguridad." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  // Verificar sesión activa
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user) {
    return NextResponse.json({ error: "Sesión expirada. Inicia sesión de nuevo." }, { status: 401 });
  }

  // Actualizar contraseña en Supabase Auth
  const { error: updateError } = await supabase.auth.updateUser({
    password: nueva_contrasena,
  });

  if (updateError) {
    log.error("Error al cambiar contraseña", { userId: user.id });
    return NextResponse.json({ error: "No se pudo actualizar la contraseña." }, { status: 500 });
  }

  // Limpiar el flag primer_acceso en la tabla usuarios
  const { error: dbError } = await supabase
    .from("usuarios")
    .update({ primer_acceso: false, updated_at: new Date().toISOString() })
    .eq("auth_id", user.id);

  if (dbError) {
    log.error("Error al limpiar primer_acceso", { userId: user.id });
    // No es crítico, el usuario ya cambió su contraseña
  }

  log.info("Contraseña cambiada exitosamente", { userId: user.id });

  // Obtener rol para redirigir al dashboard correcto
  const { data: dbUser } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("auth_id", user.id)
    .single();

  const rolMap: Record<string, string> = {
    alumno:  "/dashboard/alumno",
    maestro: "/dashboard/maestro",
    admin:   "/dashboard/administrador",
    padres:  "/dashboard/padres",
  };

  return NextResponse.json({
    ok: true,
    redirect: rolMap[dbUser?.rol ?? ""] ?? "/login",
  });
}
