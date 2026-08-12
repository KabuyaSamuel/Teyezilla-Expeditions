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

// The homepage's real route is "/", not "/homepage" -- staff typing "home"
// or "homepage" (a reasonable guess, and what happened at least twice
// already) would otherwise silently create a dead link with no route
// behind it. Normalize the common aliases rather than just prepending a
// slash to whatever was typed.
const HOMEPAGE_ALIASES = new Set(["home", "homepage", "index", "root"]);

function normalizeDestinationPath(raw: string): string {
  const trimmed = raw.trim().replace(/^\/+/, "");
  if (!trimmed || HOMEPAGE_ALIASES.has(trimmed.toLowerCase())) return "/";
  return `/${trimmed}`;
}

export async function createTrackedLink(input: CreateTrackedLinkInput): Promise<{ slug: string }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const destinationPath = normalizeDestinationPath(input.destinationPath);

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

export interface UpdateTrackedLinkInput {
  label: string;
  destinationPath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

// Slug is deliberately not editable here -- it's baked into every copy of
// the /go/{slug} URL already handed out (ads, bios, emails), so changing it
// would break links already in the wild. Everything else, including where
// it actually redirects to, can be corrected without losing the link's
// slug or its click history.
export async function updateTrackedLink(id: string, input: UpdateTrackedLinkInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  if (!input.utmSource.trim()) throw new Error("Source is required.");

  const { error } = await supabase
    .from("tracked_links")
    .update({
      label: input.label.trim() || null,
      destination_path: normalizeDestinationPath(input.destinationPath),
      utm_source: input.utmSource.trim(),
      utm_medium: input.utmMedium.trim() || null,
      utm_campaign: input.utmCampaign.trim() || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/link-generator");
}

export async function deleteTrackedLink(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tracked_links").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/link-generator");
}
