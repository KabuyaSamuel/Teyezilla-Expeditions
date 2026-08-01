-- Closes the remaining gaps from the client's product-creation spec review:
-- a Vehicle Library (parallel to the existing Activities Library), wiring
-- the already-existing (but unused) accommodations table into tours/
-- journeys, a real availability calendar for journeys (tours already had
-- tour_availability), structured per-guest info for confirmed bookings, and
-- departure assignment (guide/driver/vehicle) for operations.

-- ============ VEHICLE LIBRARY ============
-- Same shape/relationship pattern as activities: a standalone reusable
-- library plus one join table per parent.
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique not null,
  vehicle_type text,
  seats integer,
  description text,
  features text[],
  image text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table tour_vehicles (
  tour_id uuid not null references tours(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  display_order integer default 0,
  primary key (tour_id, vehicle_id)
);

create table journey_vehicles (
  journey_id uuid not null references journeys(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, vehicle_id)
);

-- ============ ACCOMMODATION LIBRARY WIRING ============
-- The `accommodations` table (destination-scoped, added in the IA redesign)
-- already has RLS and a status column but was never linked to tours/
-- journeys or exposed in admin CRUD. Same join-table pattern as activities.
create table tour_accommodations (
  tour_id uuid not null references tours(id) on delete cascade,
  accommodation_id uuid not null references accommodations(id) on delete cascade,
  display_order integer default 0,
  primary key (tour_id, accommodation_id)
);

create table journey_accommodations (
  journey_id uuid not null references journeys(id) on delete cascade,
  accommodation_id uuid not null references accommodations(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, accommodation_id)
);

-- ============ JOURNEY AVAILABILITY ============
-- tour_availability already exists (init schema); journeys never got the
-- equivalent. Same shape.
create table journey_availability (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid references journeys(id) on delete cascade,
  date date not null,
  capacity integer not null,
  booked_count integer default 0
);
create index on journey_availability (journey_id);
create index on tour_availability (tour_id);

-- ============ STRUCTURED GUEST INFO ============
-- Booking flow stays inquiry-first (aggregate adults/children captured at
-- enquiry time, per lib/admin/actions/bookings and the inquiry-based-
-- bookings migration) -- this adds the per-traveler detail staff fill in
-- once an inquiry is confirmed, not a change to the public enquiry form.
create table booking_guests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  full_name text,
  age_group text default 'adult' check (age_group in ('adult', 'child')),
  dietary_requirements text,
  passport_number text, -- optional, store encrypted at rest
  nationality text,
  display_order integer default 0
);
create index on booking_guests (booking_id);

-- ============ OPERATIONS: DEPARTURE ASSIGNMENT ============
alter table bookings
  add column assigned_guide_id uuid references staff(id) on delete set null,
  add column assigned_driver_id uuid references staff(id) on delete set null,
  add column assigned_vehicle_id uuid references vehicles(id) on delete set null;

-- ============ RLS ============
alter table vehicles enable row level security;
alter table tour_vehicles enable row level security;
alter table journey_vehicles enable row level security;
alter table tour_accommodations enable row level security;
alter table journey_accommodations enable row level security;
alter table journey_availability enable row level security;
alter table booking_guests enable row level security;

create policy "Public can read vehicles" on vehicles for select to anon, authenticated using (true);
create policy "Staff can manage vehicles" on vehicles for all to authenticated using (true) with check (true);

create policy "Public can read tour vehicles" on tour_vehicles for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour vehicles" on tour_vehicles for all to authenticated using (true) with check (true);

create policy "Public can read journey vehicles" on journey_vehicles for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey vehicles" on journey_vehicles for all to authenticated using (true) with check (true);

create policy "Public can read tour accommodations" on tour_accommodations for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour accommodations" on tour_accommodations for all to authenticated using (true) with check (true);

create policy "Public can read journey accommodations" on journey_accommodations for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey accommodations" on journey_accommodations for all to authenticated using (true) with check (true);

create policy "Public can read journey availability" on journey_availability for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey availability" on journey_availability for all to authenticated using (true) with check (true);

-- Staff-only: no public policy. Guest rosters are entered by staff after an
-- inquiry is confirmed, and bookings themselves are never publicly readable.
create policy "Staff can manage booking guests" on booking_guests for all to authenticated using (true) with check (true);

-- ============ SEED: VEHICLE LIBRARY ============
insert into vehicles (name, slug, vehicle_type, seats, description, features, display_order) values
('4x4 Safari Land Cruiser', '4x4-safari-land-cruiser', '4x4 Safari Vehicle', 7,
 'Rugged expedition-ready Land Cruiser built for long-distance safari and off-road travel.',
 array['Guaranteed window seat', 'Roof viewing hatch', 'Charging ports', 'Cooler box', 'Experienced expedition driver-guide', 'Photography support'],
 1);
