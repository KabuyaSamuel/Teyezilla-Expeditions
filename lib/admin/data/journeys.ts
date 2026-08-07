import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapPricingTierRow,
  mapHighlightRow,
  mapFaqRow,
  mapAddonRow,
  mapProductScalars,
  type ItineraryDay,
  type PricingTier,
  type ProductHighlight,
  type ProductFaq,
  type ProductAddon,
  type ProductScalars,
} from "@/lib/productShared";

export type { ItineraryDay };

export interface AdminJourneyListItem {
  id: string;
  slug: string;
  title: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  featured: boolean;
  status: string;
  primaryDestinationName: string;
}

export interface AdminJourneyDetail extends ProductScalars {
  id: string;
  slug: string;
  title: string;
  heroImage: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  difficulty: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  meetingPoint: string;
  pickupLocations: string[];
  featured: boolean;
  status: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  destinationIds: string[];
  primaryDestinationId: string;
  journeyTypeIds: string[];
  experienceTypeIds: string[];
  safariThemeIds: string[];
  pricingTiers: PricingTier[];
  highlights: ProductHighlight[];
  faqs: ProductFaq[];
  addons: ProductAddon[];
  activityIds: string[];
  vehicleIds: string[];
  accommodationIds: string[];
  tourIds: string[];
  relatedJourneyIds: string[];
  relatedTourIds: string[];
  relatedBlogPostIds: string[];
}

const LIST_SELECT = `
  id, slug, title, duration_days, price_from, currency, featured, status,
  journey_destinations(destination_id, is_primary, display_order, destinations(country_name))
`;

function mapListRow(row: any): AdminJourneyListItem {
  const dests = (row.journey_destinations ?? []) as any[];
  const primary =
    dests.find((d) => d.is_primary) ??
    [...dests].sort((a, b) => a.display_order - b.display_order)[0];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    durationDays: Number(row.duration_days ?? 0),
    priceFrom: Number(row.price_from ?? 0),
    currency: row.currency ?? "USD",
    featured: Boolean(row.featured),
    status: row.status ?? "draft",
    primaryDestinationName: primary?.destinations?.country_name ?? "-",
  };
}

// Uses the authenticated staff session (not the public client) because
// journeys' public-read RLS only exposes status='published' rows; the
// admin list needs drafts too, which the "Staff can manage journeys"
// policy grants via its unconditional using(true).
export async function getAdminJourneys(): Promise<AdminJourneyListItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/journeys] Supabase not configured, returning no journeys.");
    return [];
  }

  const { data, error } = await supabase
    .from("journeys")
    .select(LIST_SELECT)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[admin/journeys] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapListRow);
}

export interface AdminJourneysQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: "created_at" | "title" | "price_from";
  sortDir?: "asc" | "desc";
  destinationId?: string;
  featured?: boolean;
}

export async function getAdminJourneysPaginated(
  query: AdminJourneysQuery
): Promise<{ items: AdminJourneyListItem[]; total: number }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/journeys] Supabase not configured, returning no journeys.");
    return { items: [], total: 0 };
  }

  // Filtering by country requires an inner join on journey_destinations so
  // PostgREST only counts/returns journeys that actually have a leg in that
  // destination; without a country filter the plain left-join select (every
  // journey, with or without destinations) is used instead.
  const select = query.destinationId
    ? `id, slug, title, duration_days, price_from, currency, featured, status,
       journey_destinations!inner(destination_id, is_primary, display_order, destinations(country_name))`
    : LIST_SELECT;

  let q = supabase.from("journeys").select(select, { count: "exact" });
  if (query.search) q = q.ilike("title", `%${query.search}%`);
  if (query.destinationId) q = q.eq("journey_destinations.destination_id", query.destinationId);
  if (query.featured !== undefined) q = q.eq("featured", query.featured);
  q = q.order(query.sortBy ?? "created_at", { ascending: query.sortDir === "asc" });

  const from = (query.page - 1) * query.pageSize;
  const { data, error, count } = await q.range(from, from + query.pageSize - 1);

  if (error || !data) {
    console.warn("[admin/journeys] Supabase query failed:", error?.message);
    return { items: [], total: 0 };
  }

  return { items: data.map(mapListRow), total: count ?? 0 };
}

const DETAIL_SELECT = `
  *,
  journey_destinations(destination_id, is_primary, display_order),
  journey_journey_types(journey_type_id),
  journey_experience_types(experience_type_id),
  journey_safari_themes(safari_theme_id),
  journey_pricing_tiers(*),
  journey_highlights(*),
  journey_faqs(*),
  journey_addons(*),
  journey_activities(activity_id),
  journey_vehicles(vehicle_id),
  journey_accommodations(accommodation_id),
  journey_tours(tour_id),
  journey_related_journeys!journey_related_journeys_journey_id_fkey(related_journey_id, display_order),
  journey_related_tours(tour_id, display_order),
  journey_related_blog_posts(blog_post_id, display_order)
`;

export async function getAdminJourneyBySlug(slug: string): Promise<AdminJourneyDetail | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/journeys] Supabase not configured, returning no journey.");
    return undefined;
  }

  const { data, error } = await supabase.from("journeys").select(DETAIL_SELECT).eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/journeys] Supabase query failed:", error.message);
    return undefined;
  }

  const row = data as any;
  const destinations = [...(row.journey_destinations ?? [])].sort(
    (a: any, b: any) => a.display_order - b.display_order
  );
  const primary = destinations.find((d: any) => d.is_primary);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    heroImage: row.hero_image ?? "",
    tagline: row.tagline ?? "",
    shortDescription: row.short_description ?? "",
    overview: row.overview ?? "",
    durationDays: Number(row.duration_days ?? 0),
    priceFrom: Number(row.price_from ?? 0),
    currency: row.currency ?? "USD",
    difficulty: row.difficulty ?? "",
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    itinerary: row.itinerary ?? [],
    meetingPoint: row.meeting_point ?? "",
    pickupLocations: row.pickup_locations ?? [],
    featured: Boolean(row.featured),
    status: row.status ?? "draft",
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    ogImage: row.og_image ?? "",
    destinationIds: destinations.map((d: any) => d.destination_id),
    primaryDestinationId: primary?.destination_id ?? destinations[0]?.destination_id ?? "",
    journeyTypeIds: (row.journey_journey_types ?? []).map((j: any) => j.journey_type_id),
    experienceTypeIds: (row.journey_experience_types ?? []).map((j: any) => j.experience_type_id),
    safariThemeIds: (row.journey_safari_themes ?? []).map((j: any) => j.safari_theme_id),
    ...mapProductScalars(row),
    pricingTiers: (row.journey_pricing_tiers ?? []).map(mapPricingTierRow),
    highlights: (row.journey_highlights ?? []).map(mapHighlightRow),
    faqs: (row.journey_faqs ?? []).map(mapFaqRow),
    addons: (row.journey_addons ?? []).map(mapAddonRow),
    activityIds: (row.journey_activities ?? []).map((a: any) => a.activity_id),
    vehicleIds: (row.journey_vehicles ?? []).map((v: any) => v.vehicle_id),
    accommodationIds: (row.journey_accommodations ?? []).map((a: any) => a.accommodation_id),
    tourIds: (row.journey_tours ?? []).map((t: any) => t.tour_id),
    relatedJourneyIds: [...(row.journey_related_journeys ?? [])]
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((r: any) => r.related_journey_id),
    relatedTourIds: [...(row.journey_related_tours ?? [])]
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((r: any) => r.tour_id),
    relatedBlogPostIds: [...(row.journey_related_blog_posts ?? [])]
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((r: any) => r.blog_post_id),
  };
}
