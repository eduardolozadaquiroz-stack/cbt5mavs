import { createClient } from "@supabase/supabase-js";

function requireEnv(variable: string): string {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
  return value;
}

// Cliente público — lazy: se instancia cuando se usa por primera vez,
// no al importar el módulo (evita errores "supabaseUrl is required" en build time).
let _supabaseInstance: ReturnType<typeof createClient> | undefined;

function getPublicClient() {
  if (!_supabaseInstance) {
    _supabaseInstance = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    );
  }
  return _supabaseInstance;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop, receiver) {
    return Reflect.get(getPublicClient(), prop, receiver);
  },
});

// Cliente con privilegios de servidor (solo en API routes)
export function createServiceClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}
