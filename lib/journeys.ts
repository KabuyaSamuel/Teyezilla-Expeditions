import { getSupabasePublicClient } from "@/lib/supabase/public";

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

export async function getJourneyBySlug(slug: string): Promise<Journey | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[journeys] Supabase not configured, returning no journey.");
    return undefined;
  }

  const { data, error } = await supabase.from("journeys").select(SELECT).eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[journeys] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
