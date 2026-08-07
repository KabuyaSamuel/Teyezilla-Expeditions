"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

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
  redirect("/admin/destinations");
}

export async function updateDestination(id: string, input: DestinationInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("destinations").update(toRow(input)).eq("id", id);
  if (error) throw new Error(friendlyDestinationError(error, input.countryName));

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePublicSite();
  redirect("/admin/destinations");
}

export async function deleteDestination(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("destinations").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePublicSite();
  redirect("/admin/destinations");
}
