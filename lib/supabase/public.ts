import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Plain, cookie-free Supabase client for public content reads (destinations,
// tours, blog posts, reviews). Unlike lib/supabase/server.ts, this doesn't
// depend on next/headers cookies(), so it's safe to call from anywhere;
// including generateStaticParams and generateMetadata, which run at build
// time outside a request context and would throw if they touched cookies().
// Never use this for anything that needs the signed-in user's session.
//
// Deliberately NOT parameterized with <Database> (see types/database.ts):
// doing so at the client level forces every .insert()/.update() elsewhere
// in the app (getSupabaseServerClient, most write paths) into strict
// shape-checking against the generated types, which cascades into ~15
// unrelated files with real but out-of-scope mismatches (nullable
// columns, dynamic insert objects, a Json-vs-ContentBlock[] mismatch in
// blog posts). Database's Row types are used directly at individual
// mapRow() call sites instead -- narrower, safer, matches what this pass
// is actually for.

export function getSupabasePublicClient() {
  // env.NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are required (see lib/env.ts), so
  // importing this module already throws a clear error if they're missing
  // -- this null-return path is unreachable in practice now, kept only so
  // callers don't need a non-null assertion and this function's signature
  // doesn't change.
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
