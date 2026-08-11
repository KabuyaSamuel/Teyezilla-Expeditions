-- Self-hosted click tracking for the Link Generator. Previously
-- LinkGenerator.tsx was a pure client-side URL calculator -- it never
-- persisted anything, so a generated link (e.g. ?utm_source=tiktok) had no
-- record anywhere until/unless a visitor who clicked it also went on to
-- submit a booking/contact/trip-planner form (see utm_source on
-- bookings/inquiries, added in 20260807010000_add_utm_tracking.sql). A
-- click with no conversion left zero trace. This adds a real persisted
-- link (tracked_links) with its own short redirect
-- (app/go/[slug]/route.ts, not part of this migration) that logs a row
-- to link_clicks before forwarding the visitor on -- so a click is
-- recorded independent of whether it ever converts.
--
-- Both tables are staff-only (authenticated), same as booking_guests --
-- no anon policy at all. The public redirect route never needs one: it
-- runs entirely server-side and uses the service-role client to look up
-- the link and log the click, the same pattern already used for
-- anonymous inquiry/booking inserts (see app/(public)/contact/actions.ts).
create table tracked_links (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text,
  destination_path text not null,
  utm_source text not null,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

create table link_clicks (
  id uuid primary key default gen_random_uuid(),
  tracked_link_id uuid not null references tracked_links(id) on delete cascade,
  clicked_at timestamptz not null default now()
);

create index link_clicks_tracked_link_id_idx on link_clicks(tracked_link_id);

alter table tracked_links enable row level security;
alter table link_clicks enable row level security;

create policy "Staff can manage tracked links" on tracked_links for all to authenticated using (true) with check (true);
create policy "Staff can read link clicks" on link_clicks for select to authenticated using (true);
