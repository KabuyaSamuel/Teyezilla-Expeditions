// Shared between the server action (authoritative check) and the upload
// UI components (instant client-side feedback before even attempting an
// upload). The Supabase Storage bucket itself only has one file_size_limit
// for the whole bucket (currently 20MB, see the media-bucket migrations) --
// it can't enforce different caps per mime type, so images/PDFs get their
// own stricter limit here instead.
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_BYTES = 20 * 1024 * 1024; // 20MB, matches the bucket ceiling

// Upload-time resize ceiling (see lib/admin/actions/media.ts) -- covers the
// largest card type on the site (the 1920x1080 hero) with headroom, without
// storing DSLR-sized (4000px+) originals no card ever needs.
export const MAX_IMAGE_EDGE_PX = 2400;

// Security audit (Part 3): the only types the admin upload UI actually
// offers (see the `accept` attributes on MediaUploadForm/MediaPickerField/
// HeroSlidesEditor) -- webm and quicktime (.mov) are real, legitimate
// options for hero video slides, not just mp4, so both are included
// alongside it. Enforced server-side in uploadMedia() against both the
// claimed Content-Type AND the file's actual magic bytes (via `file-type`)
// -- a client-declared type alone is trivially spoofable and was
// previously trusted with no allowlist at all.
export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
] as const;

export type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

export function isAllowedMediaType(value: string): value is AllowedMediaType {
  return (ALLOWED_MEDIA_TYPES as readonly string[]).includes(value);
}

// Storage path extensions are derived from this (the *verified* type, from
// magic bytes) rather than the user-supplied filename -- see uploadMedia()
// -- so a crafted filename (e.g. containing "../") can never reach the
// storage path at all, not just a sanitized version of it.
export const EXTENSION_FOR_MIME: Record<AllowedMediaType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
};

export function maxBytesForFile(file: { type: string }): number {
  if (file.type === "application/pdf") return MAX_PDF_BYTES;
  if (file.type.startsWith("video/")) return MAX_VIDEO_BYTES;
  return MAX_IMAGE_BYTES;
}

export function formatMB(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}
