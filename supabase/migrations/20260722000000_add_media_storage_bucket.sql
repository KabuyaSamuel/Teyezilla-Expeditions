-- Public bucket for Media Library uploads (images, PDFs). Public so the
-- resulting URLs can be used directly as hero images etc. without a signed
-- URL round-trip; RLS on storage.objects still governs who can write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do nothing;

create policy "Public can read media bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "Staff can upload to media bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Staff can update media bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "Staff can delete from media bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
