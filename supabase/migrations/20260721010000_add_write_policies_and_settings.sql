-- The first RLS pass (20260718163423) only added "Staff can manage" (write)
-- policies for the tables the admin CRM/ops screens touch (customers,
-- bookings, payments, discount_codes, media, inquiries, notifications,
-- affiliate_partners, trip_planner_requests). The content tables never got
-- a matching write policy, so even a correctly wired admin form would be
-- silently rejected by Postgres — RLS defaults to deny, not allow.

create policy "Staff can manage destinations"
  on destinations for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage tours"
  on tours for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage tour availability"
  on tour_availability for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage blog posts"
  on blog_posts for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage reviews"
  on reviews for all
  to authenticated
  using (true) with check (true);

-- The `staff` table is different: it holds role assignments, so "any logged
-- in staff member can edit any staff row" would let a driver promote
-- themselves to admin. Gate writes to admin-role staff specifically.
create or replace function is_admin() returns boolean
  language sql security definer stable
  set search_path = public
  as $$
    select exists (
      select 1 from staff where auth_user_id = auth.uid() and role = 'admin'
    );
  $$;

create policy "Admins can manage staff"
  on staff for all
  to authenticated
  using (is_admin()) with check (is_admin());

-- ============ SITE SETTINGS ============
-- Small key/value store for admin-editable homepage figures (e.g. the
-- "Happy Travelers" stat) that aren't derived from real booking data yet.
create table site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

create policy "Public can read settings"
  on site_settings for select
  to anon, authenticated
  using (true);

create policy "Staff can manage settings"
  on site_settings for all
  to authenticated
  using (true) with check (true);

insert into site_settings (key, value) values ('happy_travelers_count', '1000');

-- ============ FEATURED REVIEW ============
-- Lets an admin pick which single approved review shows as the homepage
-- testimonial, instead of it always being "whichever is newest."
alter table reviews add column is_featured boolean not null default false;
