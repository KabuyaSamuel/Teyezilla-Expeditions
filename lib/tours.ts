import type { Tour } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

function mapRow(row: Record<string, unknown>): Tour {
  return {
    id: row.id as string,
    slug: row.slug as string,
    destinationId: row.destination_id as string,
    title: row.title as string,
    categoryLabel: (row.category_label as string) ?? "",
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

export async function getFeaturedTours(): Promise<Tour[]> {
  const all = await getTours();
  return all.filter((t) => t.featured && t.status === "published");
}

export async function getTourBySlug(slug: string): Promise<Tour | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[tours] Supabase not configured, returning no tour.");
    return undefined;
  }

  const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[tours] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}

export async function getToursByDestination(destinationId: string): Promise<Tour[]> {
  const all = await getTours();
  return all.filter((t) => t.destinationId === destinationId);
}
