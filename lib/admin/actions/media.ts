"use server";

import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  maxBytesForFile,
  formatMB,
  MAX_IMAGE_EDGE_PX,
  ALLOWED_MEDIA_TYPES,
  EXTENSION_FOR_MIME,
  isAllowedMediaType,
} from "@/lib/mediaLimits";

// Caps the longest edge to MAX_IMAGE_EDGE_PX and re-encodes at a sane
// quality, so a DSLR-sized (4000px+, several MB) original never reaches
// storage -- next/image + Netlify's Image CDN already handle the actual
// per-card cropping and WebP/AVIF conversion at delivery time, so this is
// only about the stored source, not the final delivered bytes. GIFs are
// usually animated (sharp's still-frame resize would silently drop the
// animation), so they pass through untouched. SVGs are rejected entirely
// before this is ever called -- see the allowlist check in uploadMedia --
// so there's no SVG branch here anymore. Falls back to the original
// buffer if sharp can't decode the file at all, so a corrupt/exotic
// upload never blocks an admin -- it just skips the optimization.
export async function resizeImageIfNeeded(
  buffer: Buffer,
  contentType: string
): Promise<{ buffer: Buffer; contentType: string }> {
  if (contentType === "image/gif") {
    return { buffer, contentType };
  }

  try {
    const image = sharp(buffer)
      .rotate() // bakes in EXIF orientation before it gets stripped below
      .resize({ width: MAX_IMAGE_EDGE_PX, height: MAX_IMAGE_EDGE_PX, fit: "inside", withoutEnlargement: true });
    const { format } = await image.metadata();
    const resized =
      format === "jpeg" ? await image.jpeg({ quality: 85, mozjpeg: true }).toBuffer()
      : format === "png" ? await image.png({ compressionLevel: 9 }).toBuffer()
      : format === "webp" ? await image.webp({ quality: 85 }).toBuffer()
      : await image.toBuffer();
    return { buffer: resized, contentType };
  } catch {
    return { buffer, contentType };
  }
}

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

export interface UploadedMedia {
  id: string;
  fileUrl: string;
  fileType: "image" | "video" | "pdf";
}

// Returns the created row (not just void) so callers that upload straight
// from wherever they're editing -- not a trip to the Media Library first --
// can immediately use the new file's URL without a second round trip.
export async function uploadMedia(formData: FormData): Promise<UploadedMedia> {
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  // Security audit (Part 3): the client-declared file.type used to be
  // trusted outright, with no allowlist rejecting disallowed types --
  // trivially spoofable (a renamed .html file, or any raw multipart
  // request not going through a real browser file picker). Explicitly
  // includes SVG's rejection: an SVG can carry an embedded <script> and is
  // a well-known stored-XSS vector if it's ever served with a
  // content-type a browser will execute -- "image/svg+xml" is
  // deliberately absent from ALLOWED_MEDIA_TYPES.
  if (!isAllowedMediaType(file.type)) {
    throw new Error(
      `File type "${file.type || "unknown"}" isn't allowed. Accepted: ${ALLOWED_MEDIA_TYPES.join(", ")}.`
    );
  }

  // The storage bucket itself only enforces one ceiling for every file
  // type (20MB, wide enough to cover video); images/PDFs get a stricter
  // 10MB cap here instead, since the bucket can't apply different limits
  // per mime type.
  const maxBytes = maxBytesForFile(file);
  if (file.size > maxBytes) {
    const kind = file.type.startsWith("video/") ? "Videos" : "This file type";
    throw new Error(`${kind} must be ${formatMB(maxBytes)} or smaller (this file is ${formatMB(file.size)}).`);
  }

  const originalBuffer = Buffer.from(await file.arrayBuffer());

  // Confirms the file's actual bytes match its claimed type (magic-byte /
  // file-signature check) rather than trusting file.type alone -- catches
  // e.g. a renamed .html file relabeled as "image/png". Fails closed: a
  // claimed image/video/pdf type with an undetectable or mismatched
  // signature is rejected rather than allowed through, since all eight
  // allowed types have well-known, reliably-detected signatures (verified
  // directly against real sample files, including ffmpeg-generated
  // mp4/webm/mov, for this audit). Runs before any Supabase call, along
  // with every other check above -- every untrusted-input check in this
  // function completes before an external service is ever touched.
  const detected = await fileTypeFromBuffer(originalBuffer);
  if (!detected || !isAllowedMediaType(detected.mime) || detected.mime !== file.type) {
    throw new Error("This file's contents don't match its declared type and were rejected.");
  }
  const verifiedType = detected.mime;

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  // Extension comes from the verified type via a fixed lookup table, never
  // from the user-supplied filename -- so a crafted filename (e.g.
  // containing "../" path-traversal sequences) can never influence the
  // storage path at all. The path itself is always a fresh random UUID.
  const path = `${crypto.randomUUID()}.${EXTENSION_FOR_MIME[verifiedType]}`;

  const { buffer, contentType } = verifiedType.startsWith("image/")
    ? await resizeImageIfNeeded(originalBuffer, verifiedType)
    : { buffer: originalBuffer, contentType: verifiedType };

  const { error: uploadError } = await supabase.storage.from("media").upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const fileType = verifiedType === "application/pdf" ? "pdf" : verifiedType.startsWith("video/") ? "video" : "image";

  const { data: inserted, error: insertError } = await supabase
    .from("media")
    .insert({
      file_url: publicUrl,
      file_type: fileType,
      alt_text: altText || file.name,
      tags,
      storage_path: path,
    })
    .select("id")
    .single();
  if (insertError || !inserted) {
    // Roll back the upload so we don't leave an orphaned file if the DB
    // insert failed (e.g. RLS rejection, bad column).
    await supabase.storage.from("media").remove([path]);
    throw new Error(insertError?.message ?? "Failed to save upload.");
  }

  revalidatePath("/admin/media");
  return { id: inserted.id, fileUrl: publicUrl, fileType };
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
