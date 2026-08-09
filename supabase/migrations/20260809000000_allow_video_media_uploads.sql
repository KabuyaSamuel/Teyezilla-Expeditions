-- The Media Library UI and data model (media.file_type, MediaItem,
-- HeroSlidesEditor's media picker, HeroCarousel's <video> rendering) have
-- supported "video" all along, but the storage bucket itself was created
-- images/PDF-only (see 20260722000000_add_media_storage_bucket.sql) with a
-- 10MB cap -- too small for real video clips -- so every video upload was
-- rejected by Supabase Storage before it ever reached the app's own code.
-- Widens the allowlist so staff can upload hero background clips (the only
-- intended use of video in this app -- other image pickers deliberately
-- stay image-only, see MediaPickerField.tsx's fileType filter).
--
-- Kept to 20MB, not a more generous cap: on the Supabase free tier, egress
-- (not storage) is the real constraint, and a hero video autoplays for
-- every homepage visitor. A 20MB ceiling forces short, compressed, looping
-- clips rather than accidentally eating a month's bandwidth budget on one
-- oversized upload.
update storage.buckets
set
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4', 'video/webm', 'video/quicktime'],
  file_size_limit = 20971520 -- 20MB
where id = 'media';
