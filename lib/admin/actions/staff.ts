"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin/session";
import type { StaffRole } from "@/lib/admin/permissions";
import { redirectWithSaved } from "./saved-redirect";

export interface StaffInput {
  fullName: string;
  email: string;
  role: StaffRole;
}

function randomTempPassword(): string {
  // 16 random bytes as base64url; meets Supabase's password requirements
  // and is only ever shown once, to the admin creating the account.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Buffer.from(bytes).toString("base64url");
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    throw new Error("Only admins can manage staff accounts.");
  }
  return session;
}

// Creates a real, login-capable Supabase Auth account (not just a `staff`
// row) via the Auth Admin API, which requires the service role key and
// bypasses RLS entirely, so the admin-only check above is the only gate
// here, not the database. Returns the temp password so the caller (the
// admin's browser) can display it once; it's never stored or logged.
export async function createStaffMember(input: StaffInput): Promise<{ tempPassword: string }> {
  await requireAdmin();

  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const tempPassword = randomTempPassword();

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: tempPassword,
    email_confirm: true,
  });
  if (authError) throw new Error(authError.message);

  const { error: staffError } = await supabase.from("staff").insert({
    auth_user_id: authUser.user.id,
    full_name: input.fullName,
    email: input.email,
    role: input.role,
  });
  if (staffError) {
    console.error("[createStaffMember] staff insert failed:", staffError.message);
    // Roll back the auth user so we don't leave a login-capable orphan. In
    // its own try/catch: if the rollback itself throws, the original
    // staffError.message below is what the admin needs to see and fix --
    // an unrelated rollback failure must never mask it and fall through to
    // Next.js's generic redacted "Server Components render" error instead.
    try {
      await supabase.auth.admin.deleteUser(authUser.user.id);
    } catch (rollbackErr) {
      console.error(
        "[createStaffMember] rollback of orphaned auth user failed:",
        rollbackErr instanceof Error ? rollbackErr.message : rollbackErr,
        "-- auth_user_id:",
        authUser.user.id
      );
    }
    throw new Error(staffError.message);
  }

  revalidatePath("/admin/staff");
  return { tempPassword };
}

// Issues a new temp password via the Auth Admin API, same mechanism as
// createStaffMember -- Supabase Auth already owns credentials entirely (see
// lib/admin/data/staff.ts), so this needs no schema of its own, just the
// same admin-only gate and one-time-display pattern as account creation.
export async function resetStaffPassword(authUserId: string): Promise<{ tempPassword: string }> {
  await requireAdmin();

  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const tempPassword = randomTempPassword();

  const { error } = await supabase.auth.admin.updateUserById(authUserId, { password: tempPassword });
  if (error) throw new Error(error.message);

  return { tempPassword };
}

export async function updateStaffMember(id: string, input: { fullName: string; role: StaffRole }): Promise<void> {
  await requireAdmin();

  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase
    .from("staff")
    .update({ full_name: input.fullName, role: input.role })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/staff");
  redirectWithSaved("/admin/staff", `"${input.fullName}" saved.`);
}

export async function deleteStaffMember(id: string, authUserId: string): Promise<void> {
  const session = await requireAdmin();

  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data: target } = await supabase.from("staff").select("email").eq("id", id).maybeSingle();
  if (target?.email === session.email) {
    throw new Error("You can't delete your own staff account.");
  }

  // Auth user goes first: if this fails (network blip, transient gateway
  // error), nothing has changed yet and the admin can just retry. Doing it
  // in the other order risks a live, login-capable Auth account surviving
  // with no staff row to show for it if the second call fails.
  const { error: authError } = await supabase.auth.admin.deleteUser(authUserId);
  if (authError) throw new Error(authError.message);

  const { error: staffError } = await supabase.from("staff").delete().eq("id", id);
  if (staffError) {
    console.error(
      "[deleteStaffMember] staff row delete failed after auth user was already removed:",
      staffError.message,
      "-- id:",
      id,
      "-- authUserId:",
      authUserId
    );
    throw new Error(staffError.message);
  }

  revalidatePath("/admin/staff");
  redirectWithSaved("/admin/staff", "Staff member deleted.");
}
