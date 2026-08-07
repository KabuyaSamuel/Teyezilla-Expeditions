-- Per-tour/journey FAQs for AEO/GEO: staff-authored Q&A distinct from the
-- global `faqs` table (site-wide Safari Guide), which has no tour_id/
-- journey_id column. Column-identical to tour_highlights/journey_highlights,
-- so the same delete-then-reinsert sync pattern applies.

create table tour_faqs (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  question text not null,
  answer text not null,
  display_order integer default 0
);
create index on tour_faqs (tour_id);

create table journey_faqs (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  question text not null,
  answer text not null,
  display_order integer default 0
);
create index on journey_faqs (journey_id);

alter table tour_faqs enable row level security;
alter table journey_faqs enable row level security;

create policy "Public can read tour faqs" on tour_faqs for select to anon, authenticated
  using (exists (select 1 from tours t where t.id = tour_id and t.status = 'published'));
create policy "Staff can manage tour faqs" on tour_faqs for all to authenticated using (true) with check (true);

create policy "Public can read journey faqs" on journey_faqs for select to anon, authenticated
  using (exists (select 1 from journeys j where j.id = journey_id and j.status = 'published'));
create policy "Staff can manage journey faqs" on journey_faqs for all to authenticated using (true) with check (true);
