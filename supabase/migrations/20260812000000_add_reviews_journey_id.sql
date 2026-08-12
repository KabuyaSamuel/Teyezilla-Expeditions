-- Reviews could only be attributed to a tour -- the admin Review form's
-- "Related Tour" dropdown had no way to link a testimonial to a
-- multi-country journey instead. No "on delete" clause, matching
-- tour_id's existing behavior: a journey with reviews attached blocks
-- deletion rather than silently orphaning them (see the friendly-error
-- handling already in lib/admin/actions/journeys.ts for exactly this).
alter table reviews add column journey_id uuid references journeys(id);
create index on reviews (journey_id);

-- A review is about one thing, never both at once -- the admin form
-- exposes a single combined tour/journey dropdown, so this just makes
-- that intent a guarantee instead of a UI-only convention.
alter table reviews add constraint reviews_tour_or_journey_check
  check (not (tour_id is not null and journey_id is not null));
