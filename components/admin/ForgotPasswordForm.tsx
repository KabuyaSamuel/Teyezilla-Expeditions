"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "@/app/admin/forgot-password/actions";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ForgotPasswordState, FormData>(requestPasswordReset, initialState);

  // Same message shown whether or not the email is real -- see the action's
  // own comment on why (avoids leaking which staff emails exist).
  if (state.submitted) {
    return (
      <p className="mt-4 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
        If an account exists for that email, a reset link is on its way. Check your inbox.
      </p>
    );
  }

  return (
    <>
      {state.error === "config" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          Supabase isn&apos;t configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
        </p>
      )}
      {state.error === "rate_limited" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          Too many reset requests. Please wait a bit before trying again.
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-xs font-medium text-foreground/60">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
          {pending ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </>
  );
}
