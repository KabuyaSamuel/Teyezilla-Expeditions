// Loaded by instrumentation.ts when the Node.js runtime starts (Server
// Actions, Route Handlers, RSC rendering). See instrumentation.ts for why
// this isn't just top-level code in that file.
import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

Sentry.init({
  dsn: env.SENTRY_DSN,
  // Travel booking site, not a high-scale SaaS -- full tracing on every
  // request isn't needed and the free tier has a request budget.
  tracesSampleRate: 0.1,
  // Quieter locally; DSN is empty in dev anyway unless explicitly set.
  enabled: process.env.NODE_ENV === "production",
});
