import type { Tour } from "@/types";
import type { Activity } from "@/lib/activities";
import { getSupabasePublicClient } from "@/lib/supabase/public";
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

export type { ItineraryDay, PricingTier, ProductHighlight, ProductAddon };

export interface TourDetail extends Tour, ProductScalars {
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  meetingPoint: string;
  pickupLocations: string[];
  pricingTiers: PricingTier[];
  highlights: ProductHighlight[];
  addons: ProductAddon[];
  activities: Activity[];
  featuredInJourneys: { slug: string; title: string }[];
}

function mapRow(row: Record<string, unknown>): Tour {
  return {
    id: row.id as string,
    slug: row.slug as string,
    destinationId: row.destination_id as string,
    title: row.title as string,
    categoryLabel: (row.category_label as string) ?? "",
    productType: (row.product_type as Tour["productType"]) ?? "experience",
    heroImage: (row.hero_image as string) ?? "",
    shortDescription: (row.short_description as string) ?? "",
    durationDays: Number(row.duration_days ?? 0),
    durationHours: row.duration_hours != null ? Number(row.duration_hours) : null,
    priceFrom: Number(row.price_from ?? 0),
    currency: (row.currency as string) ?? "USD",
    difficulty: (row.difficulty as Tour["difficulty"]) ?? "Easy",
    featured: Boolean(row.featured),
    status: (row.status as Tour["status"]) ?? "draft",
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    ogImage: (row.og_image as string) ?? "",
  };
}

export async function getTours(): Promise<Tour[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[tours] Supabase not configured, returning no tours.");
    return [];
  }

  const { data, error } = await supabase.from("tours").select("*");

  if (error || !data) {
    console.warn("[tours] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

// getTours() is also the admin tours list's data source, which needs to see
// drafts, so the published filter lives here as an opt-in wrapper for
// public-facing pages instead of inside getTours() itself.
export async function getPublishedTours(): Promise<Tour[]> {
  const all = await getTours();
  return all.filter((t) => t.status === "published");
}

export async function getFeaturedTours(): Promise<Tour[]> {
  const all = await getTours();
  return all.filter((t) => t.featured && t.status === "published");
}

export async function getFeaturedSafaris(): Promise<Tour[]> {
  const all = await getTours();
  return all.filter((t) => t.featured && t.status === "published" && t.productType === "safari");
}

const DETAIL_SELECT = `
  *,
  tour_pricing_tiers(*),
  tour_highlights(*),
  tour_addons(*),
  tour_activities(activities(id, name, slug, description, icon)),
  journey_tours(journeys(slug, title))
`;

export async function getTourBySlug(slug: string): Promise<TourDetail | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[tours] Supabase not configured, returning no tour.");
    return undefined;
  }

  const { data, error } = await supabase.from("tours").select(DETAIL_SELECT).eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[tours] Supabase query failed:", error.message);
    return undefined;
  }

  const row = data as any;
  return {
    ...mapRow(row),
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    itinerary: row.itinerary ?? [],
    meetingPoint: row.meeting_point ?? "",
    pickupLocations: row.pickup_locations ?? [],
    ...mapProductScalars(row),
    pricingTiers: (row.tour_pricing_tiers ?? [])
      .map(mapPricingTierRow)
      .sort((a: PricingTier, b: PricingTier) => a.displayOrder - b.displayOrder),
    highlights: (row.tour_highlights ?? [])
      .map(mapHighlightRow)
      .sort((a: ProductHighlight, b: ProductHighlight) => a.displayOrder - b.displayOrder),
    addons: (row.tour_addons ?? [])
      .map(mapAddonRow)
      .sort((a: ProductAddon, b: ProductAddon) => a.displayOrder - b.displayOrder),
    activities: (row.tour_activities ?? [])
      .map((a: any) => a.activities)
      .filter(Boolean)
      .map((a: any) => ({ id: a.id, name: a.name, slug: a.slug, description: a.description ?? "", icon: a.icon ?? "" })),
    featuredInJourneys: (row.journey_tours ?? [])
      .map((jt: any) => jt.journeys)
      .filter(Boolean)
      .map((j: any) => ({ slug: j.slug, title: j.title })),
  };
}

export async function getToursByDestination(destinationId: string): Promise<Tour[]> {
  const all = await getPublishedTours();
  return all.filter((t) => t.destinationId === destinationId);
}

// Powers "related tours" sections on journey/destination/blog pages.
export async function getRelatedTours(
  destinationId: string,
  excludeSlug?: string,
  limit = 3
): Promise<Tour[]> {
  const all = await getToursByDestination(destinationId);
  return all.filter((t) => t.slug !== excludeSlug).slice(0, limit);
}
