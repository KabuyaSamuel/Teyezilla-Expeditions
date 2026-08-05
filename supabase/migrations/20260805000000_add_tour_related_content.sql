-- Tour equivalent of journey_related_* (20260803060000_add_journey_related_content.sql)
-- -- lets staff manually curate the "Bring This to Life" section on a
-- tour's page instead of relying solely on the destination-match
-- auto-compute. The public tour page checks these tables first and falls
-- back to the existing auto query when a tour has no manual picks (see
-- app/(public)/tours/[slug]/page.tsx).
create table tour_related_journeys (
  tour_id uuid not null references tours(id) on delete cascade,
  related_journey_id uuid not null references journeys(id) on delete cascade,
  display_order integer default 0,
  primary key (tour_id, related_journey_id)
);
create index on tour_related_journeys (related_journey_id);

-- Self-referencing (both columns point at tours), so joins that need a
-- specific direction disambiguate via !tour_related_tours_tour_id_fkey,
-- mirroring journey_related_journeys.
create table tour_related_tours (
  tour_id uuid not null references tours(id) on delete cascade,
  related_tour_id uuid not null references tours(id) on delete cascade,
  display_order integer default 0,
  primary key (tour_id, related_tour_id),
  check (tour_id != related_tour_id)
);
create index on tour_related_tours (related_tour_id);

create table tour_related_blog_posts (
  tour_id uuid not null references tours(id) on delete cascade,
  blog_post_id uuid not null references blog_posts(id) on delete cascade,
  display_order integer default 0,
  primary key (tour_id, blog_post_id)
);
create index on tour_related_blog_posts (blog_post_id);

alter table tour_related_journeys enable row level security;
alter table tour_related_tours enable row level security;
alter table tour_related_blog_posts enable row level security;

create policy "Public can read tour related journeys" on tour_related_journeys for select
  to anon, authenticated
  using (
    exists (select 1 from tours t where t.id = tour_id and t.status = 'published')
    and exists (select 1 from journeys j where j.id = related_journey_id and j.status = 'published')
  );
create policy "Staff can manage tour related journeys" on tour_related_journeys for all
  to authenticated using (true) with check (true);

create policy "Public can read tour related tours" on tour_related_tours for select
  to anon, authenticated
  using (
    exists (select 1 from tours t1 where t1.id = tour_id and t1.status = 'published')
    and exists (select 1 from tours t2 where t2.id = related_tour_id and t2.status = 'published')
  );
create policy "Staff can manage tour related tours" on tour_related_tours for all
  to authenticated using (true) with check (true);

create policy "Public can read tour related blog posts" on tour_related_blog_posts for select
  to anon, authenticated
  using (
    exists (select 1 from tours t where t.id = tour_id and t.status = 'published')
    and exists (select 1 from blog_posts b where b.id = blog_post_id and b.status = 'published')
  );
create policy "Staff can manage tour related blog posts" on tour_related_blog_posts for all
  to authenticated using (true) with check (true);
