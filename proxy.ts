import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_EXPIRY_COOKIE, isSessionExpired } from "@/lib/admin/sessionExpiry";

// Route guard for /admin/*, using Supabase Auth. This also refreshes the
// Supabase session cookie on every request, which is required by
// @supabase/ssr; without it, sessions expire unexpectedly. See:
// https://supabase.com/docs/guides/auth/server-side/nextjs

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return supabaseResponse;
  }

  if (!pathname.startsWith("/admin")) {
    return supabaseResponse;
  }

  // Fail closed: if Supabase isn't configured yet, there's no way to
  // authenticate, so every /admin route redirects to login rather than
  // being left open.
  if (!url || !anonKey) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("config_error", "1");
    return NextResponse.redirect(loginUrl);
  }

  let user;
  let supabase;
  try {
    supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch (error) {
    // Fail closed: a network blip talking to Supabase (mobile connectivity,
    // a timeout, DNS hiccup) must not surface as a raw crash of the Netlify
    // edge function -- it should look like an ordinary "please sign in".
    console.error("proxy: Supabase auth check failed", error);
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("auth_error", "1");
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Supabase's refresh token has no fixed expiry by default, so without this
  // check the getUser() call above keeps silently renewing a session
  // forever. This enforces the hard cutoff set at login time (1 day, or 7
  // days with "remember me") regardless of how many requests refresh the
  // underlying Supabase token in between.
  if (isSessionExpired(request.cookies.get(SESSION_EXPIRY_COOKIE)?.value)) {
    await supabase.auth.signOut();
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
