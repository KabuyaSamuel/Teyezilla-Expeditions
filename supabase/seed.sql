-- Teyezilla Expeditions: Seed Data
-- Run this AFTER schema.sql to populate a fresh Supabase project with the
-- site's real launch content. The app reads exclusively from these tables
-- (see lib/*.ts and lib/admin/data/*.ts); there is no hardcoded fallback
-- data left in the codebase, so an unseeded database renders empty pages.

insert into destinations (country_name, slug, flag_emoji, hero_image, short_description, overview, best_time_to_visit, visa_info, is_launch_destination, meta_title, meta_description, og_image) values
('Kenya', 'kenya', '🇰🇪', 'https://picsum.photos/seed/kenya-hero/1200/800', 'Big-five safaris, the Maasai Mara, and Nairobi''s vibrant food and city culture.', 'Kenya is the heartbeat of East African safari travel, home to the Maasai Mara''s great wildebeest migration and a Nairobi food scene that rewards the curious traveler.', 'July to October for the wildebeest migration.', 'eVisa required for most nationalities, apply online before travel.', true, 'Kenya Safari Tours & Travel Guide | Teyezilla Expeditions', 'Plan your Kenya safari with Teyezilla Expeditions: Maasai Mara, Amboseli, Nairobi city and food tours, and more.', 'https://picsum.photos/seed/kenya-og/1200/800'),
('Tanzania', 'tanzania', '🇹🇿', 'https://picsum.photos/seed/tanzania-hero/1200/800', 'The Serengeti, Ngorongoro Crater, and the roof of Africa at Kilimanjaro.', 'Tanzania pairs the endless plains of the Serengeti with the natural amphitheater of Ngorongoro Crater and the challenge of Kilimanjaro.', 'June to October, dry season.', 'eVisa available online for most nationalities.', true, 'Tanzania Safari Tours | Serengeti & Kilimanjaro | Teyezilla', 'Serengeti safaris, Ngorongoro Crater tours, and Kilimanjaro treks with Teyezilla Expeditions.', 'https://picsum.photos/seed/tanzania-og/1200/800'),
('Zanzibar', 'zanzibar', '🏝️', 'https://picsum.photos/seed/zanzibar-hero/1200/800', 'White-sand beaches, Stone Town''s spice-scented alleys, and Mnemba Island diving.', 'Zanzibar is the beach-and-culture pairing at the end of a mainland safari, with Stone Town''s UNESCO old quarter and Mnemba Island''s reef diving.', 'June to October, and December to February.', 'Covered under the Tanzania eVisa.', true, 'Zanzibar Beach Holidays & Stone Town Tours | Teyezilla', 'Zanzibar beach escapes, Stone Town tours, and Mnemba Island experiences with Teyezilla Expeditions.', 'https://picsum.photos/seed/zanzibar-og/1200/800'),
('Egypt', 'egypt', '🇪🇬', 'https://picsum.photos/seed/egypt-hero/1200/800', 'The Pyramids of Giza, Nile cruises, and the temples of Luxor.', 'Egypt''s ancient wonders span the Pyramids of Giza, the temple-lined banks of Luxor, and multi-day Nile cruises between them.', 'October to April, outside peak summer heat.', 'eVisa or visa on arrival for most nationalities.', true, 'Egypt Tours: Pyramids, Nile Cruises & Luxor | Teyezilla', 'Pyramids of Giza tours, Nile cruises, and Luxor temple visits with Teyezilla Expeditions.', 'https://picsum.photos/seed/egypt-og/1200/800'),
('Morocco', 'morocco', '🇲🇦', 'https://picsum.photos/seed/morocco-hero/1200/800', 'Marrakech''s souks, the blue city of Chefchaouen, and Sahara desert camps.', 'Morocco moves from Marrakech''s medina to the blue-washed streets of Chefchaouen and out into Sahara desert camps under open sky.', 'March to May, and September to November.', 'Visa-free for many nationalities for stays under 90 days.', true, 'Morocco Desert Tours: Marrakech, Chefchaouen & Sahara | Teyezilla', 'Marrakech city tours, Chefchaouen day trips, and Sahara desert camps with Teyezilla Expeditions.', 'https://picsum.photos/seed/morocco-og/1200/800'),
('Rwanda', 'rwanda', '🇷🇼', 'https://picsum.photos/seed/rwanda-hero/1200/800', 'Mountain gorilla trekking in the Virunga highlands.', 'Coming soon to Teyezilla Expeditions.', 'June to September.', 'eVisa available online.', false, 'Rwanda Gorilla Trekking Tours | Teyezilla Expeditions', 'Mountain gorilla trekking tours in Rwanda, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/rwanda-og/1200/800'),
('Uganda', 'uganda', '🇺🇬', 'https://picsum.photos/seed/uganda-hero/1200/800', 'The Pearl of Africa: gorillas, chimps, and the source of the Nile.', 'Coming soon to Teyezilla Expeditions.', 'December to February, and June to August.', 'eVisa available online.', false, 'Uganda Safari & Gorilla Tours | Teyezilla Expeditions', 'Uganda safaris and gorilla trekking, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/uganda-og/1200/800'),
('South Africa', 'south-africa', '🇿🇦', 'https://picsum.photos/seed/south-africa-hero/1200/800', 'Cape Town, the Garden Route, and Kruger safaris.', 'Coming soon to Teyezilla Expeditions.', 'May to September for safari.', 'Visa-free for many nationalities for short stays.', false, 'South Africa Safari & Cape Town Tours | Teyezilla Expeditions', 'South Africa safaris and Cape Town tours, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/south-africa-og/1200/800'),
('Botswana', 'botswana', '🇧🇼', 'https://picsum.photos/seed/botswana-hero/1200/800', 'The Okavango Delta and exclusive low-impact safaris.', 'Coming soon to Teyezilla Expeditions.', 'May to October.', 'Visa-free for many nationalities for short stays.', false, 'Botswana Okavango Delta Safaris | Teyezilla Expeditions', 'Okavango Delta safaris in Botswana, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/botswana-og/1200/800'),
('Zambia', 'zambia', '🇿🇲', 'https://picsum.photos/seed/zambia-hero/1200/800', 'Victoria Falls and walking safaris in South Luangwa.', 'Coming soon to Teyezilla Expeditions.', 'May to October.', 'eVisa available online.', false, 'Zambia Safari & Victoria Falls Tours | Teyezilla Expeditions', 'Zambia walking safaris and Victoria Falls tours, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/zambia-og/1200/800'),
('Zimbabwe', 'zimbabwe', '🇿🇼', 'https://picsum.photos/seed/zimbabwe-hero/1200/800', 'Victoria Falls, Hwange National Park, and Great Zimbabwe.', 'Coming soon to Teyezilla Expeditions.', 'May to October.', 'eVisa available online.', false, 'Zimbabwe Safari Tours | Teyezilla Expeditions', 'Zimbabwe safaris and Victoria Falls tours, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/zimbabwe-og/1200/800');

-- Tours reference destinations by id, which is easiest to do with a lookup
-- subquery on slug so this script doesn't depend on knowing generated UUIDs.
insert into tours (destination_id, title, slug, category_label, hero_image, short_description, duration_days, price_from, currency, difficulty, featured, status, meta_title, meta_description, og_image) values
((select id from destinations where slug = 'kenya'), 'Maasai Mara Safari', 'maasai-mara-safari', 'Safari', 'https://picsum.photos/seed/maasai-mara/1200/800', 'Track the big five across the Mara''s open plains.', 4, 950, 'USD', 'Easy', true, 'published', 'Maasai Mara Safari Tour | Teyezilla Expeditions', '4-day Maasai Mara safari tracking the big five, from $950 per person.', 'https://picsum.photos/seed/maasai-mara-og/1200/800'),
((select id from destinations where slug = 'tanzania'), 'Serengeti Safari', 'serengeti-safari', 'Safari', 'https://picsum.photos/seed/serengeti/1200/800', 'Follow the great migration across endless plains.', 5, 1200, 'USD', 'Easy', true, 'published', 'Serengeti Safari Tour | Teyezilla Expeditions', '5-day Serengeti safari following the great migration, from $1,200 per person.', 'https://picsum.photos/seed/serengeti-og/1200/800'),
((select id from destinations where slug = 'zanzibar'), 'Zanzibar Beach Escape', 'zanzibar-beach-escape', 'Beach', 'https://picsum.photos/seed/zanzibar-beach/1200/800', 'Stone Town culture followed by island beach time.', 6, 780, 'USD', 'Easy', true, 'published', 'Zanzibar Beach Escape | Teyezilla Expeditions', '6-day Zanzibar beach escape combining Stone Town and island beach time, from $780.', 'https://picsum.photos/seed/zanzibar-beach-og/1200/800'),
((select id from destinations where slug = 'egypt'), 'Pyramids of Giza Tour', 'pyramids-of-giza-tour', 'Culture', 'https://picsum.photos/seed/pyramids/1200/800', 'Stand before the last surviving ancient wonder.', 3, 520, 'USD', 'Easy', true, 'published', 'Pyramids of Giza Tour | Teyezilla Expeditions', '3-day Pyramids of Giza tour including the Sphinx and Egyptian Museum, from $520.', 'https://picsum.photos/seed/pyramids-og/1200/800'),
((select id from destinations where slug = 'morocco'), 'Marrakech & Sahara Desert', 'marrakech-sahara-desert', 'Desert', 'https://picsum.photos/seed/sahara/1200/800', 'Medina souks to overnight desert camps under the stars.', 4, 610, 'USD', 'Moderate', true, 'published', 'Marrakech & Sahara Desert Tour | Teyezilla Expeditions', '4-day Marrakech and Sahara desert tour with overnight desert camp, from $610.', 'https://picsum.photos/seed/sahara-og/1200/800'),
((select id from destinations where slug = 'kenya'), 'Nairobi Street Food Tour', 'nairobi-street-food-tour', 'Food', 'https://picsum.photos/seed/nairobi-food/1200/800', 'Taste Nairobi''s markets and street-food institutions.', 1, 65, 'USD', 'Easy', true, 'published', 'Nairobi Street Food Tour | Teyezilla Expeditions', 'Half-day Nairobi street food tour through the city''s best markets, from $65.', 'https://picsum.photos/seed/nairobi-food-og/1200/800'),
((select id from destinations where slug = 'kenya'), 'Tuk Tuk Experience', 'tuk-tuk-experience', 'City', 'https://picsum.photos/seed/tuk-tuk/1200/800', 'See Nairobi from the back of a three-wheeler.', 1, 40, 'USD', 'Easy', true, 'published', 'Nairobi Tuk Tuk Experience | Teyezilla Expeditions', 'Tuk tuk city tour of Nairobi, from $40 per person.', 'https://picsum.photos/seed/tuk-tuk-og/1200/800'),
((select id from destinations where slug = 'kenya'), 'Boda Boda Experience', 'boda-boda-experience', 'City', 'https://picsum.photos/seed/boda-boda/1200/800', 'A local''s-eye view of Nairobi by motorbike.', 1, 35, 'USD', 'Easy', true, 'published', 'Nairobi Boda Boda Experience | Teyezilla Expeditions', 'Guided boda boda motorbike tour of Nairobi, from $35 per person.', 'https://picsum.photos/seed/boda-boda-og/1200/800');

insert into reviews (tour_id, author_name, source, rating, quote, is_approved) values
((select id from tours where slug = 'maasai-mara-safari'), 'Amara O.', 'TripAdvisor', 5, 'Our Maasai Mara safari was flawlessly organized from the airport pickup to the last game drive.', true),
((select id from tours where slug = 'zanzibar-beach-escape'), 'Daniel K.', 'Google', 5, 'The Zanzibar beach escape struck the perfect balance between Stone Town culture and beach downtime.', true),
((select id from tours where slug = 'pyramids-of-giza-tour'), 'Priya S.', 'GetYourGuide', 5, 'Our guide''s knowledge of the pyramids and Egyptian history made the whole day come alive.', true);

-- ============ IA REDESIGN: REGIONS, JOURNEYS, EXPERIENCE TYPES, COLLECTIONS, SAFARI THEMES, FAQS ============
-- Mirrors the seed block in supabase/migrations/20260723000000_ia_redesign_schema.sql
-- so a fresh install matches the live database.

insert into regions (name, slug, description, display_order) values
('East Africa', 'east-africa', 'Kenya, Tanzania, Zanzibar, Uganda, and Rwanda: the classic safari heartland.', 1),
('North Africa', 'north-africa', 'Egypt and Morocco: ancient wonders and desert landscapes.', 2),
('Southern Africa', 'southern-africa', 'South Africa, Namibia, Botswana, Zambia, and Zimbabwe: dramatic wilderness and world-class safaris.', 3),
('Indian Ocean', 'indian-ocean', 'Zanzibar, Mauritius, and Seychelles: white-sand islands off Africa''s coast.', 4);

insert into destinations (country_name, slug, flag_emoji, hero_image, short_description, overview, best_time_to_visit, visa_info, is_launch_destination, meta_title, meta_description, og_image) values
('Namibia', 'namibia', '🇳🇦', 'https://picsum.photos/seed/namibia-hero/1200/800', 'The red dunes of Sossusvlei and the wildlife of Etosha National Park.', 'Coming soon to Teyezilla Expeditions.', 'May to October.', 'eVisa available online.', false, 'Namibia Safari & Desert Tours | Teyezilla Expeditions', 'Namibia desert and safari tours, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/namibia-og/1200/800'),
('Mauritius', 'mauritius', '🇲🇺', 'https://picsum.photos/seed/mauritius-hero/1200/800', 'Turquoise lagoons and white-sand beaches in the Indian Ocean.', 'Coming soon to Teyezilla Expeditions.', 'May to December.', 'Visa-free for many nationalities for short stays.', false, 'Mauritius Beach Holidays | Teyezilla Expeditions', 'Mauritius island escapes, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/mauritius-og/1200/800'),
('Seychelles', 'seychelles', '🇸🇨', 'https://picsum.photos/seed/seychelles-hero/1200/800', 'Granite islands, coral reefs, and some of the world''s most secluded beaches.', 'Coming soon to Teyezilla Expeditions.', 'April to May, and October to November.', 'Visa-free for most nationalities for short stays.', false, 'Seychelles Island Escapes | Teyezilla Expeditions', 'Seychelles island getaways, coming soon to Teyezilla Expeditions.', 'https://picsum.photos/seed/seychelles-og/1200/800');

insert into destination_regions (destination_id, region_id)
select d.id, r.id from destinations d, regions r where d.slug = 'kenya' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'tanzania' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zanzibar' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'uganda' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'rwanda' and r.slug = 'east-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'egypt' and r.slug = 'north-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'morocco' and r.slug = 'north-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'south-africa' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'namibia' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'botswana' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zambia' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zimbabwe' and r.slug = 'southern-africa'
union all select d.id, r.id from destinations d, regions r where d.slug = 'zanzibar' and r.slug = 'indian-ocean'
union all select d.id, r.id from destinations d, regions r where d.slug = 'mauritius' and r.slug = 'indian-ocean'
union all select d.id, r.id from destinations d, regions r where d.slug = 'seychelles' and r.slug = 'indian-ocean';

insert into journey_types (name, slug, description) values
('Signature Journeys', 'signature-journeys', 'Teyezilla''s flagship itineraries.'),
('Multi-Country Expeditions', 'multi-country-expeditions', 'Journeys spanning more than one African country.'),
('Luxury Journeys', 'luxury-journeys', 'High-end travel experiences.'),
('Family Journeys', 'family-journeys', 'Family and multi-generational travel.'),
('Honeymoon Journeys', 'honeymoon-journeys', 'Romantic safari and beach journeys.'),
('Private Journeys', 'private-journeys', 'Exclusive journeys for individuals and groups.');

insert into experience_types (name, slug, display_order) values
('Wildlife & Safari', 'wildlife-safari', 1),
('Beach & Islands', 'beach-islands', 2),
('Culture & Heritage', 'culture-heritage', 3),
('Adventure', 'adventure', 4),
('Food & Lifestyle', 'food-lifestyle', 5),
('Cities & Local Life', 'cities-local-life', 6);

insert into tour_experience_types (tour_id, experience_type_id)
select t.id, et.id from tours t, experience_types et where t.slug in ('maasai-mara-safari', 'serengeti-safari') and et.slug = 'wildlife-safari'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'zanzibar-beach-escape' and et.slug = 'beach-islands'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'pyramids-of-giza-tour' and et.slug = 'culture-heritage'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'marrakech-sahara-desert' and et.slug = 'adventure'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'marrakech-sahara-desert' and et.slug = 'culture-heritage'
union all select t.id, et.id from tours t, experience_types et where t.slug = 'nairobi-street-food-tour' and et.slug = 'food-lifestyle'
union all select t.id, et.id from tours t, experience_types et where t.slug in ('tuk-tuk-experience', 'boda-boda-experience') and et.slug = 'cities-local-life';

insert into safari_themes (name, slug, description, display_order) values
('Great Migration', 'great-migration', 'Follow the wildebeest migration across the Serengeti and Maasai Mara.', 1),
('Big Five', 'big-five', 'Track lion, leopard, elephant, buffalo, and rhino.', 2),
('Gorilla Trekking', 'gorilla-trekking', 'Trek to see mountain gorillas in Rwanda and Uganda.', 3),
('Conservation', 'conservation', 'Safaris that directly support wildlife conservation efforts.', 4);

insert into tour_safari_themes (tour_id, safari_theme_id)
select t.id, st.id from tours t, safari_themes st where t.slug = 'maasai-mara-safari' and st.slug = 'big-five'
union all select t.id, st.id from tours t, safari_themes st where t.slug = 'serengeti-safari' and st.slug = 'great-migration';

insert into collections (name, slug, description, display_order, status) values
('The Wild', 'the-wild', 'Wildlife & safari journeys across Africa''s greatest reserves.', 1, 'published'),
('The Ocean', 'the-ocean', 'Beach and island escapes along Africa''s coastlines.', 2, 'published'),
('The Heritage', 'the-heritage', 'Culture and history, from ancient wonders to living traditions.', 3, 'published'),
('The Adventure', 'the-adventure', 'Expeditions and exploration for the adventurous traveler.', 4, 'published'),
('The Romance', 'the-romance', 'Honeymoons and romantic escapes.', 5, 'draft'),
('The Family', 'the-family', 'Family and multi-generational journeys.', 6, 'draft'),
('The Private', 'the-private', 'Exclusive, bespoke travel for individuals and groups.', 7, 'draft');

insert into collection_tours (collection_id, tour_id)
select c.id, t.id from collections c, tours t where c.slug = 'the-wild' and t.slug in ('maasai-mara-safari', 'serengeti-safari')
union all select c.id, t.id from collections c, tours t where c.slug = 'the-ocean' and t.slug = 'zanzibar-beach-escape'
union all select c.id, t.id from collections c, tours t where c.slug = 'the-heritage' and t.slug = 'pyramids-of-giza-tour'
union all select c.id, t.id from collections c, tours t where c.slug = 'the-adventure' and t.slug = 'marrakech-sahara-desert';

insert into faqs (category, question, answer, display_order, status) values
('safari-guide', 'When is the best time to go on safari?', 'It depends on the destination: Kenya and Tanzania are best July to October for the wildebeest migration, while Rwanda and Uganda gorilla trekking is best in the dry seasons of June to September and December to February. Check the "Best Time to Visit" section on each destination page for specifics.', 1, 'published'),
('safari-guide', 'What should I pack for a safari?', 'Neutral-colored, breathable clothing, a warm layer for early morning game drives, comfortable closed shoes, sunscreen, a hat, and binoculars. Avoid bright colors and camouflage patterns.', 2, 'published'),
('safari-guide', 'Do I need a visa?', 'Most Teyezilla destinations offer an eVisa or visa-on-arrival for the majority of nationalities. Visa requirements are listed on each destination page; check well before booking, as processing times vary by country.', 3, 'published'),
('safari-guide', 'How physically demanding is a safari?', 'Most game-drive safaris require no special fitness; you''re seated in a vehicle for most of the day. Gorilla trekking is the exception and involves several hours of hiking, sometimes at altitude and over uneven terrain.', 4, 'published');

-- ============ PRODUCTS ENRICHMENT: ACTIVITIES LIBRARY ============
-- Mirrors the seed block in supabase/migrations/20260726000000_products_enrichment_schema.sql.
insert into activities (name, slug, description, display_order) values
('Game Drive', 'game-drive', 'Guided wildlife viewing by 4x4 safari vehicle.', 1),
('Guided Nature Walk', 'guided-nature-walk', 'On-foot exploration with a local guide.', 2),
('Cultural Village Visit', 'cultural-village-visit', 'A guided visit to a local community.', 3),
('Sunset Dhow Sail', 'sunset-dhow-sail', 'Traditional dhow sailing at golden hour.', 4),
('Spice Farm Tour', 'spice-farm-tour', 'Guided tour through a working spice plantation.', 5),
('Snorkelling', 'snorkelling', 'Guided snorkelling in reef or lagoon waters.', 6),
('Private Bush Dining', 'private-bush-dining', 'An intimate dining setup in the wilderness.', 7);

-- ============ CUSTOMERS ============
insert into customers (id, full_name, email, phone, nationality, emergency_contact, notes, loyalty_points, created_at) values
('11111111-1111-1111-1111-111111111111', 'Amara Okafor', 'amara.okafor@example.com', '+234 803 555 0101', 'Nigerian', 'Chidi Okafor, +234 803 555 0199', 'Prefers window seats on game drives.', 320, '2026-01-14'),
('22222222-2222-2222-2222-222222222222', 'Daniel Kessler', 'daniel.kessler@example.com', '+49 170 555 0110', 'German', 'Lena Kessler, +49 170 555 0111', 'Vegetarian, travels with a DSLR kit.', 150, '2026-02-02'),
('33333333-3333-3333-3333-333333333333', 'Priya Sharma', 'priya.sharma@example.com', '+91 98200 55011', 'Indian', 'Raj Sharma, +91 98200 55012', 'Booked as part of a group of 6.', 480, '2026-03-21'),
('44444444-4444-4444-4444-444444444444', 'Michael Thompson', 'michael.t@example.com', '+1 415 555 0142', 'American', 'Sarah Thompson, +1 415 555 0143', 'First-time safari traveler.', 60, '2026-04-09'),
('55555555-5555-5555-5555-555555555555', 'Fatima Al-Sayed', 'fatima.alsayed@example.com', '+20 100 555 0177', 'Egyptian', 'Omar Al-Sayed, +20 100 555 0178', 'Returning customer, 3rd booking.', 890, '2025-11-30');

-- ============ BOOKINGS ============
insert into bookings (booking_reference, customer_id, tour_id, travel_date, traveler_count, total_amount, deposit_amount, currency, payment_status, booking_status, created_at) values
('TZ-10231', '11111111-1111-1111-1111-111111111111', (select id from tours where slug = 'maasai-mara-safari'), '2026-08-14', 2, 1900, 500, 'USD', 'deposit_received', 'confirmed', '2026-06-02'),
('TZ-10232', '22222222-2222-2222-2222-222222222222', (select id from tours where slug = 'serengeti-safari'), '2026-09-02', 1, 1200, 1200, 'USD', 'paid', 'confirmed', '2026-06-15'),
('TZ-10233', '33333333-3333-3333-3333-333333333333', (select id from tours where slug = 'marrakech-sahara-desert'), '2026-10-05', 6, 3660, 900, 'USD', 'deposit_received', 'quoted', '2026-07-01'),
('TZ-10234', '44444444-4444-4444-4444-444444444444', (select id from tours where slug = 'pyramids-of-giza-tour'), '2026-07-28', 2, 1040, 0, 'USD', 'unpaid', 'inquiry', '2026-07-10'),
('TZ-10235', '55555555-5555-5555-5555-555555555555', (select id from tours where slug = 'zanzibar-beach-escape'), '2026-06-20', 2, 1560, 1560, 'USD', 'paid', 'completed', '2026-05-01'),
('TZ-10236', '11111111-1111-1111-1111-111111111111', (select id from tours where slug = 'nairobi-street-food-tour'), '2026-08-15', 2, 130, 0, 'USD', 'unpaid', 'cancelled', '2026-06-03');

-- ============ PAYMENTS ============
insert into payments (booking_id, provider, provider_reference, amount, currency, status, created_at) values
((select id from bookings where booking_reference = 'TZ-10231'), 'stripe', 'pi_3P8x...', 500, 'USD', 'succeeded', '2026-06-02'),
((select id from bookings where booking_reference = 'TZ-10232'), 'mpesa', 'QK7T8H2X', 1200, 'USD', 'succeeded', '2026-06-15'),
((select id from bookings where booking_reference = 'TZ-10233'), 'paypal', 'PAYID-M8..', 900, 'USD', 'succeeded', '2026-07-01'),
((select id from bookings where booking_reference = 'TZ-10235'), 'bank_transfer', 'REF-88213', 1560, 'USD', 'succeeded', '2026-05-01'),
((select id from bookings where booking_reference = 'TZ-10236'), 'stripe', 'pi_3P9y...', 130, 'USD', 'refunded', '2026-06-05');

-- ============ INQUIRIES ============
insert into inquiries (customer_name, customer_email, source, tour_id, message, status, created_at) values
('Laila Haddad', 'laila.h@example.com', 'whatsapp', (select id from tours where slug = 'marrakech-sahara-desert'), 'Is the Sahara camp suitable for a 70-year-old traveler?', 'in_progress', '2026-07-14'),
('Tom Reilly', 'tom.reilly@example.com', 'ai_trip_planner', null, '10-day Kenya + Zanzibar combo, budget $3,500, 2 travelers, mid-range luxury.', 'new', '2026-07-16'),
('Chen Wei', 'chen.wei@example.com', 'contact_form', (select id from tours where slug = 'pyramids-of-giza-tour'), 'Can you add a private guide for our group of 4?', 'quoted', '2026-07-11'),
('Sofia Rossi', 'sofia.rossi@example.com', 'website', (select id from tours where slug = 'zanzibar-beach-escape'), 'Do you have availability the last week of September?', 'new', '2026-07-17');

-- ============ AI TRIP PLANNER REQUESTS ============
insert into trip_planner_requests (customer_name, customer_email, destination, budget_usd, days, travelers, travel_style, luxury_level, ai_suggested_itinerary, status, created_at) values
('Tom Reilly', 'tom.reilly@example.com', 'Kenya + Zanzibar', 3500, 10, 2, 'Relaxed', 'Mid-range', 'Day 1-4: Maasai Mara safari. Day 5: Fly to Zanzibar. Day 6-10: Stone Town + beach at Nungwi.', 'new', '2026-07-16'),
('Elena Petrova', 'elena.p@example.com', 'Morocco', 1800, 6, 2, 'Culture-focused', 'Boutique', 'Day 1-2: Marrakech medina and food tour. Day 3: Chefchaouen day trip. Day 4-5: Sahara desert camp. Day 6: Return to Marrakech.', 'quoted', '2026-07-09');

-- ============ COUPONS ============
insert into discount_codes (code, discount_type, discount_value, is_referral, usage_limit, used_count, expires_at) values
('SAFARI10', 'percentage', 10, false, 200, 84, '2026-12-31'),
('ZANZIBAR50', 'fixed', 50, false, 100, 22, '2026-09-30'),
('REFERAMARA', 'percentage', 15, true, 50, 6, '2027-01-01'),
('GROUP6PLUS', 'percentage', 12, false, 999, 14, '2026-11-30');

-- ============ MEDIA ============
insert into media (file_url, file_type, alt_text, tags, uploaded_at) values
('https://picsum.photos/seed/kenya-hero/1200/800', 'image', 'Maasai Mara plains at sunrise', array['kenya', 'safari'], '2026-05-10'),
('https://picsum.photos/seed/sahara/1200/800', 'image', 'Sahara desert dunes at dusk', array['morocco', 'desert'], '2026-05-12'),
('https://picsum.photos/seed/pyramids/1200/800', 'image', 'Pyramids of Giza', array['egypt', 'pyramids'], '2026-05-14'),
('/brochures/kenya-safari-brochure.pdf', 'pdf', 'Kenya Safari Brochure 2026', array['kenya', 'brochure'], '2026-06-01');

-- ============ NOTIFICATIONS ============
insert into notifications (type, message, is_read, created_at) values
('new_booking', 'New booking TZ-10234 for Pyramids of Giza Tour.', false, '2026-07-17T09:20:00Z'),
('payment_confirmed', 'Payment confirmed for TZ-10232 via M-Pesa.', false, '2026-07-16T14:05:00Z'),
('follow_up', 'Inquiry from Sofia Rossi needs a follow-up.', true, '2026-07-15T11:40:00Z'),
('tour_reminder', 'Maasai Mara Safari (TZ-10231) departs in 4 weeks; confirm guide assignment.', false, '2026-07-14T08:00:00Z');

-- ============ AFFILIATE PARTNERS ============
insert into affiliate_partners (name, status, commission_rate, notes) values
('Viator', 'not_connected', null, 'Planned for post-launch.'),
('GetYourGuide', 'not_connected', null, 'Reviews already pulled in on the public site; booking sync is future work.'),
('Booking.com', 'not_connected', null, 'For accommodation bundling, future phase.'),
('Expedia', 'not_connected', null, 'Not prioritized for launch.'),
('Klook', 'not_connected', null, 'Not prioritized for launch.');

-- ============ BLOG POSTS (admin-managed metadata) ============
-- The public /blog pages currently hold their own article bodies directly in
-- the page code; these rows exist so Blog Management has real records to
-- edit/publish/schedule against. See lib/admin/data/blog.ts for details.
insert into blog_posts (title, slug, category, tags, meta_title, meta_description, hero_image, status, published_at, excerpt, answer, body, author_name) values
('Best Safari in Kenya', 'best-safari-in-kenya', 'Safari Guides', array['kenya','safari'], 'Best Safari in Kenya | Teyezilla Expeditions', 'The best Kenya safari for first-time visitors.', 'https://picsum.photos/seed/blog-kenya/800/500', 'published', '2026-05-01', 'Where to go and when, for a first Kenyan safari.', 'The best safari in Kenya for most first-time visitors is a 4 to 5 day Maasai Mara safari, ideally timed for the July to October wildebeest migration.', 'Kenya''s Maasai Mara is the country''s flagship reserve, known for consistent big-five sightings and, from July to October, the great wildebeest migration crossing the Mara River. Pairing it with a 1-2 day Amboseli extension adds close-up elephant viewing with Kilimanjaro as a backdrop.', 'Teyezilla Travel Team'),
('Kenya vs Tanzania Safari', 'kenya-vs-tanzania-safari', 'Comparisons', array['kenya','tanzania'], 'Kenya vs Tanzania Safari | Teyezilla Expeditions', 'How the two classic safari countries compare.', 'https://picsum.photos/seed/blog-comparison/800/500', 'published', '2026-05-10', 'How the two classic safari countries compare.', 'Kenya''s Maasai Mara offers easier access and shorter flights from Nairobi, while Tanzania''s Serengeti and Ngorongoro Crater cover a larger, more remote wilderness across a longer trip.', 'Choosing between Kenya and Tanzania often comes down to time and budget. Kenya''s Maasai Mara sits close to Nairobi, making it ideal for shorter trips. Tanzania''s Serengeti and Ngorongoro Crater require more travel time between parks but reward visitors with a wider, less crowded range of terrain and wildlife density.', 'Teyezilla Travel Team'),
('Best Time to Visit Zanzibar', 'best-time-to-visit-zanzibar', 'Travel Tips', array['zanzibar'], 'Best Time to Visit Zanzibar | Teyezilla Expeditions', 'Seasons, weather, and when to book.', 'https://picsum.photos/seed/blog-zanzibar/800/500', 'published', '2026-05-18', 'Seasons, weather, and when to book.', 'The best time to visit Zanzibar is June to October, the dry season, or December to February, a warmer secondary dry window.', 'Zanzibar has two dry seasons: June to October and December to February. The long rains fall from March to May and are worth avoiding for a beach-focused trip, though prices and crowds are both lower during that window for travelers with flexibility.', 'Teyezilla Travel Team'),
('Egypt Travel Guide', 'egypt-travel-guide', 'Destination Guides', array['egypt'], 'Egypt Travel Guide | Teyezilla Expeditions', 'Pyramids, Nile cruises, and Luxor, planned out.', 'https://picsum.photos/seed/blog-egypt/800/500', 'published', '2026-06-02', 'Pyramids, Nile cruises, and Luxor, planned out.', 'A first Egypt trip typically covers 3 days in Cairo for the Pyramids and museums, followed by a 3 to 4 day Nile cruise between Luxor and Aswan.', 'Cairo anchors most Egypt itineraries with the Pyramids of Giza, the Sphinx, and the Egyptian Museum. From there, a Nile cruise connects Luxor''s Valley of the Kings and Karnak Temple with Aswan''s Philae Temple and Nubian villages.', 'Teyezilla Travel Team'),
('Morocco Travel Guide', 'morocco-travel-guide', 'Destination Guides', array['morocco'], 'Morocco Travel Guide | Teyezilla Expeditions', 'Marrakech, Chefchaouen, and the Sahara.', 'https://picsum.photos/seed/blog-morocco/800/500', 'published', '2026-06-14', 'Marrakech, Chefchaouen, and the Sahara.', 'A classic Morocco itinerary runs Marrakech to Chefchaouen to a Sahara desert camp over 5 to 7 days.', 'Marrakech''s medina and souks are the natural starting point for a Morocco trip. From there, travelers head north to the blue-washed streets of Chefchaouen, or east toward Merzouga for an overnight Sahara desert camp under the stars.', 'Teyezilla Travel Team'),
('Africa Travel Tips', 'africa-travel-tips', 'Travel Tips', array['general'], 'Africa Travel Tips | Teyezilla Expeditions', 'Practical advice before your first trip.', 'https://picsum.photos/seed/blog-tips/800/500', 'published', '2026-06-25', 'Practical advice before your first trip.', 'Most Africa trips require an eVisa arranged in advance, standard travel vaccinations plus yellow fever in some countries, and neutral-colored clothing for safari game drives.', 'Before an African trip, check eVisa requirements for each country on the itinerary, confirm any required vaccinations with a travel clinic, and pack neutral-colored, breathable clothing for safari days. A good pair of binoculars and a dust-resistant camera bag go a long way on game drives.', 'Teyezilla Travel Team'),
('Family Safaris: What to Know Before You Go', 'family-safaris-what-to-know', 'Travel Tips', array['kenya','family'], 'Family Safari Guide | Teyezilla Expeditions', 'Planning a safari with kids.', 'https://picsum.photos/seed/blog-family/800/500', 'draft', null, null, null, null, null),
('Zanzibar Diving Guide: Mnemba Island', 'zanzibar-diving-mnemba', 'Destination Guides', array['zanzibar','diving'], 'Mnemba Island Diving Guide', 'What to expect diving Mnemba Island.', 'https://picsum.photos/seed/blog-diving/800/500', 'scheduled', '2026-08-01', null, null, null, null);

-- ============ TOUR AVAILABILITY ============
insert into tour_availability (tour_id, date, capacity, booked_count) values
((select id from tours where slug = 'maasai-mara-safari'), '2026-08-14', 8, 2),
((select id from tours where slug = 'serengeti-safari'), '2026-09-02', 6, 1),
((select id from tours where slug = 'marrakech-sahara-desert'), '2026-10-05', 12, 6),
((select id from tours where slug = 'pyramids-of-giza-tour'), '2026-07-28', 15, 2);

-- ============ STAFF SEEDING ============
-- Staff records need a matching Supabase Auth user before they can log in.
-- This part can't run as pure SQL; Supabase Auth users are created via the
-- Dashboard (Authentication > Users > Add User), the Auth Admin API, or the
-- Supabase CLI, not via a plain INSERT. Steps:
--
-- 1. In the Supabase Dashboard, go to Authentication > Users > Add User and
--    create a user for each staff email below (set a real password there,
--    not in this file).
-- 2. Copy each new user's UUID from the dashboard.
-- 3. Run the INSERTs below, replacing 'REPLACE_WITH_AUTH_UUID' with the
--    matching UUID from step 2.

-- insert into staff (auth_user_id, full_name, email, role) values
-- ('REPLACE_WITH_AUTH_UUID', 'Amina Wanjiru', 'admin@teyezilla.com', 'admin'),
-- ('REPLACE_WITH_AUTH_UUID', 'James Otieno', 'manager@teyezilla.com', 'manager'),
-- ('REPLACE_WITH_AUTH_UUID', 'Grace Mwangi', 'sales@teyezilla.com', 'sales_agent'),
-- ('REPLACE_WITH_AUTH_UUID', 'Peter Kamau', 'guide@teyezilla.com', 'tour_guide'),
-- ('REPLACE_WITH_AUTH_UUID', 'Samuel Njoroge', 'driver@teyezilla.com', 'driver');
