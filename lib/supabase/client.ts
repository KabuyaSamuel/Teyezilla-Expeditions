import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for Client Components that need auth state
// (e.g. reacting to sign-in/sign-out). Most data reads in this project
// happen server-side, so this is used sparingly.

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars are not set. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  return createBrowserClient(url, anonKey);
}
