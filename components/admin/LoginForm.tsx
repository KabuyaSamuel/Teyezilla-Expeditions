"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export default function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, initialState);

  return (
    <>
      {state.error === "config" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          Supabase isn&apos;t configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
        </p>
      )}
      {state.error === "email" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          No admin account exists for that email.
        </p>
      )}
      {state.error === "password" && (
        <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
          Incorrect password for that email.
        </p>
      )}

      {/* Uncontrolled inputs, submitted via a Server Action through
          useActionState -- since a failed login returns state instead of
          redirecting, the browser never navigates and both fields keep
          whatever the staff member typed, so they can fix just the one
          that's wrong. */}
      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="from" value={from} />
        <div>
          <label htmlFor="email" className="text-xs font-medium text-foreground/60">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={state.email}
            autoComplete="username"
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-medium text-foreground/60">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input type="checkbox" name="remember" className="h-4 w-4 accent-primary" />
          Remember me for 7 days
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
          {pending ? "Signing in…" : "Log In"}
        </button>
      </form>
    </>
  );
}
