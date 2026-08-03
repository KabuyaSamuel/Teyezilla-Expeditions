-- The card grid (TourCard/JourneyCard) showed short_description under the
-- title, but that field is meant to be the detail page's "Overview" prose
-- (up to 250 chars) -- a short punchy tagline is a different job. Adding a
-- dedicated column instead of overloading short_description further.
alter table tours add column tagline text;
alter table journeys add column tagline text;

-- Two existing tours are already over 250 chars (608 and 389) -- truncate
-- before adding the constraint below, or it fails on existing data.
update tours set short_description = left(short_description, 250) where char_length(short_description) > 250;

-- Hard-enforced client-side via maxLength on the textarea; this just
-- guards against anything written directly through the API/SQL editor
-- bypassing that.
alter table tours add constraint tours_short_description_length check (char_length(short_description) <= 250);
alter table journeys add constraint journeys_short_description_length check (char_length(short_description) <= 250);
