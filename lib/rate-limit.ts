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

// Security audit (Part 4), Vercel -> Netlify migration: this used to trust
// x-forwarded-for first. That's safe specifically on Vercel because its
// edge network overwrites x-forwarded-for with a verified value before a
// request reaches app code -- Netlify makes no such guarantee. Netlify's
// own staff, on their support forum: "We make no guarantees on anything
// except 'X-Nf-Client-Connection-Ip'. Please use that one instead!" --
// x-forwarded-for is explicitly *not* one of the headers Netlify commits
// to controlling, so on Netlify a client can set it directly and bypass
// every IP-based limit below (contact, trip-planner, booking, admin
// login).
//
// x-nf-client-connection-ip is checked first now, with x-forwarded-for/
// x-real-ip kept only as a fallback (better than bucketing every visitor
// under "unknown" if the Netlify-specific header is ever absent -- e.g.
// local dev, or a platform other than Netlify) -- NOT because it's
// trusted there. Every endpoint using getClientIp() has a corresponding
// non-IP backstop for exactly this reason: contact/trip-planner/booking
// are all also capped by Upstash's own abuse heuristics being moot if
// spoofed, but more importantly checkRateLimit's "area" keys mean a
// spoofed IP just gets its own fresh bucket rather than bypassing the
// system entirely; admin login (app/admin/login/actions.ts) additionally
// rate-limits by the submitted email itself, which an attacker can't
// rotate as freely as an IP header.
//
// This still needs verifying against a real Netlify deployment (not done
// here -- this audit pass is static/local analysis only, no live
// deployment access) to confirm x-nf-client-connection-ip is actually
// populated in production the way Netlify's docs describe.
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const netlifyVerifiedIp = h.get("x-nf-client-connection-ip");
  if (netlifyVerifiedIp) return netlifyVerifiedIp;

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
