import type { Tour } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { seedTours } from "@/lib/tours.seed";

// Real data layer for tours. Same Supabase-first, seed-fallback pattern as
// lib/destinations.ts — see the comment there for the reasoning.

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
  if (!supabase) return seedTours;

  const { data, error } = await supabase.from("tours").select("*");

  if (error || !data) {
    console.warn("[tours] Supabase query failed, using seed data:", error?.message);
    return seedTours;
  }

  return data.map(mapRow);
}

export async function getFeaturedTours(): Promise<Tour[]> {
  const all = await getTours();
  return all.filter((t) => t.featured && t.status === "published");
}

export async function getTourBySlug(slug: string): Promise<Tour | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return seedTours.find((t) => t.slug === slug);

  const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[tours] Supabase query failed, using seed data:", error.message);
    return seedTours.find((t) => t.slug === slug);
  }

  return mapRow(data);
}

export async function getToursByDestination(destinationId: string): Promise<Tour[]> {
  const all = await getTours();
  return all.filter((t) => t.destinationId === destinationId);
}
