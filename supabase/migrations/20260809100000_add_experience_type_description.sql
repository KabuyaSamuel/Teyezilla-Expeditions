-- /experiences/[category] pages had no free-text field at all -- the
-- template only ever rendered `${name} tours and experiences across
-- Africa` (see app/(public)/experiences/[category]/page.tsx). At ~120
-- words of on-page text that reads as thin content to Google. Adding a
-- real description column lets each category carry unique, substantial
-- copy instead of a repeated boilerplate line.
alter table experience_types add column description text;

update experience_types set description =
  'Africa''s wildlife heartlands are why most travelers come here first: the Maasai Mara''s wildebeest migration, the Serengeti''s endless plains, and the big cats, elephants, and rhino that call them home. Our safari itineraries mix private game drives with guided walks and community-led conservancy visits, timed around each region''s calving and migration seasons so sightings are as reliable as they can be. Whether it''s a first Kenya safari or a longer Kenya-Tanzania combination, every trip is built around the specific wildlife moments you want to see, not a fixed template.'
  where slug = 'wildlife-safari';

update experience_types set description =
  'From Zanzibar''s spice-scented lanes and Stone Town''s coral-stone architecture to quieter island escapes along the Indian Ocean coast, this collection is for travelers who want white sand and turquoise water without giving up culture and history. Expect dhow sailing at sunset, reef snorkeling, and stays that range from boutique beach lodges to private villas -- paired, where it makes sense, with a few days of safari beforehand so the trip isn''t beach-only.'
  where slug = 'beach-islands';

update experience_types set description =
  'Egypt''s pyramids and temples, Morocco''s medinas and the Sahara, and Kenya''s Maasai and Samburu communities all sit under this collection -- journeys built around history and living culture rather than wildlife. Expect knowledgeable local guides, visits timed to avoid the worst of the crowds, and real engagement with the people and places behind the landmarks, from a Cairo Egyptologist to a homestay with a Maasai family in the Mara.'
  where slug = 'culture-heritage';

update experience_types set description =
  'For travelers who want Africa at a faster pace: trekking Morocco''s Atlas Mountains, crossing the Sahara by camel and 4x4, or combining a Marrakech city stay with days in the desert. These itineraries lean into physical, hands-on travel -- camping under open sky, local guides who know the terrain, and routes chosen for the experience of getting there, not just the destination.'
  where slug = 'adventure';

update experience_types set description =
  'Nairobi''s street food stalls, Marrakech''s souks and tagine kitchens, coastal Swahili cuisine in Zanzibar -- this collection is built around eating and living like a local, not just sightseeing. Expect market tours, cooking sessions with home cooks, and itineraries that build in unhurried time in cities and neighborhoods most safari-only trips skip entirely.'
  where slug = 'food-lifestyle';

update experience_types set description =
  'Beyond the safari circuit: Nairobi, Cairo, and Marrakech each have their own rhythm, and this collection is for travelers who want to spend real time in them. Expect walking tours through historic districts, local guides who live in the city rather than just pass through it, and an itinerary paced for wandering rather than checking sights off a list.'
  where slug = 'cities-local-life';
