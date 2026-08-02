// Confirms the actual configured limit (5 submissions/IP/hour, see
// lib/rate-limit.ts) triggers against the real Upstash project -- there's no
// separate test project for this app, matching tests/rls/*'s "run against
// the real thing, clean up after yourself" approach. Requires
// UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN (from .env.local locally,
// or repo secrets in CI); throws clearly if they're missing rather than
// silently skipping, same as tests/rls/helpers.ts.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "@/lib/rate-limit";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. This test runs against the real Upstash project and needs ` +
        `UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (from .env.local locally, or repo secrets in CI).`
    );
  }
  return value;
}

describe("rate limit", () => {
  const area = "test-area";
  const identifier = `__rate_limit_test_${Date.now()}__`;

  // Fails fast with a clear "X is not set" message before any test runs,
  // rather than letting lib/rate-limit.ts quietly fail open (allowed: true,
  // unthrottled) and surface as a confusing assertion mismatch instead.
  beforeAll(() => {
    requireEnv("UPSTASH_REDIS_REST_URL");
    requireEnv("UPSTASH_REDIS_REST_TOKEN");
  });

  afterAll(async () => {
    const redis = new Redis({
      url: requireEnv("UPSTASH_REDIS_REST_URL"),
      token: requireEnv("UPSTASH_REDIS_REST_TOKEN"),
    });
    const keys = await redis.keys(`teyezilla-ratelimit:${area}:${identifier}*`);
    if (keys.length > 0) await redis.del(...keys);
  });

  it("allows the first 5 submissions then blocks the 6th", async () => {
    for (let i = 0; i < 5; i++) {
      const { allowed } = await checkRateLimit(area, identifier);
      expect(allowed).toBe(true);
    }
    const { allowed: sixth } = await checkRateLimit(area, identifier);
    expect(sixth).toBe(false);
  });

  it("keeps a separate identifier unaffected by another identifier's limit", async () => {
    const { allowed } = await checkRateLimit(area, `${identifier}_other`);
    expect(allowed).toBe(true);
  });
});
