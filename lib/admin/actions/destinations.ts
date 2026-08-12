"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import { redirectWithSaved } from "./saved-redirect";

export interface DestinationInput {
  countryName: string;
  slug: string;
  flagEmoji: string;
  heroImage: string;
  shortDescription: string;
  overview: string;
  bestTimeToVisit: string;
  visaInfo: string;
  isLaunchDestination: boolean;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: DestinationInput) {
  return {
    country_name: input.countryName,
    slug: input.slug || slugify(input.countryName),
    flag_emoji: input.flagEmoji,
    hero_image: input.heroImage,
    short_description: input.shortDescription,
    overview: input.overview,
    best_time_to_visit: input.bestTimeToVisit,
    visa_info: input.visaInfo,
    is_launch_destination: input.isLaunchDestination,
    featured: input.featured,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
    og_image: input.ogImage,
  };
}

// Postgres surfaces a unique-violation as a raw "duplicate key value
// violates unique constraint..." message, which isn't something a staff
// member (not a developer) can act on -- translate the one case that can
// actually happen here (the auto-generated slug already exists, almost
// always because a destination with the same name already exists) into a
// message that tells them what to actually do about it.
function friendlyDestinationError(error: { code?: string; message: string }, countryName: string): string {
  if (error.code === "23505" && error.message.includes("destinations_slug_key")) {
    return `A destination named "${countryName}" already exists. Choose a different name, or edit the existing one instead.`;
  }
  // 23503 = foreign key violation. Deleting a destination cascades to its
  // tours, but a tour with bookings/reviews/inquiries -- or the
  // destination itself being used in a journey (on delete restrict) --
  // blocks the whole delete with a raw constraint error otherwise.
  if (error.code === "23503") {
    return `Can't delete this destination -- it (or one of its tours) is still referenced by a booking, review, inquiry, or journey. Remove those first.`;
  }
  return error.message;
}

export async function createDestination(input: DestinationInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("destinations").insert(toRow(input));
  if (error) throw new Error(friendlyDestinationError(error, input.countryName));

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePublicSite();
  redirectWithSaved("/admin/destinations", `"${input.countryName}" created.`);
}

export async function updateDestination(id: string, input: DestinationInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("destinations").update(toRow(input)).eq("id", id);
  if (error) throw new Error(friendlyDestinationError(error, input.countryName));

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePublicSite();
  redirectWithSaved("/admin/destinations", `"${input.countryName}" saved.`);
}

export async function deleteDestination(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("destinations").delete().eq("id", id);
  if (error) throw new Error(friendlyDestinationError(error, ""));

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePublicSite();
  redirectWithSaved("/admin/destinations", "Destination deleted.");
}
