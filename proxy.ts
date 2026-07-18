import { NextRequest, NextResponse } from "next/server";

// Route guard for /admin/*. Checks for the mock session cookie set by
// /admin/login. Swap the cookie check for a real Supabase Auth session check
// in Phase 4 — the redirect logic below can stay as-is.

const SESSION_COOKIE = "teyezilla_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(SESSION_COOKIE);
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
