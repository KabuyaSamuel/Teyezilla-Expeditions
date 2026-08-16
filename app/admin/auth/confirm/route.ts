import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Landing point for the link Supabase emails from resetPasswordForEmail
// (app/admin/forgot-password/actions.ts). Exchanges the one-time `code` for
// a real (recovery-type) session -- carried via cookies, same mechanism
// proxy.ts refreshes on every request -- then hands off to the page that
// actually collects the new password. Has to be a Route Handler rather than
// a Server Component: cookies() can only be mutated (which exchanging the
// code requires) from a Server Action or a Route Handler, not a page render.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const loginErrorUrl = request.nextUrl.clone();
  loginErrorUrl.pathname = "/admin/login";
  loginErrorUrl.search = "";
  loginErrorUrl.searchParams.set("reset_error", "1");

  if (!code) {
    return NextResponse.redirect(loginErrorUrl);
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    loginErrorUrl.searchParams.set("config_error", "1");
    return NextResponse.redirect(loginErrorUrl);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(loginErrorUrl);
  }

  const resetUrl = request.nextUrl.clone();
  resetUrl.pathname = "/admin/reset-password";
  resetUrl.search = "";
  return NextResponse.redirect(resetUrl);
}
