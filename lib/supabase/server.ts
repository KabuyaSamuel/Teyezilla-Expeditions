import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

// Server-side Supabase client for use in Server Components, Server Actions,
// and Route Handlers. Reads/writes the auth session via Next.js cookies so
// the session survives across requests.
//
// Deliberately NOT parameterized with <Database> (see types/database.ts):
// this client is used for nearly every write in the app, and doing so
// forces every .insert()/.update() call into strict shape-checking
// against the generated types -- which cascades into ~15 unrelated files
// with real but out-of-scope mismatches (nullable columns, dynamic insert
// objects built from index signatures, a Json-vs-ContentBlock[] mismatch
// in blog posts). Database's Row types are applied directly at individual
// mapRow() call sites instead -- narrower, safer, matches what this pass
// is actually for.

export async function getSupabaseServerClient() {
  // Same reasoning as getSupabasePublicClient's guard (lib/supabase/public.ts):
  // required per lib/env.ts, but that check is skippable via
  // SKIP_ENV_VALIDATION, so these can genuinely be empty at runtime in a
  // CI run with no repository secrets. Every caller already checks
  // `if (!supabase)`, so return null instead of letting createServerClient
  // fail in some less obvious way once it actually issues a request.
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;

  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
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
// components or expose the service role key to the browser. Every current
// importer is a "use server" action file or a server component (verified),
// so a normal static import is safe here -- it never reaches a client
// bundle regardless. A previous version used a runtime require() instead,
// intended to keep this out of client bundles, but a bare require() inside
// an ESM module is a real risk under Turbopack's production bundling (it
// can behave differently in `next build` than in `next dev`), which is the
// more likely failure mode to guard against.
export function getSupabaseServiceClient() {
  // Returns null rather than throwing when the key is missing, matching
  // getSupabasePublicClient()/getSupabaseServerClient() above: every real
  // caller of this function already does `if (!supabase) ...` itself --
  // lib/admin/actions/staff.ts (the actual Add Staff Member code) throws
  // its own "Supabase not configured" error at the call site, and the
  // public contact/booking/trip-planner actions do
  // `getSupabaseServiceClient() ?? getSupabasePublicClient()`, a fallback
  // that only works against null. An earlier version of this function
  // threw here directly, which broke that fallback outright -- `??`
  // doesn't catch a thrown error, so a missing key crashed those public
  // form submissions instead of degrading to the anon client the way they
  // were designed to. Loud failure still happens, just at whichever call
  // site actually needs it (staff.ts already does this correctly).
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
