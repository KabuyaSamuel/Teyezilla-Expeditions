-- Lets an article be tagged to the country it's about, so tour/journey/
-- destination pages can surface relevant articles at the bottom (and vice
-- versa) instead of the site's content living in disconnected silos.
-- Nullable — existing/generic posts (e.g. "Africa Travel Tips") don't need
-- to pick a single destination.
alter table blog_posts add column destination_id uuid references destinations(id);
create index on blog_posts (destination_id);
