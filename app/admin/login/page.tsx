import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; config_error?: string; expired?: string; reset?: string; reset_error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-float rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 animate-float rounded-full bg-accent/10 blur-3xl [animation-delay:2s]"
      />

      <div className="relative w-full max-w-md">
        <div className="flex animate-fadeUp flex-col items-center text-center">
          <Image src="/logo.png" alt="Teyezilla Expeditions" width={132} height={127} priority className="h-16 w-auto" />
        </div>

        <div className="card mt-6 animate-fadeUp p-8 [animation-delay:100ms]">
          <h1 className="text-center font-heading text-2xl font-bold text-foreground">
            Teyezilla <span className="text-accent">Admin</span>
          </h1>
          <p className="mt-1 text-center text-sm text-foreground/60">Sign in to manage the platform.</p>

          {params.config_error && (
            <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
              Supabase isn&apos;t configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
              NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
            </p>
          )}
          {params.expired && (
            <p className="mt-4 rounded-xl bg-secondary/15 px-4 py-2 text-sm text-foreground/70">
              Your session expired. Please log in again.
            </p>
          )}
          {params.reset === "success" && (
            <p className="mt-4 rounded-xl bg-success/10 px-4 py-2 text-sm text-success">
              Password updated. Log in with your new password.
            </p>
          )}
          {params.reset_error && (
            <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
              That reset link is invalid or has expired. Request a new one below.
            </p>
          )}

          <LoginForm from={params.from || "/admin"} />

          {process.env.NODE_ENV !== "production" && (
            <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
              <p className="font-medium text-foreground/80">Setting up staff accounts (dev only)</p>
              <p className="mt-2">
                Create each staff member as a Supabase Auth user (Dashboard → Authentication →
                Users → Add User), then add a matching row to the <code>staff</code> table with
                their <code>auth_user_id</code> and role. See <code>supabase/seed.sql</code> for
                the exact steps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
