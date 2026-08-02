"use client";

// Only renders for an error the root layout itself can't recover from
// (React error boundaries can't catch errors in their own parent tree).
// Has to render its own <html>/<body> since it replaces the root layout
// entirely when active.

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="max-w-md text-sm text-foreground/70">
          We&apos;ve been notified and are looking into it. Please try again, or reach us on WhatsApp if it keeps happening.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
