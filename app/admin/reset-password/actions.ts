"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ResetPasswordState {
  error?: "config" | "no_session" | "weak_password" | "mismatch";
}

export async function updatePassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password.length < 8) {
    return { error: "weak_password" };
  }
  if (password !== confirmPassword) {
    return { error: "mismatch" };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { error: "config" };
  }

  // The recovery session was established by app/admin/auth/confirm's code
  // exchange, carried here via the same cookies proxy.ts refreshes on every
  // request -- no token is passed through the form itself.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "no_session" };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "weak_password" };
  }

  // Sign out and require a fresh login with the new password rather than
  // threading this recovery session into the same session-expiry cookie
  // machinery login() sets up (lib/admin/sessionExpiry.ts) -- simpler, and
  // avoids a recovery session quietly acting as a full admin session with
  // no expiry cookie set.
  await supabase.auth.signOut();
  redirect("/admin/login?reset=success");
}
