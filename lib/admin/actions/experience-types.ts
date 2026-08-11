"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import { redirectWithSaved } from "./saved-redirect";

export interface ExperienceTypeInput {
  name: string;
  slug: string;
  description: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: ExperienceTypeInput) {
  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description,
  };
}

export async function createExperienceType(input: ExperienceTypeInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("experience_types").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/experience-types");
  revalidatePath("/experiences");
  revalidatePublicSite();
  redirectWithSaved("/admin/experience-types", `"${input.name}" created.`);
}

export async function updateExperienceType(id: string, input: ExperienceTypeInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("experience_types").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/experience-types");
  revalidatePath("/experiences");
  revalidatePublicSite();
  redirectWithSaved("/admin/experience-types", `"${input.name}" saved.`);
}

export async function deleteExperienceType(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  // tour_experience_types / journey_experience_types reference
  // experience_type_id on delete cascade.
  const { error } = await supabase.from("experience_types").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/experience-types");
  revalidatePath("/experiences");
  revalidatePublicSite();
  redirectWithSaved("/admin/experience-types", "Experience type deleted.");
}
