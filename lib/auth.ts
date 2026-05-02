/**
 * lib/auth.ts
 * Helpers de autenticación para API Routes.
 * Provee verificación de sesión y validación de rol en el servidor.
 */
import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase-server";

export type AppRole = "alumno" | "maestro" | "admin" | "padres";

export interface AuthUser {
  id: string;       // auth.uid()
  email: string;
  rol: AppRole;
  db_id: string;    // usuarios.id (UUID interno de la app)
}

/**
 * Obtiene el usuario autenticado actual.
 * Valida el JWT contra Supabase Auth (server-side).
 * Retorna null si no hay sesión válida.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createSupabaseServerClient();

    // getUser() verifica el token contra Supabase Auth (no decodifica JWT local)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Usamos el admin client para leer usuarios — evita que problemas de
    // GRANTs o RLS rompan la autenticación en Cloudflare Workers.
    // Es seguro porque ya validamos la identidad con auth.getUser() arriba.
    const adminClient = createSupabaseAdminClient();
    const { data: dbUser, error: dbError } = await adminClient
      .from("usuarios")
      .select("id, rol")
      .eq("auth_id", user.id)
      .eq("activo", true)
      .single();

    if (dbError || !dbUser) return null;

    return {
      id: user.id,
      email: user.email ?? "",
      rol: dbUser.rol as AppRole,
      db_id: dbUser.id,
    };
  } catch {
    return null;
  }
}

/**
 * Middleware helper: requiere autenticación.
 * Retorna [user, null] si OK o [null, 401 response] si falla.
 */
export async function requireAuth(): Promise<
  [AuthUser, null] | [null, NextResponse]
> {
  const user = await getAuthUser();
  if (!user) {
    return [
      null,
      NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    ];
  }
  return [user, null];
}

/**
 * Middleware helper: requiere autenticación con rol específico.
 * Retorna [user, null] si OK o [null, error response] si falla.
 */
export async function requireRole(
  ...roles: AppRole[]
): Promise<[AuthUser, null] | [null, NextResponse]> {
  const [user, err] = await requireAuth();
  if (err) return [null, err];

  if (!roles.includes(user!.rol)) {
    return [
      null,
      NextResponse.json(
        { error: "Acceso denegado: rol insuficiente" },
        { status: 403 }
      ),
    ];
  }
  return [user!, null];
}

/**
 * Registra un evento en audit_log.
 * Fire-and-forget: los errores se silencian para no interrumpir el flujo principal.
 *
 * @param userId    - usuarios.id del actor (null para acciones anónimas)
 * @param tabla     - tabla afectada (ej: "calificaciones", "usuarios")
 * @param accion    - verbo (ej: "INSERT", "UPDATE", "DELETE", "LOGIN", "ACCESO_DENEGADO")
 * @param registroId - id del registro afectado (opcional)
 * @param detalle   - objeto JSON con contexto adicional (NO incluir datos sensibles)
 */
export async function auditLog(
  userId: string | null,
  tabla: string,
  accion: string,
  registroId?: string | null,
  detalle?: Record<string, unknown>
): Promise<void> {
  try {
    const admin = createSupabaseAdminClient();
    await admin.from("audit_log").insert({
      usuario_id:      userId,
      tabla_afectada:  tabla,
      accion,
      registro_id:     registroId ?? null,
      datos_nuevos:    detalle ?? null,
      created_at:      new Date().toISOString(),
    });
  } catch {
    // No interrumpir el flujo si el log falla
  }
}
