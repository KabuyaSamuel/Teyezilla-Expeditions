import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface Region {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface RegionWithDestinations extends Region {
  destinations: { id: string; countryName: string; slug: string; flagEmoji: string; isLaunchDestination: boolean }[];
}

export async function getRegions(): Promise<Region[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[regions] Supabase not configured, returning no regions.");
    return [];
  }

  const { data, error } = await supabase
    .from("regions")
    .select("id, name, slug, description")
    .order("display_order");

  if (error || !data) {
    console.warn("[regions] Supabase query failed:", error?.message);
    return [];
  }

  return data;
}

// Regions with their destinations nested, for the Destinations mega-menu
// and any "browse by region" listing page.
export async function getRegionsWithDestinations(): Promise<RegionWithDestinations[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[regions] Supabase not configured, returning no regions.");
    return [];
  }

  const { data, error } = await supabase
    .from("regions")
    .select(
      "id, name, slug, description, destination_regions(destinations(id, country_name, slug, flag_emoji, is_launch_destination))"
    )
    .order("display_order");

  if (error || !data) {
    console.warn("[regions] Supabase query failed:", error?.message);
    return [];
  }

  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? "",
    destinations: (r.destination_regions ?? [])
      .map((dr: any) => dr.destinations)
      .filter(Boolean)
      .map((d: any) => ({
        id: d.id,
        countryName: d.country_name,
        slug: d.slug,
        flagEmoji: d.flag_emoji ?? "",
        isLaunchDestination: Boolean(d.is_launch_destination),
      }))
      .sort((a: any, b: any) => Number(b.isLaunchDestination) - Number(a.isLaunchDestination)),
  }));
}
