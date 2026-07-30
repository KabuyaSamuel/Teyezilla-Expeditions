import type { Destination } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

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
    healthGuidance: (row.health_guidance as string) ?? "",
    packingList: (row.packing_list as string) ?? "",
    insuranceInfo: (row.insurance_info as string) ?? "",
    isLaunchDestination: Boolean(row.is_launch_destination),
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    ogImage: (row.og_image as string) ?? "",
  };
}

export async function getDestinations(): Promise<Destination[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[destinations] Supabase not configured, returning no destinations.");
    return [];
  }

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("is_launch_destination", { ascending: false });

  if (error || !data) {
    console.warn("[destinations] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getLaunchDestinations(): Promise<Destination[]> {
  const all = await getDestinations();
  return all.filter((d) => d.isLaunchDestination);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[destinations] Supabase not configured, returning no destination.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[destinations] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}

// Tours reference their destination by id (a UUID), not by slug; use this
// for that lookup rather than getDestinationBySlug.
export async function getDestinationById(id: string): Promise<Destination | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[destinations] Supabase not configured, returning no destination.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[destinations] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
