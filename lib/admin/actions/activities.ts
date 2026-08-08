"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import { redirectWithSaved } from "./saved-redirect";

export interface ActivityInput {
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: ActivityInput) {
  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description,
    icon: input.icon,
    display_order: input.displayOrder,
  };
}

export async function createActivity(input: ActivityInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("activities").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/activities");
  revalidatePublicSite();
  redirectWithSaved("/admin/activities", `"${input.name}" created.`);
}

export async function updateActivity(id: string, input: ActivityInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("activities").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/activities");
  revalidatePublicSite();
  redirectWithSaved("/admin/activities", `"${input.name}" saved.`);
}

export async function deleteActivity(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  // tour_activities / journey_activities reference activity_id on delete cascade.
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/activities");
  revalidatePublicSite();
  redirectWithSaved("/admin/activities", "Activity deleted.");
}
