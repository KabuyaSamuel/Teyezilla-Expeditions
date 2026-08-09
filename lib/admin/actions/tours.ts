"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import { redirectWithSaved } from "./saved-redirect";
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

// Replaces a tour's rows in a related-content join table wholesale: clear,
// then re-insert whatever's currently selected, in the order given.
async function syncRelatedTable(
  supabase: any,
  table: string,
  tourId: string,
  relatedIds: string[],
  relatedColumn: string
) {
  const { error: deleteError } = await supabase.from(table).delete().eq("tour_id", tourId);
  if (deleteError) throw new Error(deleteError.message);
  if (relatedIds.length === 0) return;

  const { error } = await supabase.from(table).insert(
    relatedIds.map((relatedId, index) => ({
      tour_id: tourId,
      [relatedColumn]: relatedId,
      display_order: index,
    }))
  );
  if (error) throw new Error(error.message);
}

// Every one of these only depends on the already-known tourId, not on each
// other's results, so they run as one batch of parallel round trips instead
// of ~11 sequential ones -- this was the single biggest contributor to a
// tour save feeling slow.
async function syncTourRelations(supabase: any, tourId: string, input: TourInput) {
  await Promise.all([
    syncPricingTiers(supabase, "tour_pricing_tiers", "tour_id", tourId, input.pricingTiers),
    syncHighlights(supabase, "tour_highlights", "tour_id", tourId, input.highlights),
    syncFaqs(supabase, "tour_faqs", "tour_id", tourId, input.faqs),
    syncAddons(supabase, "tour_addons", "tour_id", tourId, input.addons),
    syncActivities(supabase, "tour_activities", "tour_id", tourId, input.activityIds),
    syncExperienceTypes(supabase, "tour_experience_types", "tour_id", tourId, input.experienceTypeIds),
    syncVehicles(supabase, "tour_vehicles", "tour_id", tourId, input.vehicleIds),
    syncAccommodations(supabase, "tour_accommodations", "tour_id", tourId, input.accommodationIds),
    syncRelatedTable(supabase, "tour_related_journeys", tourId, input.relatedJourneyIds, "related_journey_id"),
    syncRelatedTable(supabase, "tour_related_tours", tourId, input.relatedTourIds, "related_tour_id"),
    syncRelatedTable(supabase, "tour_related_blog_posts", tourId, input.relatedBlogPostIds, "blog_post_id"),
  ]);
}

export async function createTour(input: TourInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data, error } = await supabase.from("tours").insert(toRow(input)).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create tour.");

  await syncTourRelations(supabase, data.id, input);

  revalidatePath("/admin/tours");
  revalidatePublicSite();
  redirectWithSaved("/admin/tours", `"${input.title}" created.`);
}

export async function updateTour(id: string, input: TourInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tours").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  await syncTourRelations(supabase, id, input);

  revalidatePath("/admin/tours");
  revalidatePublicSite();
  redirectWithSaved("/admin/tours", `"${input.title}" saved.`);
}

export async function deleteTour(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/tours");
  revalidatePublicSite();
  redirectWithSaved("/admin/tours", "Tour deleted.");
}
