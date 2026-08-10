"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface CreateTrackedLinkInput {
  label: string;
  destinationPath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  slug: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createTrackedLink(input: CreateTrackedLinkInput): Promise<{ slug: string }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const trimmedPath = input.destinationPath.trim();
  const destinationPath = trimmedPath ? (trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`) : "/";

  const baseSlug = slugify(input.slug || input.label || input.utmCampaign || input.utmSource);
  if (!baseSlug) throw new Error("Couldn't generate a link slug -- fill in at least a source, campaign, or custom slug.");
  if (!input.utmSource.trim()) throw new Error("Source is required.");

  const row = {
    label: input.label.trim() || null,
    destination_path: destinationPath,
    utm_source: input.utmSource.trim(),
    utm_medium: input.utmMedium.trim() || null,
    utm_campaign: input.utmCampaign.trim() || null,
  };

  // Tries the clean slug first; on a real collision (Postgres unique
  // violation, 23505) retries once with a short random suffix rather than
  // failing outright -- staff creating a second "tiktok-promo" link
  // shouldn't need to think up a unique name themselves.
  let slug = baseSlug;
  let { error } = await supabase.from("tracked_links").insert({ ...row, slug });
  if (error?.code === "23505") {
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    ({ error } = await supabase.from("tracked_links").insert({ ...row, slug }));
  }
  if (error) throw new Error(error.message);

  revalidatePath("/admin/link-generator");
  return { slug };
}

export async function deleteTrackedLink(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tracked_links").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/link-generator");
}
