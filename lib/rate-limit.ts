/**
 * lib/rate-limit.ts
 *
 * Rate limiter en memoria con ventana deslizante.
 * Centraliza la lógica para reutilizarla en login y vincular-alumno.
 *
 * NOTA: Esta implementación es correcta para despliegues de INSTANCIA ÚNICA
 * (Railway, Render single-instance, etc.). Si escalas a múltiples instancias,
 * migra a Upstash Redis usando el mismo contrato de interfaz:
 *   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 *
 * OWASP A07 – Identification & Authentication Failures
 */

interface Bucket {
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

export interface RateLimitOptions {
  /** Número máximo de intentos en la ventana */
  maxAttempts: number;
  /** Duración de la ventana en ms */
  windowMs: number;
  /** Duración del bloqueo tras superar maxAttempts (ms). Si no se define, no bloquea. */
  blockMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** ms hasta que el bloqueo expire (0 si no está bloqueado) */
  retryAfterMs: number;
}

export class RateLimiter {
  private store = new Map<string, Bucket>();
  private readonly opts: Required<RateLimitOptions>;

  constructor(opts: RateLimitOptions) {
    this.opts = { blockMs: opts.windowMs, ...opts };

    // Limpiar entradas caducadas cada 10 minutos para evitar memory leaks
    const interval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
    // Permitir que el proceso de Node termine sin esperar este timer
    if (interval.unref) interval.unref();
  }

  /**
   * Registra un intento y retorna si está permitido.
   * @param key - Identificador único (IP, userId, etc.)
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    let bucket = this.store.get(key);

    // Si está bloqueado, verificar si ya expiró el bloqueo
    if (bucket?.blockedUntil) {
      if (now < bucket.blockedUntil) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: bucket.blockedUntil - now,
        };
      }
      // Bloqueo expirado → limpiar
      this.store.delete(key);
      bucket = undefined;
    }

    // Si no hay bucket o la ventana expiró, crear uno nuevo
    if (!bucket || now - bucket.windowStart > this.opts.windowMs) {
      bucket = { count: 1, windowStart: now };
      this.store.set(key, bucket);
      return {
        allowed: true,
        remaining: this.opts.maxAttempts - 1,
        retryAfterMs: 0,
      };
    }

    // Incrementar contador dentro de la ventana
    bucket.count++;

    if (bucket.count > this.opts.maxAttempts) {
      // Supera el límite → aplicar bloqueo
      bucket.blockedUntil = now + this.opts.blockMs!;
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: this.opts.blockMs!,
      };
    }

    return {
      allowed: true,
      remaining: this.opts.maxAttempts - bucket.count,
      retryAfterMs: 0,
    };
  }

  /**
   * Limpia el estado para una clave (ej: tras login exitoso).
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /** Elimina entradas caducadas para evitar memory leaks. */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, bucket] of this.store.entries()) {
      const expired = bucket.blockedUntil
        ? now > bucket.blockedUntil
        : now - bucket.windowStart > this.opts.windowMs;
      if (expired) this.store.delete(key);
    }
  }
}

// ── Instancias singleton compartidas ─────────────────────────────────────────

/** Rate limiter para /api/auth/login — 5 intentos / 15 min → bloqueo 30 min */
export const loginLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs:    15 * 60 * 1000,
  blockMs:     30 * 60 * 1000,
});

/** Rate limiter para /api/padres/vincular-alumno — 5 intentos / 1 hora */
export const vinculacionLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs:    60 * 60 * 1000,
  blockMs:     60 * 60 * 1000,
});
