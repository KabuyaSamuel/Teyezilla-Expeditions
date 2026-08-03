-- Lets a client select priced add-ons (tour_addons/journey_addons rows with
-- kind = 'addon' and a non-null price) when they enquire, and auto-calculates
-- what they're asking for: base_price (the product's price_from at the time
-- of enquiry) + addons_total (sum of selected add-ons) = total_amount.
--
-- Snapshotted rather than live-joined, same reasoning as loyalty ledger
-- entries and sent quotes elsewhere in this schema: an addon's price can
-- change in the admin later, and this table should keep recording what the
-- customer actually asked for and was quoted against, not what the catalog
-- says today. addon_id is intentionally not FK-constrained -- it can point
-- to either tour_addons.id or journey_addons.id depending on the booking,
-- and the snapshot columns are what everything else (emails, the admin
-- view) actually reads.
create table booking_addons (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  addon_id uuid not null,
  title text not null,
  price numeric not null check (price >= 0),
  currency text not null default 'USD',
  created_at timestamptz default now()
);
create index on booking_addons (booking_id);

alter table booking_addons enable row level security;

-- Mirrors "Anyone can create a booking enquiry" on bookings: an anonymous
-- visitor can attach add-ons only to a booking that's still a fresh inquiry
-- (never to an existing quoted/confirmed booking), and only by referencing a
-- booking_id that actually exists (no blind inserts against arbitrary ids).
create policy "Anyone can add addons to their own booking enquiry" on booking_addons
  for insert
  with check (
    exists (select 1 from bookings b where b.id = booking_id and b.booking_status = 'inquiry')
  );

create policy "Staff can manage booking addons" on booking_addons for all
  to authenticated using (true) with check (true);

alter table bookings add column base_price numeric;
alter table bookings add column addons_total numeric default 0;
