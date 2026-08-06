-- Lets staff manage the homepage hero's rotating background video/image
-- slides from the admin dashboard instead of the hardcoded placeholder
-- array in components/HeroCarousel.tsx. No draft/published state -- these
-- are always public site chrome, same visibility as site_settings.
create table hero_slides (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  alt_text text not null default '',
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table hero_slides enable row level security;

create policy "Public can read hero slides"
  on hero_slides for select
  to anon, authenticated
  using (true);

create policy "Staff can manage hero slides"
  on hero_slides for all
  to authenticated
  using (true) with check (true);
