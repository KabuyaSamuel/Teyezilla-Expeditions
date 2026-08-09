import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Validates every env var this app reads, at build/boot time, with a clear
// error naming exactly which one is missing or malformed -- instead of the
// app silently degrading (per the fail-open pattern in lib/supabase/*,
// lib/email.ts) until someone happens to hit the one feature that needed
// it. That silent-degradation pattern is deliberate for things that should
// never block a form submission (email), but it's exactly what let a
// missing SUPABASE_SERVICE_ROLE_KEY reach production undetected -- this is
// the fix, layered on top of (not replacing) those existing fallbacks.
//
// "Required" here only for values the app cannot correctly serve real
// traffic without: the Supabase connection itself. Email/Sentry/WhatsApp/
// Analytics are deliberately optional, matching how the app already treats
// them -- validating their presence would fight the app's own fail-soft
// design for a mail outage or a not-yet-wired-up integration, not fix a
// real gap. What IS validated for the optional ones is *shape* (e.g. a
// DSN must be a URL if you bother to set one at all), so a typo still gets
// caught instead of failing silently later.
export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required -- see the Add Staff Member incident this was added to prevent a repeat of."),

    RESEND_API_KEY: z.string().min(1).optional(),
    ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),
    EMAIL_FROM: z.string().min(1).optional(),

    SENTRY_DSN: z.string().url().optional(),
    SENTRY_ORG: z.string().min(1).optional(),
    SENTRY_PROJECT: z.string().min(1).optional(),
    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),

    // Optional: rate limiting on the public booking/contact/trip-planner
    // forms fails open (allows the submission, just unthrottled) when
    // these aren't set -- same philosophy as email, an infra gap here
    // should never block a real customer's enquiry. See lib/rate-limit.ts.
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

    // Phase 4, not yet wired into any code path.
    WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
    WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),

    // Phase 4, not yet wired into any code path.
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
    // Commented out in app/layout.tsx until this is set and the domain is
    // connected -- see the <GoogleAnalytics> block there.
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
    // Not wired -- GA4 is loaded directly, not through a GTM container.
    NEXT_PUBLIC_GTM_ID: z.string().optional(),
    NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().optional(),
  },
  // Next.js inlines NEXT_PUBLIC_* at build time via static analysis, which
  // can't see into a loop/spread -- every var has to be listed explicitly
  // here even though it's mechanical.
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  },
  // .env.example (and a freshly-copied .env.local before it's filled in)
  // has every optional var present but set to "" -- without this, "" fails
  // z.string().url().optional() since .optional() only accepts undefined,
  // not an empty string, which would make every not-yet-configured
  // optional integration look like a validation error instead of "unset".
  emptyStringAsUndefined: true,
  // The CI build job (.github/workflows/ci.yml) deliberately builds without
  // any Supabase secrets -- every data-fetching function in this codebase
  // already fails open when they're absent, so that job checks compile
  // correctness only, not real data. This is the one legitimate case for
  // skipping validation; it sets SKIP_ENV_VALIDATION=1 itself. A real
  // build (Vercel, or a local `npm run build` without .env.local) is
  // expected to fail loudly here -- that's the point of this file.
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
