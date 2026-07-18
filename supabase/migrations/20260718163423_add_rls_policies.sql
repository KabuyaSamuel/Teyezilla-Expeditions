-- RLS is enabled by default on every table in this project (Supabase's
-- current cloud default), but no policies were ever added — so every table
-- was silently returning zero rows to both the public site (anon role) and
-- the admin dashboard (authenticated role), even though the seed data was
-- present. service_role bypasses RLS entirely, which is why direct DB
-- inspection looked fine while the app showed nothing.
--
-- Public content tables: readable by anon + authenticated, filtered to only
-- the rows meant to be public (published/approved). Everything else is
-- staff-only data, readable and writable by any authenticated user — the
-- only authenticated identity in this app is admin staff via Supabase Auth
-- (lib/admin/session.ts), so there's no separate customer-facing auth role
-- to scope further yet.

alter table destinations enable row level security;
alter table tours enable row level security;
alter table tour_availability enable row level security;
alter table blog_posts enable row level security;
alter table reviews enable row level security;
alter table customers enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;
alter table discount_codes enable row level security;
alter table media enable row level security;
alter table inquiries enable row level security;
alter table staff enable row level security;
alter table notifications enable row level security;
alter table affiliate_partners enable row level security;
alter table trip_planner_requests enable row level security;

-- ============ PUBLIC CONTENT (readable by anon + authenticated) ============

create policy "Public can read destinations"
  on destinations for select
  to anon, authenticated
  using (true);

create policy "Public can read tours"
  on tours for select
  to anon, authenticated
  using (true);

create policy "Public can read tour availability"
  on tour_availability for select
  to anon, authenticated
  using (true);

create policy "Public can read published blog posts"
  on blog_posts for select
  to anon, authenticated
  using (status = 'published');

create policy "Staff can read all blog posts"
  on blog_posts for select
  to authenticated
  using (true);

create policy "Public can read approved reviews"
  on reviews for select
  to anon, authenticated
  using (is_approved = true);

create policy "Staff can read all reviews"
  on reviews for select
  to authenticated
  using (true);

-- ============ STAFF-ONLY OPERATIONAL DATA (authenticated only) ============

create policy "Staff can manage customers"
  on customers for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage bookings"
  on bookings for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage payments"
  on payments for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage discount codes"
  on discount_codes for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage media"
  on media for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage inquiries"
  on inquiries for all
  to authenticated
  using (true) with check (true);

create policy "Staff can read their own record"
  on staff for select
  to authenticated
  using (auth.uid() = auth_user_id);

create policy "Staff can manage notifications"
  on notifications for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage affiliate partners"
  on affiliate_partners for all
  to authenticated
  using (true) with check (true);

create policy "Staff can manage trip planner requests"
  on trip_planner_requests for all
  to authenticated
  using (true) with check (true);
