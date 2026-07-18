import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin");

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    redirect(`/admin/login?error=config&from=${encodeURIComponent(from)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
  }

  redirect(from || "/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string; config_error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md card p-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Teyezilla <span className="text-accent">Admin</span>
        </h1>
        <p className="mt-1 text-sm text-foreground/60">Sign in to manage the platform.</p>

        {(params.config_error || params.error === "config") && (
          <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
            Supabase isn&apos;t configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
          </p>
        )}
        {params.error === "1" && (
          <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
            Invalid email or password.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="from" value={params.from || "/admin"} />
          <div>
            <label htmlFor="email" className="text-xs font-medium text-foreground/60">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Log In</button>
        </form>

        <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
          <p className="font-medium text-foreground/80">Setting up staff accounts</p>
          <p className="mt-2">
            Create each staff member as a Supabase Auth user (Dashboard → Authentication →
            Users → Add User), then add a matching row to the <code>staff</code> table with
            their <code>auth_user_id</code> and role. See <code>supabase/seed.sql</code> for
            the exact steps.
          </p>
        </div>
      </div>
    </div>
  );
}
