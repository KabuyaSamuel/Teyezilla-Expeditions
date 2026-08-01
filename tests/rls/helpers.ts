// Shared clients for RLS regression tests. These run against the real
// Supabase project (there's no separate test project for this app), using
// the same anon/service-role credentials the app itself uses. Every test
// that writes cleans up its own row in a `finally` block, and only ever
// touches rows it created itself -- never real content.

import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. RLS tests run against the real Supabase project and need ` +
        `NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY ` +
        `(from .env.local locally, or repo secrets in CI).`
    );
  }
  return value;
}

export function anonClient() {
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    auth: { persistSession: false },
  });
}

export function serviceClient() {
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// One real destination row is needed as a parent for temp tours/
// accommodations; reused read-only across tests rather than created fresh.
export async function anyDestinationId(): Promise<string> {
  const { data, error } = await serviceClient().from("destinations").select("id").limit(1).single();
  if (error || !data) throw new Error(`No destination found to use as a test parent: ${error?.message}`);
  return data.id;
}
