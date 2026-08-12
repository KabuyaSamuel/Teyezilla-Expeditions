import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminCollectionListItem {
  id: string;
  slug: string;
  name: string;
  status: string;
  tourCount: number;
  journeyCount: number;
}

export interface AdminCollectionDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  status: string;
  tourIds: string[];
  journeyIds: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

const LIST_SELECT = `
  id, slug, name, status,
  collection_tours(tour_id),
  collection_journeys(journey_id)
`;

// Staff session, not the public client; collections' public-read RLS only
// exposes status='published' rows, and the admin list needs drafts too.
export async function getAdminCollections(): Promise<AdminCollectionListItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/collections] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("collections")
    .select(LIST_SELECT)
    .order("display_order");

  if (error || !data) {
    console.warn("[admin/collections] Supabase query failed:", error?.message);
    return [];
  }

  return (data as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    status: (row.status as string) ?? "draft",
    tourCount: ((row.collection_tours as unknown[]) ?? []).length,
    journeyCount: ((row.collection_journeys as unknown[]) ?? []).length,
  }));
}

const DETAIL_SELECT = `
  *,
  collection_tours(tour_id),
  collection_journeys(journey_id)
`;

export async function getAdminCollectionBySlug(slug: string): Promise<AdminCollectionDetail | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/collections] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase.from("collections").select(DETAIL_SELECT).eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/collections] Supabase query failed:", error.message);
    return undefined;
  }

  const row = data as Record<string, unknown>;
  const collectionTours = (row.collection_tours as { tour_id: string }[] | null) ?? [];
  const collectionJourneys = (row.collection_journeys as { journey_id: string }[] | null) ?? [];
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    heroImage: (row.hero_image as string) ?? "",
    status: (row.status as string) ?? "draft",
    tourIds: collectionTours.map((c) => c.tour_id),
    journeyIds: collectionJourneys.map((c) => c.journey_id),
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    ogImage: (row.og_image as string) ?? "",
  };
}
