import type { Review } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

const SELECT = "id, author_name, source, rating, quote, tour:tours(title), journey:journeys(title)";

function mapRow(row: Record<string, unknown>): Review {
  const tour = row.tour as { title: string } | null;
  const journey = row.journey as { title: string } | null;
  return {
    id: row.id as string,
    authorName: row.author_name as string,
    source: row.source as Review["source"],
    rating: Number(row.rating ?? 0),
    quote: (row.quote as string) ?? "",
    tourTitle: tour?.title,
    journeyTitle: journey?.title,
  };
}

// RLS restricts the anon role to is_approved = true rows already, so no
// explicit filter is needed here; see supabase/migrations/*_add_rls_policies.sql.
export async function getApprovedReviews(): Promise<Review[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[reviews] Supabase not configured, returning no reviews.");
    return [];
  }

  const { data, error } = await supabase.from("reviews").select(SELECT).order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[reviews] Supabase query failed:", error?.message);
    return [];
  }

  return (data as unknown as Record<string, unknown>[]).map(mapRow);
}

// Used to attach an AggregateRating to a tour's TouristTrip JSON-LD (see
// app/(public)/tours/[slug]/page.tsx) so star ratings can show up in search
// results for that specific tour, not just the sitewide /reviews page.
export async function getApprovedReviewsByTourId(tourId: string): Promise<Review[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("reviews").select(SELECT).eq("tour_id", tourId);

  if (error || !data) {
    console.warn("[reviews] Supabase query failed:", error?.message);
    return [];
  }

  return (data as unknown as Record<string, unknown>[]).map(mapRow);
}

// Same as getApprovedReviewsByTourId, for a journey's TouristTrip JSON-LD
// (see app/(public)/journeys/[slug]/page.tsx).
export async function getApprovedReviewsByJourneyId(journeyId: string): Promise<Review[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("reviews").select(SELECT).eq("journey_id", journeyId);

  if (error || !data) {
    console.warn("[reviews] Supabase query failed:", error?.message);
    return [];
  }

  return (data as unknown as Record<string, unknown>[]).map(mapRow);
}

// The single review an admin has chosen to highlight on the homepage (see
// components/WhyChoose.tsx). Falls back to the newest approved review if
// none is marked featured yet, so the section never renders empty.
export async function getFeaturedReview(): Promise<Review | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[reviews] Supabase not configured, returning no featured review.");
    return undefined;
  }

  const { data, error } = await supabase.from("reviews").select(SELECT).eq("is_featured", true).maybeSingle();

  if (error) {
    console.warn("[reviews] Supabase query failed:", error.message);
    return undefined;
  }
  if (data) return mapRow(data as unknown as Record<string, unknown>);

  const { data: fallback, error: fallbackError } = await supabase
    .from("reviews")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError || !fallback) return undefined;
  return mapRow(fallback as unknown as Record<string, unknown>);
}
