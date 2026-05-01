/**
 * lib/supabase-browser.ts
 * Cliente Supabase para uso exclusivo en Client Components ("use client").
 * Soporta Realtime y suscripciones en tiempo real.
 * NO usar en Server Components ni API Routes — usar lib/supabase-server.ts allí.
 */
import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";

export function createBrowserClient() {
  return createSSRBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton para compartir la misma conexión de realtime en el navegador
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient();
  }
  return browserClient;
}
