// Next.js auto-loads this file on the client (the modern replacement for
// the older sentry.client.config.ts pattern). Covers client-component
// errors -- anything React catches in the browser that isn't already
// caught by a Server Action's own try/catch before it ever reaches here.
import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === "production",
});

// Required hook so the SDK can instrument client-side route transitions
// (App Router navigations aren't full page loads, so Sentry needs this to
// know when one starts).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
