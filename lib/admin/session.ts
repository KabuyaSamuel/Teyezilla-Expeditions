import * as Sentry from "@sentry/nextjs";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { StaffRole } from "./permissions";

// Real admin session backed by Supabase Auth + the `staff` table. A user is
// only recognized as admin staff if BOTH: (1) they have a valid Supabase
// Auth session, AND (2) their auth user id has a matching row in `staff`
// with a role. This means creating a Supabase Auth user alone doesn't grant
// admin access; someone (you, via the Dashboard or an admin-only mutation)
// also has to add them to `staff` with auth_user_id set. See
// supabase/seed.sql for the staff-linking steps.

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: staffRow, error } = await supabase
    .from("staff")
    .select("id, full_name, email, role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !staffRow) {
    console.warn("[admin session] Authenticated user has no matching staff record:", error?.message);
    return null;
  }

  const session: AdminSession = {
    id: staffRow.id as string,
    name: staffRow.full_name as string,
    email: staffRow.email as string,
    role: staffRow.role as StaffRole,
  };

  // Called from both page renders and individual admin Server Actions
  // (each its own request), so setting this here -- rather than only in
  // the dashboard layout -- makes sure an error thrown from an action also
  // gets attributed to the staff member who triggered it, not just errors
  // during a page load. No new PII: email/name/role already live in this
  // session object.
  Sentry.setUser({ id: session.id, email: session.email, username: session.name });
  Sentry.setTag("staff_role", session.role);

  return session;
}
