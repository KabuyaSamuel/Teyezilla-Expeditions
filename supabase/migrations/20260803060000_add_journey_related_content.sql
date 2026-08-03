-- Lets staff manually curate the "Bring This to Life" / related-content
-- section on a journey's page instead of relying solely on the
-- destination-match auto-compute in lib/journeys.ts, lib/tours.ts, and
-- lib/blog.ts. The public journey page checks these tables first and
-- falls back to the existing auto query when a journey has no manual
-- picks (see app/(public)/journeys/[slug]/page.tsx).
--
-- Separate from journey_tours (which means "included tours this journey
-- is built from") -- this is purely "show this as a suggestion", same
-- shape as journey_activities/journey_vehicles.
create table journey_related_journeys (
  journey_id uuid not null references journeys(id) on delete cascade,
  related_journey_id uuid not null references journeys(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, related_journey_id),
  check (journey_id != related_journey_id)
);
create index on journey_related_journeys (related_journey_id);

create table journey_related_tours (
  journey_id uuid not null references journeys(id) on delete cascade,
  tour_id uuid not null references tours(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, tour_id)
);
create index on journey_related_tours (tour_id);

create table journey_related_blog_posts (
  journey_id uuid not null references journeys(id) on delete cascade,
  blog_post_id uuid not null references blog_posts(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, blog_post_id)
);
create index on journey_related_blog_posts (blog_post_id);

alter table journey_related_journeys enable row level security;
alter table journey_related_tours enable row level security;
alter table journey_related_blog_posts enable row level security;

create policy "Public can read journey related journeys" on journey_related_journeys for select
  to anon, authenticated
  using (
    exists (select 1 from journeys j where j.id = journey_id and j.status = 'published')
    and exists (select 1 from journeys j2 where j2.id = related_journey_id and j2.status = 'published')
  );
create policy "Staff can manage journey related journeys" on journey_related_journeys for all
  to authenticated using (true) with check (true);

create policy "Public can read journey related tours" on journey_related_tours for select
  to anon, authenticated
  using (
    exists (select 1 from journeys j where j.id = journey_id and j.status = 'published')
    and exists (select 1 from tours t where t.id = tour_id and t.status = 'published')
  );
create policy "Staff can manage journey related tours" on journey_related_tours for all
  to authenticated using (true) with check (true);

create policy "Public can read journey related blog posts" on journey_related_blog_posts for select
  to anon, authenticated
  using (
    exists (select 1 from journeys j where j.id = journey_id and j.status = 'published')
    and exists (select 1 from blog_posts b where b.id = blog_post_id and b.status = 'published')
  );
create policy "Staff can manage journey related blog posts" on journey_related_blog_posts for all
  to authenticated using (true) with check (true);
