"use server";

import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export interface ForgotPasswordState {
  submitted?: boolean;
  error?: "config" | "rate_limited";
}

// Same dual-dimension rate limit as admin login (app/admin/login/actions.ts):
// by IP to catch a scripted flood, by email to catch someone spamming a
// specific staff member's inbox with reset links from rotating IPs.
export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  const ip = await getClientIp();
  const [ipLimit, emailLimit] = await Promise.all([
    checkRateLimit("forgot-password-ip", ip),
    email ? checkRateLimit("forgot-password-email", email) : Promise.resolve({ allowed: true, remaining: Infinity }),
  ]);
  if (!ipLimit.allowed || !emailLimit.allowed) {
    return { error: "rate_limited" };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { error: "config" };
  }

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  // Result deliberately ignored -- Supabase doesn't error on an unknown
  // email either, and always returning the same "submitted" state (below)
  // regardless of whether the account exists prevents using this form to
  // enumerate valid staff emails.
  if (email) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/admin/auth/confirm`,
    });
  }

  return { submitted: true };
}
