import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Plain, cookie-free Supabase client for public content reads (destinations,
// tours, blog posts, reviews). Unlike lib/supabase/server.ts, this doesn't
// depend on next/headers cookies(), so it's safe to call from anywhere;
// including generateStaticParams and generateMetadata, which run at build
// time outside a request context and would throw if they touched cookies().
// Never use this for anything that needs the signed-in user's session.

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
