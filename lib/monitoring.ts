import * as Sentry from "@sentry/nextjs";

// For the "soft failure" points in public Server Actions (booking, contact,
// trip-planner) where an error is caught and turned into a friendly
// { formError } return value instead of being thrown. Next.js's
// onRequestError hook (see instrumentation.ts) only fires for errors that
// actually propagate out of a Server Action, so these would otherwise be
// invisible to Sentry -- only reachable via Vercel logs after the fact.
// Wraps the message in a real Error so Sentry gets a stack trace pointing
// at this call site, which is more useful than the original DB error's own
// (often missing) stack.
export function captureServerActionError(area: string, message: string, extra?: Record<string, unknown>) {
  console.warn(`[${area}]`, message);
  Sentry.captureException(new Error(message), { tags: { area }, extra });
}
