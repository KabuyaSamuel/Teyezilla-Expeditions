-- Products CMS enrichment: pricing tiers, highlights, add-ons/extensions, and
-- a reusable activities library for both tours and journeys, plus richer
-- logistics/classification columns. See the approved plan for full context —
-- paired tour_X/journey_X tables (not dual-nullable-parent tables) to match
-- the existing tour_experience_types/journey_experience_types convention.

-- ============ NEW COLUMNS: TOURS ============
alter table tours
  add column product_type text default 'experience'
    check (product_type in ('experience', 'safari', 'private_travel')),
  add column min_guests integer,
  add column max_guests integer,
  add column fitness_level text,
  add column best_for text[],
  add column languages text[],
  add column transportation text,
  add column guide_info text,
  add column food_and_drinks text,
  add column important_info text,
  add column bring_list text[],
  add column cancellation_policy text,
  add column availability_note text,
  add column teyezilla_moment text;

-- ============ NEW COLUMNS: JOURNEYS ============
alter table journeys
  add column product_type text default 'signature_journey'
    check (product_type in ('signature_journey', 'multi_country_expedition')),
  add column min_guests integer,
  add column max_guests integer,
  add column fitness_level text,
  add column best_for text[],
  add column languages text[],
  add column transportation text,
  add column guide_info text,
  add column food_and_drinks text,
  add column important_info text,
  add column bring_list text[],
  add column cancellation_policy text,
  add column availability_note text,
  add column teyezilla_moment text;

comment on column tours.itinerary is
  'Array of { day, fromLocation?, toLocation?, title, description, teyezillaMoment?, overnight?, meals? }.';
comment on column journeys.itinerary is
  'Array of { day, fromLocation?, toLocation?, title, description, teyezillaMoment?, overnight?, meals? }.';

-- ============ PRICING TIERS ============
create table tour_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  tier_name text not null,
  tagline text,
  price numeric(10,2),
  currency text default 'USD',
  accommodation_summary text,
  features text[],
  cta_label text,
  display_order integer default 0
);
create index on tour_pricing_tiers (tour_id);

create table journey_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  tier_name text not null,
  tagline text,
  price numeric(10,2),
  currency text default 'USD',
  accommodation_summary text,
  features text[],
  cta_label text,
  display_order integer default 0
);
create index on journey_pricing_tiers (journey_id);

-- ============ HIGHLIGHTS ============
create table tour_highlights (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  title text not null,
  description text,
  display_order integer default 0
);
create index on tour_highlights (tour_id);

create table journey_highlights (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  title text not null,
  description text,
  display_order integer default 0
);
create index on journey_highlights (journey_id);

-- ============ ADD-ONS & EXTENSIONS ============
-- kind distinguishes same-product upsells ("Add private seafood lunch") from
-- cross-sell trip extensions ("Serengeti Extension, +3-5 days") — one table
-- instead of three near-identical ones.
create table tour_addons (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  kind text not null check (kind in ('addon', 'extension')),
  title text not null,
  description text,
  price numeric(10,2),
  currency text default 'USD',
  extra_days_min integer,
  extra_days_max integer,
  cta_label text,
  display_order integer default 0
);
create index on tour_addons (tour_id);

create table journey_addons (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  kind text not null check (kind in ('addon', 'extension')),
  title text not null,
  description text,
  price numeric(10,2),
  currency text default 'USD',
  extra_days_min integer,
  extra_days_max integer,
  cta_label text,
  display_order integer default 0
);
create index on journey_addons (journey_id);

-- ============ ACTIVITIES LIBRARY ============
-- Reusable named bookable sub-experiences (e.g. "Maasai Mara Game Drive"),
-- distinct from experience_types (broad nav-filter tags like "Wildlife & Safari").
create table activities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique not null,
  description text,
  icon text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table tour_activities (
  tour_id uuid not null references tours(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  display_order integer default 0,
  primary key (tour_id, activity_id)
);

create table journey_activities (
  journey_id uuid not null references journeys(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, activity_id)
);

-- ============ RLS ============
alter table tour_pricing_tiers enable row level security;
alter table journey_pricing_tiers enable row level security;
alter table tour_highlights enable row level security;
alter table journey_highlights enable row level security;
alter table tour_addons enable row level security;
alter table journey_addons enable row level security;
alter table activities enable row level security;
alter table tour_activities enable row level security;
alter table journey_activities enable row level security;

create policy "Public can read tour pricing tiers" on tour_pricing_tiers for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour pricing tiers" on tour_pricing_tiers for all to authenticated using (true) with check (true);

create policy "Public can read journey pricing tiers" on journey_pricing_tiers for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey pricing tiers" on journey_pricing_tiers for all to authenticated using (true) with check (true);

create policy "Public can read tour highlights" on tour_highlights for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour highlights" on tour_highlights for all to authenticated using (true) with check (true);

create policy "Public can read journey highlights" on journey_highlights for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey highlights" on journey_highlights for all to authenticated using (true) with check (true);

create policy "Public can read tour addons" on tour_addons for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour addons" on tour_addons for all to authenticated using (true) with check (true);

create policy "Public can read journey addons" on journey_addons for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey addons" on journey_addons for all to authenticated using (true) with check (true);

create policy "Public can read activities" on activities for select to anon, authenticated using (true);
create policy "Staff can manage activities" on activities for all to authenticated using (true) with check (true);

create policy "Public can read tour activities" on tour_activities for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour activities" on tour_activities for all to authenticated using (true) with check (true);

create policy "Public can read journey activities" on journey_activities for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey activities" on journey_activities for all to authenticated using (true) with check (true);

-- ============ SEED: ACTIVITIES LIBRARY ============
insert into activities (name, slug, description, display_order) values
('Game Drive', 'game-drive', 'Guided wildlife viewing by 4x4 safari vehicle.', 1),
('Guided Nature Walk', 'guided-nature-walk', 'On-foot exploration with a local guide.', 2),
('Cultural Village Visit', 'cultural-village-visit', 'A guided visit to a local community.', 3),
('Sunset Dhow Sail', 'sunset-dhow-sail', 'Traditional dhow sailing at golden hour.', 4),
('Spice Farm Tour', 'spice-farm-tour', 'Guided tour through a working spice plantation.', 5),
('Snorkelling', 'snorkelling', 'Guided snorkelling in reef or lagoon waters.', 6),
('Private Bush Dining', 'private-bush-dining', 'An intimate dining setup in the wilderness.', 7);
