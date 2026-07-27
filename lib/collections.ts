import type { Tour } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
}

export interface CollectionWithTours extends Collection {
  tours: Tour[];
}

function mapTourRow(row: Record<string, unknown>): Tour {
  return {
    id: row.id as string,
    slug: row.slug as string,
    destinationId: row.destination_id as string,
    title: row.title as string,
    categoryLabel: (row.category_label as string) ?? "",
    productType: (row.product_type as string) ?? "experience",
    heroImage: (row.hero_image as string) ?? "",
    shortDescription: (row.short_description as string) ?? "",
    durationDays: Number(row.duration_days ?? 0),
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

export async function getCollections(): Promise<Collection[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[collections] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, hero_image")
    .order("display_order");

  if (error || !data) {
    console.warn("[collections] Supabase query failed:", error?.message);
    return [];
  }

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    heroImage: c.hero_image ?? "",
  }));
}

export async function getCollectionBySlug(slug: string): Promise<CollectionWithTours | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[collections] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, hero_image, collection_tours(tours(*))")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[collections] Supabase query failed:", error.message);
    return undefined;
  }

  const row = data as any;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    heroImage: row.hero_image ?? "",
    tours: (row.collection_tours ?? []).map((ct: any) => ct.tours).filter(Boolean).map(mapTourRow),
  };
}
