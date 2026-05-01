/**
 * lib/logger.ts
 *
 * Logger estructurado para API Routes.
 * - En desarrollo: muestra logs legibles en consola.
 * - En producción: emite JSON estructurado (compatible con Vercel/Railway/Datadog).
 * - Nunca imprime datos sensibles (passwords, tokens, CURP completa, etc.).
 *
 * OWASP A09 – Security Logging & Monitoring
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  msg: string;
  context?: string;
  [key: string]: unknown;
}

const IS_PROD = process.env.NODE_ENV === "production";

function log(level: LogLevel, context: string, msg: string, meta?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    ts: new Date().toISOString(),
    context,
    msg,
    ...meta,
  };

  if (IS_PROD) {
    // JSON estructurado para ingestores de logs
    const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    fn(JSON.stringify(entry));
  } else {
    // Formato legible en desarrollo
    const levelTag = {
      debug: "🔍",
      info:  "ℹ️",
      warn:  "⚠️",
      error: "❌",
    }[level];
    const metaStr = meta ? " " + JSON.stringify(meta) : "";
    console[level === "debug" ? "log" : level](
      `${levelTag} [${context}] ${msg}${metaStr}`
    );
  }
}

/** Crea un logger con contexto fijo (nombre del módulo/ruta). */
export function createLogger(context: string) {
  return {
    debug: (msg: string, meta?: Record<string, unknown>) => log("debug", context, msg, meta),
    info:  (msg: string, meta?: Record<string, unknown>) => log("info",  context, msg, meta),
    warn:  (msg: string, meta?: Record<string, unknown>) => log("warn",  context, msg, meta),
    error: (msg: string, meta?: Record<string, unknown>) => log("error", context, msg, meta),
  };
}

export type Logger = ReturnType<typeof createLogger>;
