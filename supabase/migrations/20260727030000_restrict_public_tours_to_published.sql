-- "Public can read tours" had no status filter (using (true)), unlike the
-- equivalent "Public can read published journeys"/collections/etc. policies
-- added later — draft tours were readable by anon via the REST API. The
-- existing "Staff can manage tours" policy (for all, to authenticated,
-- using (true)) already grants staff unrestricted access, so this only
-- tightens what anonymous visitors can see.
drop policy if exists "Public can read tours" on tours;

create policy "Public can read published tours" on tours
  for select
  to anon, authenticated
  using (status = 'published');
