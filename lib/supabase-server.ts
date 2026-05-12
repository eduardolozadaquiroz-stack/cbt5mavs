/**
 * lib/supabase-server.ts
 * Cliente Supabase para uso en Server Components y API Routes (Next.js App Router).
 * Maneja cookies HttpOnly automáticamente para sesiones JWT seguras.
 * NO usar en Client Components — usar lib/supabase.ts allí.
 */
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function requireEnv(variable: string): string {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
  return value;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

/**
 * Cliente de servicio — solo para operaciones privilegiadas en API routes.
 * NO exponer al cliente. Usa la SERVICE_ROLE_KEY que bypasa RLS.
 * Es síncrono — no necesita cookies porque actúa como service account.
 */
export function createSupabaseAdminClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Cliente de servicio async con soporte de cookies (para casos donde
 * se necesita tanto privilegios elevados como acceso al contexto de request).
 */
export async function createSupabaseAdminServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
