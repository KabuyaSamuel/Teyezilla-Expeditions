import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; config_error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md card p-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Teyezilla <span className="text-accent">Admin</span>
        </h1>
        <p className="mt-1 text-sm text-foreground/60">Sign in to manage the platform.</p>

        {params.config_error && (
          <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
            Supabase isn&apos;t configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
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
  );
}
