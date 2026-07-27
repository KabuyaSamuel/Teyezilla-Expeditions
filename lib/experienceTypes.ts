import type { Tour } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface ExperienceType {
  id: string;
  name: string;
  slug: string;
}

export async function getExperienceTypes(): Promise<ExperienceType[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[experience-types] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("experience_types")
    .select("id, name, slug")
    .order("display_order");

  if (error || !data) {
    console.warn("[experience-types] Supabase query failed:", error?.message);
    return [];
  }

  return data;
}

function mapTourRow(row: Record<string, unknown>): Tour {
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

export async function getExperienceTypeBySlug(slug: string): Promise<ExperienceType | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("experience_types")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return undefined;
  return data;
}

export async function getToursByExperienceType(slug: string): Promise<Tour[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[experience-types] Supabase not configured, returning no tours.");
    return [];
  }

  const { data, error } = await supabase
    .from("tour_experience_types")
    .select("tours!inner(*), experience_types!inner(slug)")
    .eq("experience_types.slug", slug)
    .eq("tours.status", "published");

  if (error || !data) {
    console.warn("[experience-types] Supabase query failed:", error?.message);
    return [];
  }

  return data.map((row: any) => row.tours).filter(Boolean).map(mapTourRow);
}
