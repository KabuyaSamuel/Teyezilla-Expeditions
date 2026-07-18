import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { findStaffByEmail } from "@/lib/admin/data/staff";
import { SESSION_COOKIE_NAME } from "@/lib/admin/session";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin");

  const staff = findStaffByEmail(email);

  if (!staff || staff.password !== password) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    JSON.stringify({ name: staff.fullName, email: staff.email, role: staff.role }),
    { httpOnly: true, path: "/", maxAge: 60 * 60 * 8 }
  );

  redirect(from || "/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md card p-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Teyezilla <span className="text-accent">Admin</span>
        </h1>
        <p className="mt-1 text-sm text-foreground/60">Sign in to manage the platform.</p>

        {params.error && (
          <p className="mt-4 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
            Invalid email or password.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="from" value={params.from || "/admin"} />
          <div>
            <label className="text-xs font-medium text-foreground/60">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@teyezilla.com"
              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Password</label>
            <input
              name="password"
              type="password"
              required
              defaultValue="demo123"
              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Log In</button>
        </form>

        <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
          <p className="font-medium text-foreground/80">Demo accounts (password: demo123)</p>
          <ul className="mt-2 space-y-1">
            <li>admin@teyezilla.com — Admin (full access)</li>
            <li>manager@teyezilla.com — Manager</li>
            <li>sales@teyezilla.com — Sales Agent</li>
            <li>guide@teyezilla.com — Tour Guide</li>
            <li>driver@teyezilla.com — Driver</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
