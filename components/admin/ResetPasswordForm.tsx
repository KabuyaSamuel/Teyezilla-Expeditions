"use client";

import { useActionState } from "react";
import { updatePassword, type ResetPasswordState } from "@/app/admin/reset-password/actions";

const initialState: ResetPasswordState = {};

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<ResetPasswordState, FormData>(updatePassword, initialState);

  return (
    <>
      {state.error === "config" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          Supabase isn&apos;t configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
        </p>
      )}
      {state.error === "no_session" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          This reset link has expired or was already used. Request a new one.
        </p>
      )}
      {state.error === "weak_password" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          That password isn&apos;t allowed -- try a longer or less common one.
        </p>
      )}
      {state.error === "mismatch" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          Passwords don&apos;t match.
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="text-xs font-medium text-foreground/60">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-xs font-medium text-foreground/60">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
          {pending ? "Updating…" : "Set New Password"}
        </button>
      </form>
    </>
  );
}
