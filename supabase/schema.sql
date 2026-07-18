-- Teyezilla Expeditions — Database Schema (Phase 1)
-- Target: Supabase (Postgres). Every content table carries its own SEO fields
-- (meta_title, meta_description, og_image, slug) so pages can pull metadata
-- directly from the database via generateMetadata().

create extension if not exists "uuid-ossp";

-- ============ DESTINATIONS ============
create table destinations (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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
  itinerary jsonb, -- array of { day, title, description }
  meeting_point text,
  pickup_locations text[],
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ TOUR AVAILABILITY ============
create table tour_availability (
  id uuid primary key default uuid_generate_v4(),
  tour_id uuid references tours(id) on delete cascade,
  date date not null,
  capacity integer not null,
  booked_count integer default 0
);

-- ============ CUSTOMERS ============
create table customers (
  id uuid primary key default uuid_generate_v4(),
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
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_reference text unique not null,
  customer_id uuid references customers(id),
  tour_id uuid references tours(id),
  travel_date date not null,
  traveler_count integer not null,
  payment_status text default 'pending' check (payment_status in ('pending', 'partial', 'paid', 'refunded')),
  booking_status text default 'pending' check (booking_status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount numeric(10,2),
  deposit_amount numeric(10,2),
  currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ PAYMENTS ============
create table payments (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
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
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
  file_url text not null,
  file_type text check (file_type in ('image', 'video', 'pdf')),
  alt_text text,
  tags text[],
  uploaded_at timestamptz default now()
);

-- ============ INQUIRIES ============
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  source text check (source in ('website', 'whatsapp', 'contact_form', 'ai_trip_planner')),
  customer_name text,
  customer_email text,
  customer_phone text,
  tour_id uuid references tours(id),
  message text,
  assigned_staff_id uuid,
  status text default 'new' check (status in ('new', 'in_progress', 'quoted', 'converted', 'closed')),
  created_at timestamptz default now()
);

-- ============ STAFF ============
create table staff (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  role text check (role in ('admin', 'manager', 'tour_guide', 'driver', 'sales_agent')),
  permissions jsonb,
  created_at timestamptz default now()
);

-- Indexes for common lookups
create index idx_tours_destination on tours(destination_id);
create index idx_bookings_customer on bookings(customer_id);
create index idx_bookings_tour on bookings(tour_id);
create index idx_payments_booking on payments(booking_id);
create index idx_reviews_tour on reviews(tour_id);
create index idx_inquiries_status on inquiries(status);
