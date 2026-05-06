import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  RateLimiter,
  getKVStorage,
  setKVStorage,
} from "@/lib/rate-limit";

describe("RateLimiter (in-memory)", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    setKVStorage(null);
    limiter = new RateLimiter({
      maxAttempts: 3,
      windowMs: 1000,
      blockMs: 2000,
    }, "test");
  });

  it("permite requests dentro del límite", async () => {
    const r1 = await limiter.check("user1");
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await limiter.check("user1");
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);
  });

  it("bloquea después de exceder el límite", async () => {
    await limiter.check("user2");
    await limiter.check("user2");
    await limiter.check("user2");

    const r4 = await limiter.check("user2");
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.retryAfterMs).toBeGreaterThan(0);
  });

  it("reset permite nuevos intentos", async () => {
    await limiter.check("user3");
    await limiter.check("user3");
    await limiter.check("user3");

    await limiter.reset("user3");

    const r = await limiter.check("user3");
    expect(r.allowed).toBe(true);
  });

  it("keys diferentes son independientes", async () => {
    await limiter.check("userA");
    await limiter.check("userA");
    await limiter.check("userA");

    const rB = await limiter.check("userB");
    expect(rB.allowed).toBe(true);
  });
});

describe("RateLimiter (con KV)", () => {
  let limiter: RateLimiter;
  const store = new Map<string, string>();

  const mockKV = {
    async get(key: string): Promise<string | null> {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string): Promise<void> {
      store.set(key, value);
    },
    async delete(key: string): Promise<void> {
      store.delete(key);
    },
  };

  beforeEach(() => {
    store.clear();
    setKVStorage(mockKV);
    limiter = new RateLimiter({
      maxAttempts: 3,
      windowMs: 1000,
      blockMs: 2000,
    }, "test-kv");
  });

  afterEach(() => {
    setKVStorage(null);
  });

  it("funciona con KV storage", async () => {
    const r1 = await limiter.check("kv-user");
    expect(r1.allowed).toBe(true);

    await limiter.check("kv-user");
    await limiter.check("kv-user");

    const r4 = await limiter.check("kv-user");
    expect(r4.allowed).toBe(false);
  });

  it("reset funciona con KV", async () => {
    await limiter.check("kv-user2");
    await limiter.check("kv-user2");
    await limiter.check("kv-user2");

    await limiter.reset("kv-user2");

    const r = await limiter.check("kv-user2");
    expect(r.allowed).toBe(true);
  });
});
