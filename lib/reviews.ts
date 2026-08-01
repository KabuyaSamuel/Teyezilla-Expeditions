import type { Review } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

function mapRow(row: Record<string, any>): Review {
  return {
    id: row.id,
    authorName: row.author_name,
    source: row.source,
    rating: Number(row.rating ?? 0),
    quote: row.quote ?? "",
    tourTitle: row.tour?.title,
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

  const { data, error } = await supabase
    .from("reviews")
    .select("id, author_name, source, rating, quote, tour:tours(title)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[reviews] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
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

  const { data, error } = await supabase
    .from("reviews")
    .select("id, author_name, source, rating, quote, tour:tours(title)")
    .eq("is_featured", true)
    .maybeSingle();

  if (error) {
    console.warn("[reviews] Supabase query failed:", error.message);
    return undefined;
  }
  if (data) return mapRow(data);

  const { data: fallback, error: fallbackError } = await supabase
    .from("reviews")
    .select("id, author_name, source, rating, quote, tour:tours(title)")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError || !fallback) return undefined;
  return mapRow(fallback);
}
