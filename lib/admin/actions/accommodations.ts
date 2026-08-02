"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export interface AccommodationInput {
  destinationId: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  tier: string;
  status: string;
  displayOrder: number;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: AccommodationInput) {
  return {
    destination_id: input.destinationId,
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description,
    hero_image: input.heroImage,
    tier: input.tier || null,
    status: input.status,
    display_order: input.displayOrder,
  };
}

export async function createAccommodation(input: AccommodationInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("accommodations").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/accommodations");
  revalidatePublicSite();
  redirect("/admin/accommodations");
}

export async function updateAccommodation(id: string, input: AccommodationInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("accommodations").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/accommodations");
  revalidatePublicSite();
  redirect("/admin/accommodations");
}

export async function deleteAccommodation(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  // tour_accommodations / journey_accommodations reference accommodation_id on delete cascade.
  const { error } = await supabase.from("accommodations").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/accommodations");
  revalidatePublicSite();
  redirect("/admin/accommodations");
}
