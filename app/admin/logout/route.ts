import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const response = NextResponse.redirect(new URL("/admin/login", request.url));

  // Belt-and-suspenders on top of signOut(): explicitly expire every
  // Supabase auth cookie ("sb-*", including large tokens split into
  // "sb-*.0"/"sb-*.1" chunks) on the actual response being returned, so no
  // session trace survives even if signOut()'s own cookie writes (via
  // next/headers cookies(), see lib/supabase/server.ts) didn't merge into
  // this separately-constructed NextResponse.
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-")) {
      response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }

  return response;
}
