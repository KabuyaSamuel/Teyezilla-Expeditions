// Supabase's own refresh token has no fixed expiry by default, so without
// this, proxy.ts's session refresh keeps a staff login alive indefinitely.
// This layers a hard, absolute cutoff on top: a companion cookie storing the
// timestamp a session must stop being honored by, set once at login and
// never extended by activity. Edge-safe (no Node/Supabase imports) so it can
// be used from proxy.ts, which runs on the Edge runtime.

export const SESSION_EXPIRY_COOKIE = "admin-session-expires-at";

export const DEFAULT_SESSION_MS = 24 * 60 * 60 * 1000; // 1 day
export const REMEMBER_ME_SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function isSessionExpired(cookieValue: string | undefined): boolean {
  const expiresAt = Number(cookieValue);
  return !expiresAt || Date.now() > expiresAt;
}
