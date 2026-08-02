import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

type AdminReviewRow = Pick<
  Tables<"reviews">,
  "id" | "author_name" | "source" | "rating" | "quote" | "tour_id" | "is_approved" | "is_featured"
> & { tour: Pick<Tables<"tours">, "title"> | null };

export interface AdminReview {
  id: string;
  authorName: string;
  source: "Google" | "TripAdvisor" | "GetYourGuide";
  rating: number;
  quote: string;
  tourId: string | null;
  tourTitle?: string;
  isApproved: boolean;
  isFeatured: boolean;
}

function mapRow(row: AdminReviewRow): AdminReview {
  return {
    id: row.id,
    authorName: row.author_name,
    source: row.source as AdminReview["source"],
    rating: Number(row.rating ?? 0),
    quote: row.quote ?? "",
    tourId: row.tour_id,
    tourTitle: row.tour?.title,
    isApproved: Boolean(row.is_approved),
    isFeatured: Boolean(row.is_featured),
  };
}

// Staff see every review regardless of approval status, per the
// "Staff can read all reviews" RLS policy (authenticated role only).
export async function getAllReviews(): Promise<AdminReview[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/reviews] Supabase not configured, returning no reviews.");
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, author_name, source, rating, quote, tour_id, is_approved, is_featured, tour:tours(title)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[admin/reviews] Supabase query failed:", error?.message);
    return [];
  }

  // supabase-js can't tell tour_id is a to-one FK without a Database-
  // parameterized client (deliberately not used here, see
  // lib/supabase/server.ts), so it infers the embedded `tour` relation as
  // an array regardless -- cast to the real single-object runtime shape,
  // same pattern used in app/(public)/booking/confirmation/[reference]/page.tsx.
  return (data as unknown as AdminReviewRow[]).map(mapRow);
}

export async function getReviewById(id: string): Promise<AdminReview | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/reviews] Supabase not configured, returning no review.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, author_name, source, rating, quote, tour_id, is_approved, is_featured, tour:tours(title)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/reviews] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data as unknown as AdminReviewRow);
}
