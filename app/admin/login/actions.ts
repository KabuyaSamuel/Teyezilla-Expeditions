"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/server";
import { SESSION_EXPIRY_COOKIE, DEFAULT_SESSION_MS, REMEMBER_ME_SESSION_MS } from "@/lib/admin/sessionExpiry";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export interface LoginState {
  error?: "email" | "password" | "config" | "rate_limited";
  email?: string;
}

// Only redirects on success or missing config; a bad email/password returns
// state instead of redirecting, so the calling client component (via
// useActionState) can show a specific error without losing what the staff
// member already typed.
export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin");
  const remember = formData.get("remember") === "on";

  // Security audit (Part 4): this endpoint had zero rate limiting of any
  // kind -- every public form (contact/trip-planner/booking) already
  // calls checkRateLimit, but the one endpoint actually gated behind
  // credentials had none. Limits on two dimensions rather than one:
  // by IP (getClientIp -- see that function's own comment on how much to
  // trust this depends on which platform is actually serving the
  // request) catches a credential-spray hitting many staff emails from
  // one source, and by the submitted email itself catches a single
  // account getting brute-forced across rotating IPs, which an IP-only
  // limit would miss entirely if IP spoofing turns out to bypass that
  // dimension. Fails open (allowed: true) if Upstash isn't configured,
  // matching every other checkRateLimit call in this app.
  const ip = await getClientIp();
  const [ipLimit, emailLimit] = await Promise.all([
    checkRateLimit("login-ip", ip),
    email ? checkRateLimit("login-email", email.toLowerCase()) : Promise.resolve({ allowed: true, remaining: Infinity }),
  ]);
  if (!ipLimit.allowed || !emailLimit.allowed) {
    return { error: "rate_limited", email };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { error: "config", email };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase's own error is deliberately generic ("Invalid login
    // credentials") to avoid leaking account existence on a public signup
    // form. This login is staff-only with accounts created by an admin (no
    // public signup), so telling staff specifically which field is wrong is
    // a reasonable, explicitly requested tradeoff here -- checked via the
    // service-role client against the `staff` table, not Supabase Auth
    // itself (which the anon client can't query directly).
    const service = getSupabaseServiceClient();
    let reason: "email" | "password" = "password";
    if (service) {
      const { data: staffRow } = await service
        .from("staff")
        .select("id")
        .ilike("email", email)
        .maybeSingle();
      if (!staffRow) reason = "email";
    }
    return { error: reason, email };
  }

  const sessionMs = remember ? REMEMBER_ME_SESSION_MS : DEFAULT_SESSION_MS;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_EXPIRY_COOKIE, String(Date.now() + sessionMs), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMs / 1000,
  });

  redirect(from || "/admin");
}
