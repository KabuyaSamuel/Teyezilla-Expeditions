import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase client for use in Server Components, Server Actions,
// and Route Handlers. Reads/writes the auth session via Next.js cookies so
// the session survives across requests. Returns null (rather than throwing)
// if env vars aren't set yet, so the rest of the app can fall back to seed
// data gracefully instead of crashing during local development or CI builds
// that don't have Supabase configured.

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll is called from a Server Component in some cases, where
          // cookies can't be mutated. Safe to ignore if you have proxy.ts
          // refreshing sessions (see proxy.ts in the project root).
        }
      },
    },
  });
}

// Admin/service-role client for privileged server-only operations (seeding,
// admin writes that should bypass RLS). NEVER import this in client
// components or expose the service role key to the browser.
export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  // Lazy import so this code path never bundles into client code.
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
