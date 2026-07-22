import type { Tour } from "@/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface AdminTourDetail extends Tour {
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  meetingPoint: string;
  pickupLocations: string[];
}

function mapRow(row: Record<string, any>): AdminTourDetail {
  return {
    id: row.id,
    slug: row.slug,
    destinationId: row.destination_id,
    title: row.title,
    categoryLabel: row.category_label ?? "",
    heroImage: row.hero_image ?? "",
    shortDescription: row.short_description ?? "",
    durationDays: Number(row.duration_days ?? 0),
    priceFrom: Number(row.price_from ?? 0),
    currency: row.currency ?? "USD",
    difficulty: row.difficulty ?? "Easy",
    featured: Boolean(row.featured),
    status: row.status ?? "draft",
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    ogImage: row.og_image ?? "",
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    itinerary: row.itinerary ?? [],
    meetingPoint: row.meeting_point ?? "",
    pickupLocations: row.pickup_locations ?? [],
  };
}

// Admin edit form needs fields (inclusions/exclusions/itinerary/logistics)
// that the public Tour type doesn't carry.
export async function getAdminTourBySlug(slug: string): Promise<AdminTourDetail | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/tours] Supabase not configured, returning no tour.");
    return undefined;
  }

  const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/tours] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
