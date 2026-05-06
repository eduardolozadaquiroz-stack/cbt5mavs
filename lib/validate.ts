/**
 * lib/validate.ts
 * Re-exports desde lib/schemas.ts para compatibilidad con código existente.
 * Toda validación nueva debe usar schemas.ts directamente.
 */

export {
  UUID_RE,
  EMAIL_RE,
  CURP_RE,
  MATRICULA_RE,
  PASSWORD_RE,
  sanitize,
  isUUID,
  isEmail,
  isCURP,
  normalizeCURP,
  isSafeImageUrl,
  isValidDate,
  safeInt,
} from "@/lib/schemas";
