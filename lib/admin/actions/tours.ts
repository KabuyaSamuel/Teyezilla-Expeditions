"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import {
  syncPricingTiers,
  syncHighlights,
  syncAddons,
  syncActivities,
  syncExperienceTypes,
  syncVehicles,
  syncAccommodations,
  productScalarsToRow,
  type PricingTierInput,
  type HighlightInput,
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
  addons: AddonInput[];
  activityIds: string[];
  experienceTypeIds: string[];
  vehicleIds: string[];
  accommodationIds: string[];
}

// Soft-enforces the same readiness bar shown as a checklist in TourForm --
// this is the actual gate (the checklist is just a UI hint), so a status of
// "published" can't be reached via a direct API call with missing content
// either.
function assertPublishable(input: TourInput) {
  if (input.status !== "published") return;
  const missing: string[] = [];
  if (!input.itinerary.some((d) => d.title && d.description)) missing.push("at least one itinerary day");
  if (missing.length > 0) {
    throw new Error(`Can't publish yet -- missing: ${missing.join(", ")}.`);
  }
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
    difficulty: input.difficulty,
    duration_days: input.durationDays,
    duration_hours: input.durationHours,
    hero_image: input.heroImage,
    price_from: input.priceFrom,
    short_description: input.shortDescription,
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
  await syncAddons(supabase, "tour_addons", "tour_id", tourId, input.addons);
  await syncActivities(supabase, "tour_activities", "tour_id", tourId, input.activityIds);
  await syncExperienceTypes(supabase, "tour_experience_types", "tour_id", tourId, input.experienceTypeIds);
  await syncVehicles(supabase, "tour_vehicles", "tour_id", tourId, input.vehicleIds);
  await syncAccommodations(supabase, "tour_accommodations", "tour_id", tourId, input.accommodationIds);
}

export async function createTour(input: TourInput): Promise<void> {
  assertPublishable(input);
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
  assertPublishable(input);
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
