// Loaded by instrumentation.ts when the Edge runtime starts (proxy.ts /
// middleware). Kept separate from sentry.server.config.ts because the Edge
// runtime doesn't support all Node APIs the SDK may use.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === "production",
});
