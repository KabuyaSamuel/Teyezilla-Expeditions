import { createClient } from "@supabase/supabase-js";

// Plain, cookie-free Supabase client for public content reads (destinations,
// tours, blog posts, reviews). Unlike lib/supabase/server.ts, this doesn't
// depend on next/headers cookies(), so it's safe to call from anywhere —
// including generateStaticParams and generateMetadata, which run at build
// time outside a request context and would throw if they touched cookies().
// Never use this for anything that needs the signed-in user's session.

export function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
