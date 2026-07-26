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

export interface JourneyType {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Journey {
  id: string;
  slug: string;
  title: string;
  heroImage: string;
  shortDescription: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  featured: boolean;
  destinations: { countryName: string; slug: string }[];
  journeyTypes: string[];
}

export interface JourneyDetail extends Journey, ProductScalars {
  overview: string;
  difficulty: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  meetingPoint: string;
  pickupLocations: string[];
  status: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  pricingTiers: PricingTier[];
  highlights: ProductHighlight[];
  addons: ProductAddon[];
  activities: Activity[];
}

function mapRow(row: Record<string, any>): Journey {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    heroImage: row.hero_image ?? "",
    shortDescription: row.short_description ?? "",
    durationDays: Number(row.duration_days ?? 0),
    priceFrom: Number(row.price_from ?? 0),
    currency: row.currency ?? "USD",
    featured: Boolean(row.featured),
    destinations: (row.journey_destinations ?? [])
      .map((jd: any) => jd.destinations)
      .filter(Boolean)
      .map((d: any) => ({ countryName: d.country_name, slug: d.slug })),
    journeyTypes: (row.journey_journey_types ?? [])
      .map((jjt: any) => jjt.journey_types?.name)
      .filter(Boolean),
  };
}

const SELECT = `
  id, slug, title, hero_image, short_description, duration_days, price_from, currency, featured,
  journey_destinations(destinations(country_name, slug)),
  journey_journey_types(journey_types(name))
`;

export async function getJourneyTypes(): Promise<JourneyType[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[journeys] Supabase not configured, returning no journey types.");
    return [];
  }

  const { data, error } = await supabase.from("journey_types").select("id, name, slug, description");

  if (error || !data) {
    console.warn("[journeys] Supabase query failed:", error?.message);
    return [];
  }

  return data;
}

export async function getJourneys(): Promise<Journey[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[journeys] Supabase not configured, returning no journeys.");
    return [];
  }

  const { data, error } = await supabase.from("journeys").select(SELECT);

  if (error || !data) {
    console.warn("[journeys] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

const DETAIL_SELECT = `
  *,
  journey_destinations(destinations(country_name, slug)),
  journey_journey_types(journey_types(name)),
  journey_pricing_tiers(*),
  journey_highlights(*),
  journey_addons(*),
  journey_activities(activities(id, name, slug, description, icon))
`;

export async function getJourneyBySlug(slug: string): Promise<JourneyDetail | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[journeys] Supabase not configured, returning no journey.");
    return undefined;
  }

  const { data, error } = await supabase.from("journeys").select(DETAIL_SELECT).eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[journeys] Supabase query failed:", error.message);
    return undefined;
  }

  const row = data as any;
  return {
    ...mapRow(row),
    overview: row.overview ?? "",
    difficulty: row.difficulty ?? "Easy",
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    itinerary: row.itinerary ?? [],
    meetingPoint: row.meeting_point ?? "",
    pickupLocations: row.pickup_locations ?? [],
    status: row.status ?? "draft",
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    ogImage: row.og_image ?? "",
    ...mapProductScalars(row),
    pricingTiers: (row.journey_pricing_tiers ?? [])
      .map(mapPricingTierRow)
      .sort((a: PricingTier, b: PricingTier) => a.displayOrder - b.displayOrder),
    highlights: (row.journey_highlights ?? [])
      .map(mapHighlightRow)
      .sort((a: ProductHighlight, b: ProductHighlight) => a.displayOrder - b.displayOrder),
    addons: (row.journey_addons ?? [])
      .map(mapAddonRow)
      .sort((a: ProductAddon, b: ProductAddon) => a.displayOrder - b.displayOrder),
    activities: (row.journey_activities ?? [])
      .map((a: any) => a.activities)
      .filter(Boolean)
      .map((a: any) => ({ id: a.id, name: a.name, slug: a.slug, description: a.description ?? "", icon: a.icon ?? "" })),
  };
}
