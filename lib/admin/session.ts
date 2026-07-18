import { cookies } from "next/headers";
import type { StaffRole } from "./permissions";

// Lightweight cookie-based session for local development and design review.
// Replace this with real Supabase Auth (auth.getUser() + a `staff` table
// lookup for role) once Phase 4 wires up authentication. Every function here
// keeps the same signature so swapping the implementation doesn't require
// changing any page or component that calls it.

const SESSION_COOKIE = "teyezilla_admin_session";

export interface AdminSession {
  name: string;
  email: string;
  role: StaffRole;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
