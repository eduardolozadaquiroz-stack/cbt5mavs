import { z } from "zod";

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
export const CURP_RE = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
export const MATRICULA_RE = /^[A-Z0-9]{6,15}$/i;
export const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function sanitize(v: unknown, maxLen = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, "");
}

export function isUUID(s: string): boolean {
  return UUID_RE.test(s);
}

export function isEmail(s: string): boolean {
  return EMAIL_RE.test(s);
}

export function isCURP(s: string): boolean {
  return CURP_RE.test(s.toUpperCase());
}

export function normalizeCURP(s: string): string {
  return s.trim().toUpperCase();
}

const ALLOWED_IMAGE_HOSTS = [
  /^[a-z0-9-]+\.supabase\.co$/,
  /^[a-z0-9-]+\.supabase\.in$/,
];

export function isSafeImageUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_IMAGE_HOSTS.some((re) => re.test(host));
  } catch {
    return false;
  }
}

export function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

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

/* ── Zod schemas reutilizables ────────────────────────────────────────────── */

export const uuidSchema = z.string().regex(UUID_RE, "UUID inválido");
export const emailSchema = z.string().regex(EMAIL_RE, "Correo inválido");
export const curpSchema = z.string().regex(CURP_RE, "CURP inválido");
export const matriculaSchema = z.string().regex(MATRICULA_RE, "Matrícula inválida");
export const passwordSchema = z.string()
  .min(8, "Mínimo 8 caracteres")
  .regex(PASSWORD_RE, "Debe contener al menos una letra y un número");

export const loginSchema = z.object({
  identifier: z.string().min(3, "Identificador muy corto").max(254),
  password: z.string().min(6, "Contraseña muy corta").max(128),
  rol: z.enum(["alumno", "maestro", "admin", "padres"]),
});

export const avisoSchema = z.object({
  titulo: z.string().min(1).max(200),
  cuerpo: z.string().min(1).max(4000),
  tipo: z.string().min(1).max(50),
  destinatario: z.enum(["Todos", "Alumnos", "Maestros", "Padres"]).default("Todos"),
  activo: z.boolean().default(true),
  fotos: z.array(z.string().url()).max(5).default([]),
  videos: z.array(z.string().url()).max(3).default([]),
  pdfs: z.array(z.string().url()).max(5).default([]),
  es_evento: z.boolean().optional(),
  evento_inicio: z.string().nullable().optional(),
  evento_fin: z.string().nullable().optional(),
  evento_lugar: z.string().max(300).nullable().optional(),
  evento_vestimenta: z.string().max(200).nullable().optional(),
  evento_enlace: z.string().max(500).nullable().optional(),
});

export const contactoSchema = z.object({
  nombre: z.string().min(1).max(200),
  email: z.string().email("Correo inválido"),
  asunto: z.string().min(1).max(300),
  mensaje: z.string().min(1).max(5000),
});

export const admisionSchema = z.object({
  nombre: z.string().min(1).max(100),
  apellido_paterno: z.string().min(1).max(100),
  apellido_materno: z.string().max(100).optional(),
  curp: z.string().regex(CURP_RE, "CURP inválido"),
  fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  sexo: z.enum(["M", "F", "NB"]).optional(),
  email: z.string().email().optional().or(z.literal("")),
  telefono: z.string().max(20).optional(),
  carrera_preferencia_1: uuidSchema.optional(),
  carrera_preferencia_2: uuidSchema.optional(),
  secundaria_procedencia: z.string().max(200).optional(),
  promedio_secundaria: z.number().min(0).max(10).optional(),
  ciclo_ingreso: z.string().min(1),
});

export const calificacionSchema = z.object({
  alumno_id: uuidSchema,
  grupo_materia_id: uuidSchema,
  parcial: z.number().int().min(1).max(3),
  calificacion: z.number().min(0).max(10),
  faltas: z.number().int().min(0).default(0),
  observaciones: z.string().max(500).optional(),
});

export const paginatedResponseSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  total_pages: z.number().int().min(0),
});
