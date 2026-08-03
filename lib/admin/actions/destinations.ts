"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export interface DestinationInput {
  countryName: string;
  slug: string;
  flagEmoji: string;
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
    short_description: input.shortDescription,
    overview: input.overview,
    best_time_to_visit: input.bestTimeToVisit,
    visa_info: input.visaInfo,
    is_launch_destination: input.isLaunchDestination,
    featured: input.featured,
  };
}

export async function createDestination(input: DestinationInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("destinations").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePublicSite();
  redirect("/admin/destinations");
}

export async function updateDestination(id: string, input: DestinationInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("destinations").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

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
