-- Separate from is_launch_destination ("live for booking" -- drives the
-- Live/Coming Soon badge and whether it appears in bookable-destination
-- lists): this controls the homepage's featured destinations section,
-- which previously had no manual control at all -- it round-robinned
-- across regions (see pickBalancedDestinations in app/(public)/page.tsx),
-- favoring launch destinations but with no way for staff to actually pick
-- which ones show. Same idea as tours.featured/journeys.featured.
alter table destinations add column featured boolean not null default false;

-- Seed launch destinations as featured so the homepage isn't suddenly
-- empty until staff manually curate this for the first time.
update destinations set featured = true where is_launch_destination = true;
