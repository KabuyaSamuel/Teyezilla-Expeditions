"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ReviewInput {
  authorName: string;
  source: "Google" | "TripAdvisor" | "GetYourGuide";
  rating: number;
  quote: string;
  tourId: string;
  isApproved: boolean;
}

function toRow(input: ReviewInput) {
  return {
    author_name: input.authorName,
    source: input.source,
    rating: input.rating,
    quote: input.quote,
    tour_id: input.tourId || null,
    is_approved: input.isApproved,
  };
}

export async function createReview(input: ReviewInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("reviews").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, input: ReviewInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("reviews").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function setReviewApproval(id: string, isApproved: boolean): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("reviews").update({ is_approved: isApproved }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
}

// Only one review can be featured at a time — unfeature the rest first so
// the homepage always has exactly one (or zero) highlighted testimonial.
export async function setFeaturedReview(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error: clearError } = await supabase
    .from("reviews")
    .update({ is_featured: false })
    .neq("id", id);
  if (clearError) throw new Error(clearError.message);

  const { error } = await supabase.from("reviews").update({ is_featured: true }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function unfeatureReview(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("reviews").update({ is_featured: false }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
