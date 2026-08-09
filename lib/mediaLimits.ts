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

export function maxBytesForFile(file: { type: string }): number {
  if (file.type === "application/pdf") return MAX_PDF_BYTES;
  if (file.type.startsWith("video/")) return MAX_VIDEO_BYTES;
  return MAX_IMAGE_BYTES;
}

export function formatMB(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}
