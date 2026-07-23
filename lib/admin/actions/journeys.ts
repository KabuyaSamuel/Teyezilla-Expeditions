"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface JourneyInput {
  title: string;
  slug: string;
  heroImage: string;
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
    short_description: input.shortDescription,
    overview: input.overview,
    duration_days: input.durationDays,
    price_from: input.priceFrom,
    currency: input.currency,
    difficulty: input.difficulty,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    itinerary: input.itinerary,
    meeting_point: input.meetingPoint,
    pickup_locations: input.pickupLocations,
    featured: input.featured,
    status: input.status,
  };
}

// Many-to-many editing pattern: wipe this journey's rows in each join table
// and re-insert from the form's current selection. Simpler and just as safe
// as diffing, since these join tables carry no data beyond the relationship
// itself (display_order/is_primary are derived fresh from form state each save).
async function syncJourneyRelations(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  journeyId: string,
  input: JourneyInput
) {
  if (!supabase) return;

  await supabase.from("journey_destinations").delete().eq("journey_id", journeyId);
  if (input.destinationIds.length > 0) {
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
  }

  await supabase.from("journey_journey_types").delete().eq("journey_id", journeyId);
  if (input.journeyTypeIds.length > 0) {
    const { error } = await supabase
      .from("journey_journey_types")
      .insert(input.journeyTypeIds.map((journeyTypeId) => ({ journey_id: journeyId, journey_type_id: journeyTypeId })));
    if (error) throw new Error(error.message);
  }

  await supabase.from("journey_experience_types").delete().eq("journey_id", journeyId);
  if (input.experienceTypeIds.length > 0) {
    const { error } = await supabase.from("journey_experience_types").insert(
      input.experienceTypeIds.map((experienceTypeId) => ({
        journey_id: journeyId,
        experience_type_id: experienceTypeId,
      }))
    );
    if (error) throw new Error(error.message);
  }

  await supabase.from("journey_safari_themes").delete().eq("journey_id", journeyId);
  if (input.safariThemeIds.length > 0) {
    const { error } = await supabase.from("journey_safari_themes").insert(
      input.safariThemeIds.map((safariThemeId) => ({ journey_id: journeyId, safari_theme_id: safariThemeId }))
    );
    if (error) throw new Error(error.message);
  }
}

export async function createJourney(input: JourneyInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data, error } = await supabase.from("journeys").insert(toRow(input)).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create journey.");

  await syncJourneyRelations(supabase, data.id, input);

  revalidatePath("/admin/journeys");
  revalidatePath("/journeys");
  redirect("/admin/journeys");
}

export async function updateJourney(id: string, input: JourneyInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("journeys").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  await syncJourneyRelations(supabase, id, input);

  revalidatePath("/admin/journeys");
  revalidatePath("/journeys");
  redirect("/admin/journeys");
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
  redirect("/admin/journeys");
}
