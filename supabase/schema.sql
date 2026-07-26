-- Teyezilla Expeditions — Database Schema (Phase 1)
-- Target: Supabase (Postgres). Every content table carries its own SEO fields
-- (meta_title, meta_description, og_image, slug) so pages can pull metadata
-- directly from the database via generateMetadata().


-- ============ DESTINATIONS ============
create table destinations (
  id uuid primary key default gen_random_uuid(),
  country_name text not null,
  slug text unique not null,
  flag_emoji text,
  hero_image text,
  short_description text,
  overview text,
  best_time_to_visit text,
  visa_info text,
  is_launch_destination boolean default false,
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ TOURS ============
create table tours (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid references destinations(id) on delete cascade,
  title text not null,
  slug text unique not null,
  category_label text,
  hero_image text,
  short_description text,
  duration_days integer,
  price_from numeric(10,2),
  currency text default 'USD',
  difficulty text check (difficulty in ('Easy', 'Moderate', 'Challenging')),
  inclusions text[],
  exclusions text[],
  itinerary jsonb, -- array of { day, fromLocation?, toLocation?, title, description, teyezillaMoment?, overnight?, meals? }
  meeting_point text,
  pickup_locations text[],
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  og_image text,
  product_type text default 'experience' check (product_type in ('experience', 'safari', 'private_travel')),
  min_guests integer, max_guests integer, fitness_level text, best_for text[], languages text[],
  transportation text, guide_info text, food_and_drinks text, important_info text,
  bring_list text[], cancellation_policy text, availability_note text, teyezilla_moment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ TOUR AVAILABILITY ============
create table tour_availability (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id) on delete cascade,
  date date not null,
  capacity integer not null,
  booked_count integer default 0
);

-- ============ CUSTOMERS ============
create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  phone text,
  nationality text,
  passport_info text, -- optional, store encrypted at rest
  emergency_contact text,
  notes text,
  loyalty_points integer default 0,
  created_at timestamptz default now()
);

-- ============ BOOKINGS ============
-- Booking flow is inquiry-based: visitors enquire, staff quote and confirm by
-- email/WhatsApp, payment happens offline. payment_status is a manual
-- record-keeping field only — online payment is permanently out of scope.
-- See supabase/migrations/20260726120000_inquiry_based_bookings.sql for the
-- full migration (status vocab remap, RLS) and rationale.
create table bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text unique not null,
  customer_id uuid references customers(id),
  tour_id uuid references tours(id),
  journey_id uuid references journeys(id),
  travel_date date, -- nullable: flexible-dates enquiries
  flexible_dates boolean default false,
  traveler_count integer not null,
  adults int,
  children int default 0,
  children_ages text,
  budget_range text,
  special_requests text,
  referral_source text,
  country_of_residence text,
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'deposit_received', 'paid')),
  booking_status text default 'inquiry' check (booking_status in ('inquiry', 'quoted', 'confirmed', 'completed', 'cancelled')),
  total_amount numeric(10,2),
  deposit_amount numeric(10,2),
  currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ PAYMENTS ============
create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  provider text check (provider in ('stripe', 'mpesa', 'paypal', 'bank_transfer')),
  provider_reference text,
  amount numeric(10,2) not null,
  currency text default 'USD',
  status text default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  created_at timestamptz default now()
);

-- ============ BLOG POSTS ============
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  answer text,
  body text,
  hero_image text,
  author_name text,
  author_bio text,
  category text,
  tags text[],
  status text default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ REVIEWS ============
create table reviews (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id),
  author_name text not null,
  source text check (source in ('Google', 'TripAdvisor', 'GetYourGuide')),
  rating integer check (rating between 1 and 5),
  quote text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- ============ DISCOUNT CODES ============
create table discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  is_referral boolean default false,
  usage_limit integer,
  used_count integer default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ============ MEDIA LIBRARY ============
create table media (
  id uuid primary key default gen_random_uuid(),
  file_url text not null,
  file_type text check (file_type in ('image', 'video', 'pdf')),
  alt_text text,
  tags text[],
  storage_path text, -- Storage object path, for deleting the underlying file
  uploaded_at timestamptz default now()
);

-- ============ INQUIRIES ============
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  source text check (source in ('website', 'whatsapp', 'contact_form', 'ai_trip_planner')),
  customer_name text,
  customer_email text,
  customer_phone text,
  tour_id uuid references tours(id),
  journey_id uuid references journeys(id),
  message text,
  assigned_staff_id uuid,
  status text default 'new' check (status in ('new', 'in_progress', 'quoted', 'converted', 'closed')),
  staff_reply text,
  replied_at timestamptz,
  created_at timestamptz default now()
);

-- ============ STAFF ============
-- auth_user_id links each staff record to a Supabase Auth user (created via
-- the Supabase Dashboard, Auth API, or CLI). The staff table itself never
-- stores a password — Supabase Auth owns credentials entirely.
create table staff (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  email text unique not null,
  role text check (role in ('admin', 'manager', 'tour_guide', 'driver', 'sales_agent')),
  permissions jsonb,
  created_at timestamptz default now()
);

-- Row Level Security: staff table should only be readable/writable by
-- authenticated staff, and only the `admin` role should manage other staff
-- records. Enable RLS and add policies once you're ready to lock this down
-- for production — left commented out here so local development isn't
-- blocked by policies before you've created your first admin user.
-- alter table staff enable row level security;
-- create policy "Staff can read their own record"
--   on staff for select
--   using (auth.uid() = auth_user_id);

-- ============ NOTIFICATIONS ============
create table notifications (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('new_booking', 'payment_confirmed', 'tour_reminder', 'follow_up', 'admin_alert')),
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============ AFFILIATE PARTNERS ============
-- Scaffolded per the Phase 3 spec ("scaffold the schema now; UI can come
-- later") — commission tracking and live sync are future work.
create table affiliate_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text default 'not_connected' check (status in ('not_connected', 'connected', 'pending')),
  commission_rate numeric(5,2),
  notes text,
  created_at timestamptz default now()
);

-- ============ AI TRIP PLANNER REQUESTS ============
create table trip_planner_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  destination text,
  budget_usd numeric(10,2),
  days integer,
  travelers integer,
  travel_style text,
  luxury_level text,
  ai_suggested_itinerary text,
  status text default 'new' check (status in ('new', 'reviewed', 'quoted', 'converted')),
  created_at timestamptz default now()
);

-- ============ IA REDESIGN (regions, journeys, experiences, collections, safari) ============
-- See supabase/migrations/20260723000000_ia_redesign_schema.sql for full DDL + RLS + rationale.

create table regions (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique not null,
  description text, hero_image text, display_order integer default 0,
  meta_title text, meta_description text, og_image text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table destination_regions (
  destination_id uuid not null references destinations(id) on delete cascade,
  region_id uuid not null references regions(id) on delete cascade,
  primary key (destination_id, region_id)
);

create table journeys (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text unique not null,
  hero_image text, short_description text, overview text,
  duration_days integer, price_from numeric(10,2), currency text default 'USD',
  difficulty text check (difficulty in ('Easy', 'Moderate', 'Challenging')),
  inclusions text[], exclusions text[],
  itinerary jsonb, -- array of { day, fromLocation?, toLocation?, title, description, teyezillaMoment?, overnight?, meals? }
  meeting_point text, pickup_locations text[],
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  meta_title text, meta_description text, og_image text,
  product_type text default 'signature_journey' check (product_type in ('signature_journey', 'multi_country_expedition')),
  min_guests integer, max_guests integer, fitness_level text, best_for text[], languages text[],
  transportation text, guide_info text, food_and_drinks text, important_info text,
  bring_list text[], cancellation_policy text, availability_note text, teyezilla_moment text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
-- No destination_id shortcut column — multi-country journeys use journey_destinations only.
create table journey_destinations (
  journey_id uuid not null references journeys(id) on delete cascade,
  destination_id uuid not null references destinations(id) on delete restrict,
  is_primary boolean not null default false, display_order integer default 0,
  primary key (journey_id, destination_id)
);
create table journey_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, slug text unique not null, description text,
  created_at timestamptz default now()
);
create table journey_journey_types (
  journey_id uuid not null references journeys(id) on delete cascade,
  journey_type_id uuid not null references journey_types(id) on delete cascade,
  primary key (journey_id, journey_type_id)
);

create table experience_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, slug text unique not null, icon text, display_order integer default 0,
  created_at timestamptz default now()
);
create table tour_experience_types (
  tour_id uuid not null references tours(id) on delete cascade,
  experience_type_id uuid not null references experience_types(id) on delete cascade,
  primary key (tour_id, experience_type_id)
);
create table journey_experience_types (
  journey_id uuid not null references journeys(id) on delete cascade,
  experience_type_id uuid not null references experience_types(id) on delete cascade,
  primary key (journey_id, experience_type_id)
);

create table collections (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, slug text unique not null,
  description text, hero_image text, display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  meta_title text, meta_description text, og_image text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table collection_tours (
  collection_id uuid not null references collections(id) on delete cascade,
  tour_id uuid not null references tours(id) on delete cascade,
  display_order integer default 0,
  primary key (collection_id, tour_id)
);
create table collection_journeys (
  collection_id uuid not null references collections(id) on delete cascade,
  journey_id uuid not null references journeys(id) on delete cascade,
  display_order integer default 0,
  primary key (collection_id, journey_id)
);

create table safari_themes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, slug text unique not null, description text, hero_image text,
  display_order integer default 0, created_at timestamptz default now()
);
create table tour_safari_themes (
  tour_id uuid not null references tours(id) on delete cascade,
  safari_theme_id uuid not null references safari_themes(id) on delete cascade,
  primary key (tour_id, safari_theme_id)
);
create table journey_safari_themes (
  journey_id uuid not null references journeys(id) on delete cascade,
  safari_theme_id uuid not null references safari_themes(id) on delete cascade,
  primary key (journey_id, safari_theme_id)
);

create table attractions (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references destinations(id) on delete cascade,
  name text not null, slug text, description text, hero_image text, category text,
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(), updated_at timestamptz default now(),
  unique (destination_id, slug)
);
create table accommodations (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references destinations(id) on delete cascade,
  name text not null, slug text, description text, hero_image text,
  tier text check (tier in ('Budget', 'Mid-Range', 'Luxury')),
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(), updated_at timestamptz default now(),
  unique (destination_id, slug)
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, role_title text, bio text, photo text, display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'safari-guide', question text not null, answer text not null,
  display_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(), updated_at timestamptz default now()
);

-- ============ PRODUCTS ENRICHMENT (pricing tiers, highlights, add-ons, activities library) ============
-- See supabase/migrations/20260726000000_products_enrichment_schema.sql for full DDL + RLS + rationale.
-- Paired tour_X/journey_X tables (not dual-nullable-parent tables) to match the
-- existing tour_experience_types/journey_experience_types convention.

create table tour_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  tier_name text not null, tagline text, price numeric(10,2), currency text default 'USD',
  accommodation_summary text, features text[], cta_label text, display_order integer default 0
);
create table journey_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  tier_name text not null, tagline text, price numeric(10,2), currency text default 'USD',
  accommodation_summary text, features text[], cta_label text, display_order integer default 0
);

create table tour_highlights (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  title text not null, description text, display_order integer default 0
);
create table journey_highlights (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  title text not null, description text, display_order integer default 0
);

-- kind: 'addon' (same-product upsell) or 'extension' (cross-sell trip extension)
create table tour_addons (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  kind text not null check (kind in ('addon', 'extension')),
  title text not null, description text, price numeric(10,2), currency text default 'USD',
  extra_days_min integer, extra_days_max integer, cta_label text, display_order integer default 0
);
create table journey_addons (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  kind text not null check (kind in ('addon', 'extension')),
  title text not null, description text, price numeric(10,2), currency text default 'USD',
  extra_days_min integer, extra_days_max integer, cta_label text, display_order integer default 0
);

-- Reusable named bookable sub-experiences (e.g. "Maasai Mara Game Drive"),
-- distinct from experience_types (broad nav-filter tags like "Wildlife & Safari").
create table activities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, slug text unique not null, description text,
  icon text, display_order integer default 0, created_at timestamptz default now()
);
create table tour_activities (
  tour_id uuid not null references tours(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  display_order integer default 0,
  primary key (tour_id, activity_id)
);
create table journey_activities (
  journey_id uuid not null references journeys(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  display_order integer default 0,
  primary key (journey_id, activity_id)
);

-- Indexes for common lookups
create index idx_tours_destination on tours(destination_id);
create index idx_bookings_customer on bookings(customer_id);
create index idx_bookings_tour on bookings(tour_id);
create index idx_payments_booking on payments(booking_id);
create index idx_reviews_tour on reviews(tour_id);
create index idx_inquiries_status on inquiries(status);
