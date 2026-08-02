-- Tours only had short_description (a one-line teaser); journeys already
-- have both short_description and overview (the longer body copy), but the
-- tour detail page only ever rendered short_description. Bringing tours up
-- to the same shape so both product types can show a distinct short
-- overview and a full description on the front end.
alter table tours add column overview text;
