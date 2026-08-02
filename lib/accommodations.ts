import { getSupabasePublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

export interface Accommodation {
  id: string;
  destinationId: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  tier: "Budget" | "Mid-Range" | "Luxury" | "";
}

function mapRow(row: Tables<"accommodations">): Accommodation {
  return {
    id: row.id,
    destinationId: row.destination_id,
    name: row.name,
    slug: row.slug ?? "",
    description: row.description ?? "",
    heroImage: row.hero_image ?? "",
    tier: (row.tier ?? "") as Accommodation["tier"],
  };
}

export async function getAccommodations(): Promise<Accommodation[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[accommodations] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("accommodations")
    .select("*")
    .eq("status", "published")
    .order("display_order");

  if (error || !data) {
    console.warn("[accommodations] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAccommodationsByDestination(destinationId: string): Promise<Accommodation[]> {
  const all = await getAccommodations();
  return all.filter((a) => a.destinationId === destinationId);
}
