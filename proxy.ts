import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Route guard for /admin/*, using Supabase Auth. This also refreshes the
// Supabase session cookie on every request, which is required by
// @supabase/ssr — without it, sessions expire unexpectedly. See:
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

  const supabase = createServerClient(url, anonKey, {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
