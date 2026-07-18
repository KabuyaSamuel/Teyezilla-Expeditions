import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/admin/session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
