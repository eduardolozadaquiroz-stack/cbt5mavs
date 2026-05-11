/**
 * lib/rate-limit.ts
 *
 * Rate limiter con soporte para Cloudflare KV (producción) y memoria (dev).
 *
 * En Cloudflare Pages cada Worker puede ser instancia separada, por lo que
 * la memoria NO persiste entre requests. La protección real se hace con:
 *   - Cloudflare KV para persistencia distribuida
 *   - Cloudflare WAF Rate Limiting (dashboard → Security → WAF)
 *   - Cloudflare Turnstile (CAPTCHA invisible)
 *
 * OWASP A07 – Identification & Authentication Failures
 */

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

/* ── KV Storage Interface ─────────────────────────────────────────────────── */

export interface KVStorage {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

let _kvStorage: KVStorage | null = null;

export function setKVStorage(storage: KVStorage | null): void {
  _kvStorage = storage;
}

export function getKVStorage(): KVStorage | null {
  return _kvStorage;
}

/* ── Memory fallback (dev / single-instance) ──────────────────────────────── */

interface Bucket {
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

const getMemoryStore = (): Map<string, Bucket> => {
  const g = globalThis as Record<string, unknown>;
  if (!g.__rl_store) {
    g.__rl_store = new Map<string, Bucket>();
  }
  return g.__rl_store as Map<string, Bucket>;
};

/* ── RateLimiter Class ────────────────────────────────────────────────────── */

export class RateLimiter {
  private readonly opts: Required<RateLimitOptions>;
  private readonly prefix: string;

  constructor(opts: RateLimitOptions, prefix = "rl") {
    this.opts = { blockMs: opts.windowMs, ...opts };
    this.prefix = prefix;
  }

  async check(key: string): Promise<RateLimitResult> {
    if (_kvStorage) {
      return this.checkWithKV(key);
    }
    return this.checkInMemory(key);
  }

  async reset(key: string): Promise<void> {
    if (_kvStorage) {
      await _kvStorage.delete(`${this.prefix}:${key}`);
    } else {
      getMemoryStore().delete(key);
    }
  }

  private async checkWithKV(key: string): Promise<RateLimitResult> {
    const fullKey = `${this.prefix}:${key}`;
    const now = Date.now();

    const raw = await _kvStorage!.get(fullKey);
    let bucket: Bucket | null = null;

    if (raw) {
      try {
        bucket = JSON.parse(raw) as Bucket;
      } catch {
        bucket = null;
      }
    }

    if (bucket?.blockedUntil && now < bucket.blockedUntil) {
      return { allowed: false, remaining: 0, retryAfterMs: bucket.blockedUntil - now };
    }

    if (!bucket || now - bucket.windowStart > this.opts.windowMs) {
      const newBucket: Bucket = { count: 1, windowStart: now };
      await _kvStorage!.put(fullKey, JSON.stringify(newBucket), {
        expirationTtl: Math.ceil((this.opts.windowMs + this.opts.blockMs!) / 1000),
      });
      return { allowed: true, remaining: this.opts.maxAttempts - 1, retryAfterMs: 0 };
    }

    bucket.count++;

    if (bucket.count > this.opts.maxAttempts) {
      bucket.blockedUntil = now + this.opts.blockMs!;
      await _kvStorage!.put(fullKey, JSON.stringify(bucket), {
        expirationTtl: Math.ceil(this.opts.blockMs! / 1000),
      });
      return { allowed: false, remaining: 0, retryAfterMs: this.opts.blockMs! };
    }

    await _kvStorage!.put(fullKey, JSON.stringify(bucket), {
      expirationTtl: Math.ceil(this.opts.windowMs / 1000),
    });

    return { allowed: true, remaining: this.opts.maxAttempts - bucket.count, retryAfterMs: 0 };
  }

  private checkInMemory(key: string): RateLimitResult {
    const store = getMemoryStore();
    const now = Date.now();
    let bucket = store.get(key);

    if (bucket?.blockedUntil && now < bucket.blockedUntil) {
      return { allowed: false, remaining: 0, retryAfterMs: bucket.blockedUntil - now };
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
}

/* ── Rate limiters predefinidos ───────────────────────────────────────────── */

export const loginLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockMs: 30 * 60 * 1000,
}, "login");

export const forgotPasswordLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 10 * 60 * 1000,  // 3 intentos cada 10 min
  blockMs: 10 * 60 * 1000,
}, "forgot");

export const vinculacionLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000,
  blockMs: 60 * 60 * 1000,
}, "vincular");

export const contactLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000,
  blockMs: 2 * 60 * 60 * 1000,
}, "contacto");

export const apiLimiter = new RateLimiter({
  maxAttempts: 100,
  windowMs: 15 * 60 * 1000,
  blockMs: 30 * 60 * 1000,
}, "api");
