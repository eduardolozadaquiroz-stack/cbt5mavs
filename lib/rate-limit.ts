/**
 * lib/rate-limit.ts
 *
 * Rate limiter adaptado para Cloudflare Pages (Edge Runtime).
 *
 * En Edge Runtime cada Worker puede ser una instancia separada, por lo que
 * la memoria NO persiste entre requests de diferentes instancias.
 * La protección real en Cloudflare se hace a nivel CDN mediante:
 *   - Cloudflare WAF Rate Limiting rules (dashboard → Security → WAF)
 *   - Cloudflare Turnstile (CAPTCHA invisible)
 *
 * Esta implementación mantiene la misma interfaz para compatibilidad,
 * pero el estado es por-instancia (funciona en desarrollo y single-instance).
 *
 * OWASP A07 – Identification & Authentication Failures
 */

interface Bucket {
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

export interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
  blockMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

// En Edge Runtime usamos globalThis para compartir estado dentro de la misma instancia
// (no persiste entre instancias distintas de Cloudflare Workers)
const getStore = (): Map<string, Bucket> => {
  if (!(globalThis as Record<string, unknown>).__rl_store) {
    (globalThis as Record<string, unknown>).__rl_store = new Map<string, Bucket>();
  }
  return (globalThis as Record<string, unknown>).__rl_store as Map<string, Bucket>;
};

export class RateLimiter {
  private readonly opts: Required<RateLimitOptions>;

  constructor(opts: RateLimitOptions) {
    this.opts = { blockMs: opts.windowMs, ...opts };
  }

  check(key: string): RateLimitResult {
    const store = getStore();
    const now = Date.now();
    let bucket = store.get(key);

    if (bucket?.blockedUntil) {
      if (now < bucket.blockedUntil) {
        return { allowed: false, remaining: 0, retryAfterMs: bucket.blockedUntil - now };
      }
      store.delete(key);
      bucket = undefined;
    }

    if (!bucket || now - bucket.windowStart > this.opts.windowMs) {
      bucket = { count: 1, windowStart: now };
      store.set(key, bucket);
      return { allowed: true, remaining: this.opts.maxAttempts - 1, retryAfterMs: 0 };
    }

    bucket.count++;

    if (bucket.count > this.opts.maxAttempts) {
      bucket.blockedUntil = now + this.opts.blockMs!;
      return { allowed: false, remaining: 0, retryAfterMs: this.opts.blockMs! };
    }

    return { allowed: true, remaining: this.opts.maxAttempts - bucket.count, retryAfterMs: 0 };
  }

  reset(key: string): void {
    getStore().delete(key);
  }
}

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
