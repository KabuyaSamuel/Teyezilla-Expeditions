"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface MediaUsageRef {
  label: string;
  href?: string;
}

// Every table/column in the schema that can hold a Media Library file_url.
// Checked one (table, column) pair at a time with plain .eq() rather than
// a single .or() filter, so a URL is never interpolated into a raw
// PostgREST filter string.
type UsageRow = Record<string, unknown>;

const MEDIA_USAGE_CHECKS: {
  table: string;
  column: string;
  select: string;
  label: (row: UsageRow) => string;
  href?: (row: UsageRow) => string;
}[] = [
  { table: "destinations", column: "hero_image", select: "country_name, slug", label: (r) => `Destination: ${r.country_name}`, href: (r) => `/admin/destinations/${r.slug}` },
  { table: "destinations", column: "og_image", select: "country_name, slug", label: (r) => `Destination: ${r.country_name}`, href: (r) => `/admin/destinations/${r.slug}` },
  { table: "tours", column: "hero_image", select: "title, slug", label: (r) => `Tour: ${r.title}`, href: (r) => `/admin/tours/${r.slug}` },
  { table: "tours", column: "og_image", select: "title, slug", label: (r) => `Tour: ${r.title}`, href: (r) => `/admin/tours/${r.slug}` },
  { table: "journeys", column: "hero_image", select: "title, slug", label: (r) => `Journey: ${r.title}`, href: (r) => `/admin/journeys/${r.slug}` },
  { table: "journeys", column: "og_image", select: "title, slug", label: (r) => `Journey: ${r.title}`, href: (r) => `/admin/journeys/${r.slug}` },
  { table: "blog_posts", column: "hero_image", select: "title, slug", label: (r) => `Blog Post: ${r.title}`, href: (r) => `/admin/blog/${r.slug}` },
  { table: "blog_posts", column: "og_image", select: "title, slug", label: (r) => `Blog Post: ${r.title}`, href: (r) => `/admin/blog/${r.slug}` },
  { table: "collections", column: "hero_image", select: "name, slug", label: (r) => `Collection: ${r.name}`, href: (r) => `/admin/collections/${r.slug}` },
  { table: "collections", column: "og_image", select: "name, slug", label: (r) => `Collection: ${r.name}`, href: (r) => `/admin/collections/${r.slug}` },
  { table: "accommodations", column: "hero_image", select: "name, id", label: (r) => `Accommodation: ${r.name}`, href: (r) => `/admin/accommodations/${r.id}` },
  { table: "vehicles", column: "image", select: "name, slug", label: (r) => `Vehicle: ${r.name}`, href: (r) => `/admin/vehicles/${r.slug}` },
  { table: "team_members", column: "photo", select: "full_name, id", label: (r) => `Team Member: ${r.full_name}`, href: (r) => `/admin/team-members/${r.id}` },
  { table: "hero_slides", column: "media_url", select: "alt_text", label: (r) => `Homepage Hero Slide${r.alt_text ? `: ${r.alt_text}` : ""}`, href: () => "/admin/settings" },
  // No dedicated admin CRUD page for these yet, so no link -- just named.
  { table: "regions", column: "hero_image", select: "name", label: (r) => `Region: ${r.name}` },
  { table: "regions", column: "og_image", select: "name", label: (r) => `Region: ${r.name}` },
  { table: "safari_themes", column: "hero_image", select: "name", label: (r) => `Safari Theme: ${r.name}` },
  { table: "attractions", column: "hero_image", select: "name", label: (r) => `Attraction: ${r.name}` },
];

export async function checkMediaUsage(fileUrl: string): Promise<MediaUsageRef[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const results = await Promise.all(
    MEDIA_USAGE_CHECKS.map(({ table, column, select }) => supabase.from(table).select(select).eq(column, fileUrl))
  );

  const refs: MediaUsageRef[] = [];
  results.forEach((result, i) => {
    const { label, href } = MEDIA_USAGE_CHECKS[i];
    const rows = (result.data ?? []) as unknown as UsageRow[];
    rows.forEach((row) => refs.push({ label: label(row), href: href?.(row) }));
  });
  return refs;
}

export async function uploadMedia(formData: FormData): Promise<void> {
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const fileType = file.type === "application/pdf" ? "pdf" : file.type.startsWith("video/") ? "video" : "image";

  const { error: insertError } = await supabase.from("media").insert({
    file_url: publicUrl,
    file_type: fileType,
    alt_text: altText || file.name,
    tags,
    storage_path: path,
  });
  if (insertError) {
    // Roll back the upload so we don't leave an orphaned file if the DB
    // insert failed (e.g. RLS rejection, bad column).
    await supabase.storage.from("media").remove([path]);
    throw new Error(insertError.message);
  }

  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string, storagePath: string | null): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  if (storagePath) {
    const { error: storageError } = await supabase.storage.from("media").remove([storagePath]);
    if (storageError) throw new Error(storageError.message);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/media");
}
