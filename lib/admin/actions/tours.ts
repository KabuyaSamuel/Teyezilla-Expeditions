"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import {
  syncPricingTiers,
  syncHighlights,
  syncFaqs,
  syncAddons,
  syncActivities,
  syncExperienceTypes,
  syncVehicles,
  syncAccommodations,
  productScalarsToRow,
  type PricingTierInput,
  type HighlightInput,
  type FaqInput,
  type AddonInput,
  type ProductScalarsInput,
} from "./productShared";

export interface TourInput extends ProductScalarsInput {
  title: string;
  slug: string;
  destinationId: string;
  difficulty: string;
  durationDays: number;
  durationHours: number | null;
  heroImage: string;
  priceFrom: number;
  currency: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
  meetingPoint: string;
  pickupLocations: string[];
  featured: boolean;
  status: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  pricingTiers: PricingTierInput[];
  highlights: HighlightInput[];
  faqs: FaqInput[];
  addons: AddonInput[];
  activityIds: string[];
  experienceTypeIds: string[];
  vehicleIds: string[];
  accommodationIds: string[];
  relatedJourneyIds: string[];
  relatedTourIds: string[];
  relatedBlogPostIds: string[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: TourInput) {
  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    destination_id: input.destinationId,
    // The DB column has a check constraint allowing only Easy/Moderate/
    // Challenging or NULL -- "" (unset in the form) isn't a valid value.
    difficulty: input.difficulty || null,
    duration_days: input.durationDays,
    duration_hours: input.durationHours,
    hero_image: input.heroImage,
    price_from: input.priceFrom,
    currency: input.currency,
    tagline: input.tagline || null,
    // Hard-capped client-side via the textarea's maxLength; sliced again
    // here in case something bypasses that (a direct API call, for example).
    short_description: input.shortDescription.slice(0, 250),
    overview: input.overview,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    itinerary: input.itinerary,
    meeting_point: input.meetingPoint,
    pickup_locations: input.pickupLocations,
    featured: input.featured,
    status: input.status,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
    og_image: input.ogImage,
    ...productScalarsToRow(input),
  };
}

async function syncTourRelations(supabase: any, tourId: string, input: TourInput) {
  await syncPricingTiers(supabase, "tour_pricing_tiers", "tour_id", tourId, input.pricingTiers);
  await syncHighlights(supabase, "tour_highlights", "tour_id", tourId, input.highlights);
  await syncFaqs(supabase, "tour_faqs", "tour_id", tourId, input.faqs);
  await syncAddons(supabase, "tour_addons", "tour_id", tourId, input.addons);
  await syncActivities(supabase, "tour_activities", "tour_id", tourId, input.activityIds);
  await syncExperienceTypes(supabase, "tour_experience_types", "tour_id", tourId, input.experienceTypeIds);
  await syncVehicles(supabase, "tour_vehicles", "tour_id", tourId, input.vehicleIds);
  await syncAccommodations(supabase, "tour_accommodations", "tour_id", tourId, input.accommodationIds);

  await supabase.from("tour_related_journeys").delete().eq("tour_id", tourId);
  if (input.relatedJourneyIds.length > 0) {
    const { error } = await supabase.from("tour_related_journeys").insert(
      input.relatedJourneyIds.map((relatedJourneyId, index) => ({
        tour_id: tourId,
        related_journey_id: relatedJourneyId,
        display_order: index,
      }))
    );
    if (error) throw new Error(error.message);
  }

  await supabase.from("tour_related_tours").delete().eq("tour_id", tourId);
  if (input.relatedTourIds.length > 0) {
    const { error } = await supabase.from("tour_related_tours").insert(
      input.relatedTourIds.map((relatedTourId, index) => ({
        tour_id: tourId,
        related_tour_id: relatedTourId,
        display_order: index,
      }))
    );
    if (error) throw new Error(error.message);
  }

  await supabase.from("tour_related_blog_posts").delete().eq("tour_id", tourId);
  if (input.relatedBlogPostIds.length > 0) {
    const { error } = await supabase.from("tour_related_blog_posts").insert(
      input.relatedBlogPostIds.map((blogPostId, index) => ({
        tour_id: tourId,
        blog_post_id: blogPostId,
        display_order: index,
      }))
    );
    if (error) throw new Error(error.message);
  }
}

export async function createTour(input: TourInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data, error } = await supabase.from("tours").insert(toRow(input)).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create tour.");

  await syncTourRelations(supabase, data.id, input);

  revalidatePath("/admin/tours");
  revalidatePublicSite();
  redirect("/admin/tours");
}

export async function updateTour(id: string, input: TourInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tours").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  await syncTourRelations(supabase, id, input);

  revalidatePath("/admin/tours");
  revalidatePublicSite();
  redirect("/admin/tours");
}

export async function deleteTour(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/tours");
  revalidatePublicSite();
  redirect("/admin/tours");
}
