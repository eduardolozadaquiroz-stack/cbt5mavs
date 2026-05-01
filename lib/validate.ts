/**
 * lib/validate.ts
 * Helpers de validación y sanitización de inputs para API Routes.
 * Centraliza reglas reutilizables para prevenir A03 (Injection) y XSS.
 */

// ── Regex constantes ─────────────────────────────────────────────────────────

/** UUID v4 estándar */
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Correo electrónico (no permite caracteres de control) */
export const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * CURP mexicana — 18 caracteres.
 * Formato: 4 letras + 6 dígitos + 6 alfanuméricos + 1 dígito + 1 alfanumérico
 */
export const CURP_RE = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;

/** Matrícula del CBT: solo alfanumérico, 6-15 chars */
export const MATRICULA_RE = /^[A-Z0-9]{6,15}$/i;

/** Contraseña segura: mínimo 8 chars, al menos 1 letra y 1 número */
export const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// ── Funciones ─────────────────────────────────────────────────────────────────

/**
 * Sanitiza un string: recorta espacios, limita longitud, elimina caracteres de control.
 * NO escapa HTML — eso es responsabilidad del front-end en renderizado.
 */
export function sanitize(v: unknown, maxLen = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, "");
}

/** Valida UUID v4 */
export function isUUID(s: string): boolean {
  return UUID_RE.test(s);
}

/** Valida email */
export function isEmail(s: string): boolean {
  return EMAIL_RE.test(s);
}

/** Valida CURP mexicana */
export function isCURP(s: string): boolean {
  return CURP_RE.test(s.toUpperCase());
}

/** Normaliza CURP (mayúsculas, trim) */
export function normalizeCURP(s: string): string {
  return s.trim().toUpperCase();
}

/**
 * Valida una URL segura para almacenamiento de imágenes.
 * - Solo https://
 * - Solo dominios permitidos (Supabase Storage o CDN propio)
 * - Previene URLs javascript:, data:, file: que causarían XSS
 */
const ALLOWED_IMAGE_HOSTS = [
  // Supabase Storage (reemplazar con tu proyecto real)
  /^[a-z0-9-]+\.supabase\.co$/,
  /^[a-z0-9-]+\.supabase\.in$/,
];

export function isSafeImageUrl(url: string): boolean {
  if (!url) return true; // empty es válido (campo opcional)
  try {
    const parsed = new URL(url);
    // Solo HTTPS
    if (parsed.protocol !== "https:") return false;
    // Solo hostnames permitidos
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_IMAGE_HOSTS.some((re) => re.test(host));
  } catch {
    return false;
  }
}

/**
 * Valida fecha en formato YYYY-MM-DD.
 * Previene inyección de fechas malformadas.
 */
export function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

/**
 * Convierte un valor a entero positivo con límites.
 * Retorna defaultVal si el valor es inválido.
 */
export function safeInt(
  v: unknown,
  defaultVal = 1,
  min = 1,
  max = 1000
): number {
  const n = parseInt(String(v ?? ""), 10);
  if (isNaN(n)) return defaultVal;
  return Math.max(min, Math.min(max, n));
}
