import type { Tour } from "@/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapPricingTierRow,
  mapHighlightRow,
  mapAddonRow,
  mapProductScalars,
  type ItineraryDay,
  type PricingTier,
  type ProductHighlight,
  type ProductAddon,
  type ProductScalars,
} from "@/lib/productShared";

export type { ItineraryDay };

export interface AdminTourDetail extends Tour, ProductScalars {
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  meetingPoint: string;
  pickupLocations: string[];
  pricingTiers: PricingTier[];
  highlights: ProductHighlight[];
  addons: ProductAddon[];
  activityIds: string[];
  experienceTypeIds: string[];
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
    ...mapProductScalars(row),
    pricingTiers: (row.tour_pricing_tiers ?? []).map(mapPricingTierRow),
    highlights: (row.tour_highlights ?? []).map(mapHighlightRow),
    addons: (row.tour_addons ?? []).map(mapAddonRow),
    activityIds: (row.tour_activities ?? []).map((a: any) => a.activity_id),
    experienceTypeIds: (row.tour_experience_types ?? []).map((e: any) => e.experience_type_id),
  };
}

const DETAIL_SELECT = `
  *,
  tour_pricing_tiers(*),
  tour_highlights(*),
  tour_addons(*),
  tour_activities(activity_id),
  tour_experience_types(experience_type_id)
`;

// Admin edit form needs fields (inclusions/exclusions/itinerary/logistics/
// pricing tiers/highlights/add-ons/activities) that the public Tour type doesn't carry.
export async function getAdminTourBySlug(slug: string): Promise<AdminTourDetail | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/tours] Supabase not configured, returning no tour.");
    return undefined;
  }

  const { data, error } = await supabase.from("tours").select(DETAIL_SELECT).eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/tours] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
