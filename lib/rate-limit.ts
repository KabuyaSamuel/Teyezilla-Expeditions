import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

// Fails open (allows the submission, just unthrottled) when Upstash isn't
// configured -- same philosophy as lib/email.ts: an infra gap here should
// never block a real customer's enquiry. See lib/env.ts for the env vars.
const ratelimit =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }),
        // 5 submissions per IP per hour per form -- enough for a genuine
        // family enquiring about multiple trips in one session, not enough
        // for a scripted flood.
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        analytics: true,
        prefix: "teyezilla-ratelimit",
      })
    : null;

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function checkRateLimit(area: string, identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  if (!ratelimit) {
    console.warn(`[rate-limit] Upstash not configured -- "${area}" submission allowed unthrottled.`);
    return { allowed: true, remaining: Infinity };
  }

  const { success, remaining } = await ratelimit.limit(`${area}:${identifier}`);
  if (!success) {
    // A warning, not an error -- this is expected abuse-prevention behavior
    // working correctly, not something broken. See it in Sentry to notice
    // real abuse patterns without treating them as application errors.
    Sentry.captureMessage(`Rate limit hit on ${area} form`, {
      level: "warning",
      tags: { area },
      extra: { identifier },
    });
  }
  return { allowed: success, remaining };
}
