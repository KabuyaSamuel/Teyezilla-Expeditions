import type { Destination } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { seedDestinations } from "@/lib/destinations.seed";

// Real data layer for destinations. Tries Supabase first; falls back to the
// seed fixture (lib/destinations.seed.ts) if Supabase isn't configured yet,
// or if a query fails for any reason. This means the site keeps working
// during local development before .env.local is set up, and a transient DB
// issue in production degrades to stale-but-correct content instead of a
// broken page. Failures are logged via console.warn so they're visible in
// server logs rather than silently masked.

function mapRow(row: Record<string, unknown>): Destination {
  return {
    id: row.id as string,
    slug: row.slug as string,
    countryName: row.country_name as string,
    flagEmoji: (row.flag_emoji as string) ?? "",
    heroImage: (row.hero_image as string) ?? "",
    shortDescription: (row.short_description as string) ?? "",
    overview: (row.overview as string) ?? "",
    bestTimeToVisit: (row.best_time_to_visit as string) ?? "",
    visaInfo: (row.visa_info as string) ?? "",
    isLaunchDestination: Boolean(row.is_launch_destination),
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    ogImage: (row.og_image as string) ?? "",
  };
}

export async function getDestinations(): Promise<Destination[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return seedDestinations;

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("is_launch_destination", { ascending: false });

  if (error || !data) {
    console.warn("[destinations] Supabase query failed, using seed data:", error?.message);
    return seedDestinations;
  }

  return data.map(mapRow);
}

export async function getLaunchDestinations(): Promise<Destination[]> {
  const all = await getDestinations();
  return all.filter((d) => d.isLaunchDestination);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return seedDestinations.find((d) => d.slug === slug);

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[destinations] Supabase query failed, using seed data:", error.message);
    return seedDestinations.find((d) => d.slug === slug);
  }

  return mapRow(data);
}

// Tours reference their destination by id (a UUID once Supabase is
// connected), not by slug — use this for that lookup rather than
// getDestinationBySlug, which only happens to work against seed data because
// the seed fixture's id and slug are the same string for convenience.
export async function getDestinationById(id: string): Promise<Destination | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return seedDestinations.find((d) => d.id === id);

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[destinations] Supabase query failed, using seed data:", error.message);
    return seedDestinations.find((d) => d.id === id);
  }

  return mapRow(data);
}
