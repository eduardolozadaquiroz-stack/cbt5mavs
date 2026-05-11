/**
 * lib/site-config.ts
 * Helpers de servidor para leer la configuración del sitio desde Supabase.
 * Solo usar en Server Components y API Routes (no en "use client").
 */
import { createServiceClient } from "@/lib/supabase";

/**
 * Verifica si una sección pública está habilitada en la configuración del admin.
 * Retorna `true` (habilitada) en caso de error para no romper el sitio.
 *
 * OWASP A01 – Access Control: usar en Server Components para proteger rutas
 * de secciones que el admin puede deshabilitar.
 */
export async function isSectionEnabled(section: string): Promise<boolean> {
  try {
    const db = createServiceClient();
    const { data } = await db
      .from("site_config")
      .select("config")
      .eq("id", 1)
      .single();

    const config = data?.config as Record<string, unknown> | undefined;
    const secciones = (config?.secciones ?? {}) as Record<
      string,
      { enabled: boolean }
    >;

    // Fuente de verdad principal: secciones[section].enabled
    if (secciones?.[section]?.enabled !== undefined) {
      return secciones[section].enabled;
    }

    // Fallback específico: admision.habilitada
    if (section === "admision") {
      return (
        ((config?.admision as Record<string, unknown>)
          ?.habilitada as boolean) ?? true
      );
    }

    return true; // Default: habilitada
  } catch {
    return true; // En error: permitir acceso (no romper el sitio)
  }
}
