import * as Sentry from "@sentry/nextjs";

// Next.js auto-loads this file once per server/edge runtime instance. This
// is where Sentry actually gets initialized server-side -- sentry.server/
// edge.config.ts hold the Sentry.init() calls themselves, kept as separate
// files (rather than inlined here) purely because that's the convention
// Sentry's own tooling and docs expect, which keeps this file readable as
// "which runtime loads which config" rather than mixing in init options.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next.js's own error-reporting hook: fires for any error during request
// handling on the server -- Server Actions, Route Handlers, RSC rendering
// -- independently of whether the calling client code also catches it.
// This is what makes "every admin action" and the public forms covered
// without needing a Sentry.captureException() call added to each one
// individually: as long as an action throws (rather than catching and
// returning a friendly error state), this hook sees it.
export const onRequestError = Sentry.captureRequestError;
