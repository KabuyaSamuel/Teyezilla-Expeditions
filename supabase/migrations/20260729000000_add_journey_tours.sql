-- Lets a journey reference the real tours/experiences/safaris it's built
-- from (e.g. the Kenya Signature journey's Maasai Mara leg is literally the
-- Maasai Mara Safari tour), instead of journeys and tours being two
-- disconnected catalogs. Safaris need no separate mechanism here since
-- they're just tours with product_type = 'safari'.
--
-- Deliberately not tied to specific itinerary days — the itinerary stays
-- freeform narrative text; this is a simpler "what this journey includes"
-- list, same shape as journey_activities.
create table journey_tours (
  journey_id uuid not null references journeys(id) on delete cascade,
  tour_id uuid not null references tours(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, tour_id)
);
create index on journey_tours (tour_id);

alter table journey_tours enable row level security;

-- Double-gated like collection_tours: both sides must be published for an
-- anonymous visitor to see the link, since the referenced tour can be in
-- draft independently of the journey.
create policy "Public can read journey tours" on journey_tours for select
  to anon, authenticated
  using (
    exists (select 1 from journeys j where j.id = journey_id and j.status = 'published')
    and exists (select 1 from tours t where t.id = tour_id and t.status = 'published')
  );
create policy "Staff can manage journey tours" on journey_tours for all
  to authenticated using (true) with check (true);
