-- IA redesign Phase 1: schema foundation for the client's new navigation
-- (Destinations by region, Journeys, Experiences, Collections, Safari hub).
-- destinations/tours are NOT modified structurally, only extended via new
-- tables — see /home/pelloh/.claude/plans/humming-sparking-wilkes.md for
-- the full design rationale.

-- ============ REGIONS ============
-- Solves Zanzibar needing to appear under both East Africa and Indian Ocean
-- at once — a single region column on destinations can't do that.
create table regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  hero_image text,
  display_order integer default 0,
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table destination_regions (
  destination_id uuid not null references destinations(id) on delete cascade,
  region_id uuid not null references regions(id) on delete cascade,
  primary key (destination_id, region_id)
);
create index on destination_regions (region_id);

-- ============ JOURNEYS ============
-- Deliberately no destination_id shortcut column (unlike tours) — multi-country
-- is the whole point of this entity, and a shortcut FK would be a second
-- source of truth to keep in sync with journey_destinations.
create table journeys (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  hero_image text,
  short_description text,
  overview text,
  duration_days integer,
  price_from numeric(10,2),
  currency text default 'USD',
  difficulty text check (difficulty in ('Easy', 'Moderate', 'Challenging')),
  inclusions text[],
  exclusions text[],
  itinerary jsonb, -- array of { day, title, description }
  meeting_point text,
  pickup_locations text[],
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table journey_destinations (
  journey_id uuid not null references journeys(id) on delete cascade,
  -- restrict, not cascade: deleting a destination should never silently
  -- shrink a multi-country itinerary out from under its own copy.
  destination_id uuid not null references destinations(id) on delete restrict,
  is_primary boolean not null default false,
  display_order integer default 0,
  primary key (journey_id, destination_id)
);
create index on journey_destinations (destination_id);
create unique index journey_destinations_one_primary
  on journey_destinations (journey_id) where is_primary;

create table journey_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create table journey_journey_types (
  journey_id uuid not null references journeys(id) on delete cascade,
  journey_type_id uuid not null references journey_types(id) on delete cascade,
  primary key (journey_id, journey_type_id)
);
create index on journey_journey_types (journey_type_id);

-- ============ EXPERIENCE TYPES ============
-- Shared multi-select tagging for tours AND journeys. Lookup + join table
-- (not a text[] column) so each tag can carry metadata for hub pages and
-- stay typo-proof, and so it matches the pattern used for every other new
-- taxonomy in this migration.
create table experience_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique not null,
  icon text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table tour_experience_types (
  tour_id uuid not null references tours(id) on delete cascade,
  experience_type_id uuid not null references experience_types(id) on delete cascade,
  primary key (tour_id, experience_type_id)
);
create index on tour_experience_types (experience_type_id);

create table journey_experience_types (
  journey_id uuid not null references journeys(id) on delete cascade,
  experience_type_id uuid not null references experience_types(id) on delete cascade,
  primary key (journey_id, experience_type_id)
);
create index on journey_experience_types (experience_type_id);

comment on column tours.category_label is
  'Deprecated by tour_experience_types (multi-select). Retained for historical data only — stop writing to it once the admin form switches over.';

-- ============ COLLECTIONS ============
-- 7 named, admin-curated editorial groupings — NOT auto-derived from tags.
-- Two explicit join tables (not one polymorphic collection_items table),
-- matching the plain-FK convention used everywhere else in this schema.
create table collections (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique not null,
  description text,
  hero_image text,
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table collection_tours (
  collection_id uuid not null references collections(id) on delete cascade,
  tour_id uuid not null references tours(id) on delete cascade,
  display_order integer default 0,
  primary key (collection_id, tour_id)
);
create index on collection_tours (tour_id);

create table collection_journeys (
  collection_id uuid not null references collections(id) on delete cascade,
  journey_id uuid not null references journeys(id) on delete cascade,
  display_order integer default 0,
  primary key (collection_id, journey_id)
);
create index on collection_journeys (journey_id);

-- ============ SAFARI THEMES ============
create table safari_themes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique not null,
  description text,
  hero_image text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table tour_safari_themes (
  tour_id uuid not null references tours(id) on delete cascade,
  safari_theme_id uuid not null references safari_themes(id) on delete cascade,
  primary key (tour_id, safari_theme_id)
);
create index on tour_safari_themes (safari_theme_id);

create table journey_safari_themes (
  journey_id uuid not null references journeys(id) on delete cascade,
  safari_theme_id uuid not null references safari_themes(id) on delete cascade,
  primary key (journey_id, safari_theme_id)
);
create index on journey_safari_themes (safari_theme_id);

-- ============ ATTRACTIONS & ACCOMMODATIONS ============
-- Dedicated tables for "Places to Discover" / "Where to Stay" per
-- destination — the generic media library has no name/tier/ordering and
-- is a weak substitute for a real one-to-many relationship.
create table attractions (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references destinations(id) on delete cascade,
  name text not null,
  slug text,
  description text,
  hero_image text,
  category text,
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (destination_id, slug)
);
create index on attractions (destination_id);

create table accommodations (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references destinations(id) on delete cascade,
  name text not null,
  slug text,
  description text,
  hero_image text,
  tier text check (tier in ('Budget', 'Mid-Range', 'Luxury')),
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (destination_id, slug)
);
create index on accommodations (destination_id);

-- ============ TEAM MEMBERS & FAQS ============
create table team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text,
  bio text,
  photo text,
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'safari-guide',
  question text not null,
  answer text not null,
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on faqs (category);

-- ============ RLS ============
alter table regions enable row level security;
alter table destination_regions enable row level security;
alter table journeys enable row level security;
alter table journey_destinations enable row level security;
alter table journey_types enable row level security;
alter table journey_journey_types enable row level security;
alter table experience_types enable row level security;
alter table tour_experience_types enable row level security;
alter table journey_experience_types enable row level security;
alter table collections enable row level security;
alter table collection_tours enable row level security;
alter table collection_journeys enable row level security;
alter table safari_themes enable row level security;
alter table tour_safari_themes enable row level security;
alter table journey_safari_themes enable row level security;
alter table attractions enable row level security;
alter table accommodations enable row level security;
alter table team_members enable row level security;
alter table faqs enable row level security;

-- Pure lookup tables: no draft concept, unconditional public read.
create policy "Public can read regions" on regions for select to anon, authenticated using (true);
create policy "Staff can manage regions" on regions for all to authenticated using (true) with check (true);

create policy "Public can read journey types" on journey_types for select to anon, authenticated using (true);
create policy "Staff can manage journey types" on journey_types for all to authenticated using (true) with check (true);

create policy "Public can read experience types" on experience_types for select to anon, authenticated using (true);
create policy "Staff can manage experience types" on experience_types for all to authenticated using (true) with check (true);

create policy "Public can read safari themes" on safari_themes for select to anon, authenticated using (true);
create policy "Staff can manage safari themes" on safari_themes for all to authenticated using (true) with check (true);

-- destination_regions: destinations have no draft/published gate today, so
-- this join is unconditionally public, matching destinations' own policy.
create policy "Public can read destination regions" on destination_regions for select to anon, authenticated using (true);
create policy "Staff can manage destination regions" on destination_regions for all to authenticated using (true) with check (true);

-- Status-gated content tables.
create policy "Public can read published journeys" on journeys for select to anon, authenticated using (status = 'published');
create policy "Staff can manage journeys" on journeys for all to authenticated using (true) with check (true);

create policy "Public can read published collections" on collections for select to anon, authenticated using (status = 'published');
create policy "Staff can manage collections" on collections for all to authenticated using (true) with check (true);

create policy "Public can read published attractions" on attractions for select to anon, authenticated using (status = 'published');
create policy "Staff can manage attractions" on attractions for all to authenticated using (true) with check (true);

create policy "Public can read published accommodations" on accommodations for select to anon, authenticated using (status = 'published');
create policy "Staff can manage accommodations" on accommodations for all to authenticated using (true) with check (true);

create policy "Public can read published team members" on team_members for select to anon, authenticated using (status = 'published');
create policy "Staff can manage team members" on team_members for all to authenticated using (true) with check (true);

create policy "Public can read published faqs" on faqs for select to anon, authenticated using (status = 'published');
create policy "Staff can manage faqs" on faqs for all to authenticated using (true) with check (true);

-- Join tables whose parent(s) have a status column: check the parent(s).
create policy "Public can read journey destinations" on journey_destinations for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey destinations" on journey_destinations for all to authenticated using (true) with check (true);

create policy "Public can read journey journey types" on journey_journey_types for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey journey types" on journey_journey_types for all to authenticated using (true) with check (true);

create policy "Public can read tour experience types" on tour_experience_types for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour experience types" on tour_experience_types for all to authenticated using (true) with check (true);

create policy "Public can read journey experience types" on journey_experience_types for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey experience types" on journey_experience_types for all to authenticated using (true) with check (true);

create policy "Public can read tour safari themes" on tour_safari_themes for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour safari themes" on tour_safari_themes for all to authenticated using (true) with check (true);

create policy "Public can read journey safari themes" on journey_safari_themes for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey safari themes" on journey_safari_themes for all to authenticated using (true) with check (true);

-- collection_tours / collection_journeys: two parents, both must be published.
create policy "Public can read collection tours" on collection_tours for select to anon, authenticated
  using (
    exists (select 1 from collections c where c.id = collection_id and c.status = 'published')
    and exists (select 1 from tours t where t.id = tour_id and t.status = 'published')
  );
create policy "Staff can manage collection tours" on collection_tours for all to authenticated using (true) with check (true);

create policy "Public can read collection journeys" on collection_journeys for select to anon, authenticated
  using (
    exists (select 1 from collections c where c.id = collection_id and c.status = 'published')
    and exists (select 1 from journeys j where j.id = journey_id and j.status = 'published')
  );
create policy "Staff can manage collection journeys" on collection_journeys for all to authenticated using (true) with check (true);

-- ============ SEED: REGIONS ============
insert into regions (name, slug, description, display_order) values
('East Africa', 'east-africa', 'Kenya, Tanzania, Zanzibar, Uganda, and Rwanda — the classic safari heartland.', 1),
('North Africa', 'north-africa', 'Egypt and Morocco — ancient wonders and desert landscapes.', 2),
('Southern Africa', 'southern-africa', 'South Africa, Namibia, Botswana, Zambia, and Zimbabwe — dramatic wilderness and world-class safaris.', 3),
('Indian Ocean', 'indian-ocean', 'Zanzibar, Mauritius, and Seychelles — white-sand islands off Africa''s coast.', 4);

-- ============ SEED: NEW DESTINATIONS (coming soon, same treatment as the existing non-launch ones) ============
insert into destinations (country_name, slug, flag_emoji, hero_image, short_description, overview, best_time_to_visit, visa_info, is_launch_destination, meta_title, meta_description, og_image) values
('Namibia', 'namibia', '🇳🇦', 'https://picsum.photos/seed/namibia-hero/1200/800', 'The red dunes of Sossusvlei and the wildlife of Etosha National Park.', 'Coming soon to Teyezilla Expeditions.', 'May to October.', 'eVisa available online.', false, 'Namibia Safari & Desert Tours | Teyezilla Expeditions', 'Namibia desert and safari tours, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/namibia-og/1200/800'),
('Mauritius', 'mauritius', '🇲🇺', 'https://picsum.photos/seed/mauritius-hero/1200/800', 'Turquoise lagoons and white-sand beaches in the Indian Ocean.', 'Coming soon to Teyezilla Expeditions.', 'May to December.', 'Visa-free for many nationalities for short stays.', false, 'Mauritius Beach Holidays | Teyezilla Expeditions', 'Mauritius island escapes, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/mauritius-og/1200/800'),
('Seychelles', 'seychelles', '🇸🇨', 'https://picsum.photos/seed/seychelles-hero/1200/800', 'Granite islands, coral reefs, and some of the world''s most secluded beaches.', 'Coming soon to Teyezilla Expeditions.', 'April to May, and October to November.', 'Visa-free for most nationalities for short stays.', false, 'Seychelles Island Escapes | Teyezilla Expeditions', 'Seychelles island getaways, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/seychelles-og/1200/800');

-- ============ SEED: DESTINATION-REGION ASSIGNMENTS (Zanzibar dual-listed) ============
insert into destination_regions (destination_id, region_id)
select d.id, r.id from destinations d, regions r where d.slug = 'kenya' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'tanzania' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zanzibar' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'uganda' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'rwanda' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'egypt' and r.slug = 'north-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'morocco' and r.slug = 'north-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'south-africa' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'namibia' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'botswana' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zambia' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zimbabwe' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zanzibar' and r.slug = 'indian-ocean'
union all select d.id, r.id from destinations d, regions r where d.slug = 'mauritius' and r.slug = 'indian-ocean'
union all select d.id, r.id from destinations d, regions r where d.slug = 'seychelles' and r.slug = 'indian-ocean';

-- ============ SEED: JOURNEY TYPES ============
insert into journey_types (name, slug, description) values
('Signature Journeys', 'signature-journeys', 'Teyezilla''s flagship itineraries.'),
('Multi-Country Expeditions', 'multi-country-expeditions', 'Journeys spanning more than one African country.'),
('Luxury Journeys', 'luxury-journeys', 'High-end travel experiences.'),
('Family Journeys', 'family-journeys', 'Family and multi-generational travel.'),
('Honeymoon Journeys', 'honeymoon-journeys', 'Romantic safari and beach journeys.'),
('Private Journeys', 'private-journeys', 'Exclusive journeys for individuals and groups.');

-- ============ SEED: EXPERIENCE TYPES ============
insert into experience_types (name, slug, display_order) values
('Wildlife & Safari', 'wildlife-safari', 1),
('Beach & Islands', 'beach-islands', 2),
('Culture & Heritage', 'culture-heritage', 3),
('Adventure', 'adventure', 4),
('Food & Lifestyle', 'food-lifestyle', 5),
('Cities & Local Life', 'cities-local-life', 6);

-- ============ BACKFILL: EXISTING TOURS -> EXPERIENCE TYPES (reviewed mapping, not mechanical) ============
insert into tour_experience_types (tour_id, experience_type_id)
select t.id, et.id from tours t, experience_types et where t.slug in ('maasai-mara-safari', 'serengeti-safari') and et.slug = 'wildlife-safari'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'zanzibar-beach-escape' and et.slug = 'beach-islands'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'pyramids-of-giza-tour' and et.slug = 'culture-heritage'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'marrakech-sahara-desert' and et.slug = 'adventure'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'marrakech-sahara-desert' and et.slug = 'culture-heritage'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'nairobi-street-food-tour' and et.slug = 'food-lifestyle'
union all select t.id, et.id from tours t, experience_types et where t.slug in ('tuk-tuk-experience', 'boda-boda-experience') and et.slug = 'cities-local-life';

-- ============ SEED: SAFARI THEMES ============
insert into safari_themes (name, slug, description, display_order) values
('Great Migration', 'great-migration', 'Follow the wildebeest migration across the Serengeti and Maasai Mara.', 1),
('Big Five', 'big-five', 'Track lion, leopard, elephant, buffalo, and rhino.', 2),
('Gorilla Trekking', 'gorilla-trekking', 'Trek to see mountain gorillas in Rwanda and Uganda.', 3),
('Conservation', 'conservation', 'Safaris that directly support wildlife conservation efforts.', 4);

insert into tour_safari_themes (tour_id, safari_theme_id)
select t.id, st.id from tours t, safari_themes st where t.slug = 'maasai-mara-safari' and st.slug = 'big-five'
union all select t.id, st.id from tours t, safari_themes st where t.slug = 'serengeti-safari' and st.slug = 'great-migration';

-- ============ SEED: COLLECTIONS (published, with a starting curation from existing tours) ============
insert into collections (name, slug, description, display_order, status) values
('The Wild', 'the-wild', 'Wildlife & safari journeys across Africa''s greatest reserves.', 1, 'published'),
('The Ocean', 'the-ocean', 'Beach and island escapes along Africa''s coastlines.', 2, 'published'),
('The Heritage', 'the-heritage', 'Culture and history, from ancient wonders to living traditions.', 3, 'published'),
('The Adventure', 'the-adventure', 'Expeditions and exploration for the adventurous traveler.', 4, 'published'),
('The Romance', 'the-romance', 'Honeymoons and romantic escapes.', 5, 'draft'),
('The Family', 'the-family', 'Family and multi-generational journeys.', 6, 'draft'),
('The Private', 'the-private', 'Exclusive, bespoke travel for individuals and groups.', 7, 'draft');

insert into collection_tours (collection_id, tour_id)
select c.id, t.id from collections c, tours t where c.slug = 'the-wild' and t.slug in ('maasai-mara-safari', 'serengeti-safari')
union all select c.id, t.id from collections c, tours t where c.slug = 'the-ocean' and t.slug = 'zanzibar-beach-escape'
union all select c.id, t.id from collections c, tours t where c.slug = 'the-heritage' and t.slug = 'pyramids-of-giza-tour'
union all select c.id, t.id from collections c, tours t where c.slug = 'the-adventure' and t.slug = 'marrakech-sahara-desert';

-- ============ SEED: SAFARI-GUIDE FAQS (real, derived from existing destination data — not fabricated specifics) ============
insert into faqs (category, question, answer, display_order, status) values
('safari-guide', 'When is the best time to go on safari?', 'It depends on the destination: Kenya and Tanzania are best July to October for the wildebeest migration, while Rwanda and Uganda gorilla trekking is best in the dry seasons of June to September and December to February. Check the "Best Time to Visit" section on each destination page for specifics.', 1, 'published'),
('safari-guide', 'What should I pack for a safari?', 'Neutral-colored, breathable clothing, a warm layer for early morning game drives, comfortable closed shoes, sunscreen, a hat, and binoculars. Avoid bright colors and camouflage patterns.', 2, 'published'),
('safari-guide', 'Do I need a visa?', 'Most Teyezilla destinations offer an eVisa or visa-on-arrival for the majority of nationalities. Visa requirements are listed on each destination page — check well before booking, as processing times vary by country.', 3, 'published'),
('safari-guide', 'How physically demanding is a safari?', 'Most game-drive safaris require no special fitness — you''re seated in a vehicle for most of the day. Gorilla trekking is the exception and involves several hours of hiking, sometimes at altitude and over uneven terrain.', 4, 'published');
