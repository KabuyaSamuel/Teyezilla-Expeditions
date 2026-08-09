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
  syncVehicles,
  syncAccommodations,
  productScalarsToRow,
  type PricingTierInput,
  type HighlightInput,
  type FaqInput,
  type AddonInput,
  type ProductScalarsInput,
} from "./productShared";

export interface JourneyInput extends ProductScalarsInput {
  title: string;
  slug: string;
  heroImage: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  difficulty: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
  meetingPoint: string;
  pickupLocations: string[];
  destinationIds: string[];
  primaryDestinationId: string;
  journeyTypeIds: string[];
  experienceTypeIds: string[];
  safariThemeIds: string[];
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
  vehicleIds: string[];
  accommodationIds: string[];
  tourIds: string[];
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

function toRow(input: JourneyInput) {
  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    hero_image: input.heroImage,
    tagline: input.tagline || null,
    // Hard-capped client-side via the textarea's maxLength; sliced again
    // here in case something bypasses that (a direct API call, for example).
    short_description: input.shortDescription.slice(0, 250),
    overview: input.overview,
    duration_days: input.durationDays,
    price_from: input.priceFrom,
    currency: input.currency,
    // The DB column has a check constraint allowing only Easy/Moderate/
    // Challenging or NULL -- "" (unset in the form) isn't a valid value.
    difficulty: input.difficulty || null,
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

// Replaces a journey's rows in a related-content join table wholesale:
// clear, then re-insert whatever's currently selected, in the order given.
async function syncJourneyRelatedTable(
  supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseServerClient>>>,
  table: string,
  journeyId: string,
  relatedIds: string[],
  relatedColumn: string
) {
  const { error: deleteError } = await supabase.from(table).delete().eq("journey_id", journeyId);
  if (deleteError) throw new Error(deleteError.message);
  if (relatedIds.length === 0) return;

  const { error } = await supabase.from(table).insert(
    relatedIds.map((relatedId, index) => ({
      journey_id: journeyId,
      [relatedColumn]: relatedId,
      display_order: index,
    }))
  );
  if (error) throw new Error(error.message);
}

// Many-to-many editing pattern: wipe this journey's rows in each join table
// and re-insert from the form's current selection. Simpler and just as safe
// as diffing, since these join tables carry no data beyond the relationship
// itself (display_order/is_primary are derived fresh from form state each
// save). Every one of these only depends on the already-known journeyId,
// not on each other's results, so they run as one batch of parallel round
// trips instead of ~15 sequential ones.
async function syncJourneyRelations(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  journeyId: string,
  input: JourneyInput
) {
  if (!supabase) return;

  await Promise.all([
    (async () => {
      const { error: deleteError } = await supabase.from("journey_destinations").delete().eq("journey_id", journeyId);
      if (deleteError) throw new Error(deleteError.message);
      if (input.destinationIds.length === 0) return;

      const primaryId = input.destinationIds.includes(input.primaryDestinationId)
        ? input.primaryDestinationId
        : input.destinationIds[0];
      const { error } = await supabase.from("journey_destinations").insert(
        input.destinationIds.map((destinationId, index) => ({
          journey_id: journeyId,
          destination_id: destinationId,
          display_order: index,
          is_primary: destinationId === primaryId,
        }))
      );
      if (error) throw new Error(error.message);
    })(),

    (async () => {
      const { error: deleteError } = await supabase.from("journey_journey_types").delete().eq("journey_id", journeyId);
      if (deleteError) throw new Error(deleteError.message);
      if (input.journeyTypeIds.length === 0) return;

      const { error } = await supabase
        .from("journey_journey_types")
        .insert(input.journeyTypeIds.map((journeyTypeId) => ({ journey_id: journeyId, journey_type_id: journeyTypeId })));
      if (error) throw new Error(error.message);
    })(),

    (async () => {
      const { error: deleteError } = await supabase.from("journey_experience_types").delete().eq("journey_id", journeyId);
      if (deleteError) throw new Error(deleteError.message);
      if (input.experienceTypeIds.length === 0) return;

      const { error } = await supabase.from("journey_experience_types").insert(
        input.experienceTypeIds.map((experienceTypeId) => ({
          journey_id: journeyId,
          experience_type_id: experienceTypeId,
        }))
      );
      if (error) throw new Error(error.message);
    })(),

    (async () => {
      const { error: deleteError } = await supabase.from("journey_safari_themes").delete().eq("journey_id", journeyId);
      if (deleteError) throw new Error(deleteError.message);
      if (input.safariThemeIds.length === 0) return;

      const { error } = await supabase.from("journey_safari_themes").insert(
        input.safariThemeIds.map((safariThemeId) => ({ journey_id: journeyId, safari_theme_id: safariThemeId }))
      );
      if (error) throw new Error(error.message);
    })(),

    syncPricingTiers(supabase, "journey_pricing_tiers", "journey_id", journeyId, input.pricingTiers),
    syncHighlights(supabase, "journey_highlights", "journey_id", journeyId, input.highlights),
    syncFaqs(supabase, "journey_faqs", "journey_id", journeyId, input.faqs),
    syncAddons(supabase, "journey_addons", "journey_id", journeyId, input.addons),
    syncActivities(supabase, "journey_activities", "journey_id", journeyId, input.activityIds),
    syncVehicles(supabase, "journey_vehicles", "journey_id", journeyId, input.vehicleIds),
    syncAccommodations(supabase, "journey_accommodations", "journey_id", journeyId, input.accommodationIds),

    (async () => {
      const { error: deleteError } = await supabase.from("journey_tours").delete().eq("journey_id", journeyId);
      if (deleteError) throw new Error(deleteError.message);
      if (input.tourIds.length === 0) return;

      const { error } = await supabase.from("journey_tours").insert(
        input.tourIds.map((tourId, index) => ({ journey_id: journeyId, tour_id: tourId, display_order: index }))
      );
      if (error) throw new Error(error.message);
    })(),

    syncJourneyRelatedTable(supabase, "journey_related_journeys", journeyId, input.relatedJourneyIds, "related_journey_id"),
    syncJourneyRelatedTable(supabase, "journey_related_tours", journeyId, input.relatedTourIds, "tour_id"),
    syncJourneyRelatedTable(supabase, "journey_related_blog_posts", journeyId, input.relatedBlogPostIds, "blog_post_id"),
  ]);
}

export async function createJourney(input: JourneyInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data, error } = await supabase.from("journeys").insert(toRow(input)).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create journey.");

  await syncJourneyRelations(supabase, data.id, input);

  revalidatePath("/admin/journeys");
  revalidatePath("/journeys");
  revalidatePublicSite();
  redirectWithSaved("/admin/journeys", `"${input.title}" created.`);
}

export async function updateJourney(id: string, input: JourneyInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("journeys").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  await syncJourneyRelations(supabase, id, input);

  revalidatePath("/admin/journeys");
  revalidatePath("/journeys");
  revalidatePublicSite();
  redirectWithSaved("/admin/journeys", `"${input.title}" saved.`);
}

export async function deleteJourney(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  // journey_destinations / journey_journey_types / journey_experience_types /
  // journey_safari_themes all reference journey_id on delete cascade.
  const { error } = await supabase.from("journeys").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/journeys");
  revalidatePath("/journeys");
  revalidatePublicSite();
  redirectWithSaved("/admin/journeys", "Journey deleted.");
}
