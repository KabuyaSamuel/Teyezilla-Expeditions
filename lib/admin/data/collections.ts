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

  return data.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    status: row.status ?? "draft",
    tourCount: (row.collection_tours ?? []).length,
    journeyCount: (row.collection_journeys ?? []).length,
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

  const row = data as any;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    heroImage: row.hero_image ?? "",
    status: row.status ?? "draft",
    tourIds: (row.collection_tours ?? []).map((c: any) => c.tour_id),
    journeyIds: (row.collection_journeys ?? []).map((c: any) => c.journey_id),
  };
}
