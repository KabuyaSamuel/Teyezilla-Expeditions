# Teyezilla Expeditions

# Teyezilla Expeditions

Premium African travel platform. Phase 1 (foundation), Phase 2 (public website), and
Phase 3 (admin dashboard) are built. The data layer and admin auth are now wired to
real Supabase, with a seed-data fallback for local development.

## What's in this build

- **Next.js 14 App Router + TypeScript + Tailwind CSS v3** (`tailwind.config.ts` holds
  the brand design tokens: colors, fonts, shadows, animation)
- **`next/font/google`** loading Poppins (headings) and Inter (body)
- **Real Supabase integration**: all admin data (destinations, tours, bookings,
  customers, payments, inquiries, coupons, media, notifications, affiliates, blog
  posts, inventory, staff) reads from live Supabase tables when configured, falling
  back to seed fixtures otherwise (see "Connecting Supabase" below)
- **Real Supabase Auth**: admin login/logout uses `supabase.auth.signInWithPassword`,
  not a mock cookie session
- **Public site pages**: homepage, destinations index + dynamic `[slug]` pages, tours
  dynamic `[slug]` pages, safaris, experiences, tailor-made trips, blog index + dynamic
  `[slug]` pages, reviews, about, contact, booking form, AI trip planner form
- **SEO**: `generateMetadata` on every dynamic route, `app/sitemap.ts`, `app/robots.ts`,
  canonical URLs, JSON-LD (`BreadcrumbList`, `FAQPage`, `TouristTrip`, `BlogPosting`)
- **AEO/GEO**: `public/llms.txt`, answer-first content blocks on destination/tour/blog
  pages, FAQ schema, comparison-format blog posts
- **Admin dashboard** (`/admin`) — auth-gated via Supabase Auth, role-based, all 19
  modules from the Phase 3 spec

## Connecting Supabase

There are two ways to get the schema and seed data into your project: the Supabase CLI
(recommended if you have Node/npm and want migrations tracked in git), or pasting SQL
directly into the Dashboard's SQL Editor (simplest, no local setup). Both end up in the
same place.

### Option A — Supabase CLI (recommended)

```bash
# 1. Install the CLI (one-time, if you don't have it)
npm install -g supabase

# 2. Log in — opens a browser to authenticate
supabase login

# 3. Initialize the CLI config in this project (creates supabase/config.toml)
#    Safe to run even though supabase/migrations and seed.sql already exist —
#    it won't touch or overwrite them.
supabase init

# 4. Link to your existing Supabase project
#    Find your project ref in the Dashboard: Settings > General > Reference ID
#    (it's also the subdomain in your project URL, https://<ref>.supabase.co)
supabase link --project-ref YOUR_PROJECT_REF

# 5. Push the schema + RLS policy migrations to your remote project
supabase db push

# 6. Seed the remote database with demo content (destinations, tours, bookings, etc.)
#    This is the one step NOT covered by `db push` — seed.sql needs to be run
#    separately against the remote project. The safest way on a fresh project:
supabase db reset --linked
```

`supabase db reset --linked` re-applies all migrations from scratch and then runs
`supabase/seed.sql` automatically — safe on a brand-new project with nothing to lose,
but it will wipe any data you've already added by hand. If you'd rather not risk that,
skip step 6 and use Option B below just for the seed step.

### Regenerating `types/database.ts` after a schema change

`types/database.ts` is generated from the live schema, not hand-written — it's what
lets `lib/*` data files use real column types (`Tables<"tours">` etc.) instead of
`Record<string, any>`. It does **not** auto-update when you add a migration, so after
`supabase db push` (or any schema change), regenerate it:

```bash
supabase gen types typescript --linked > types/database.ts
```

If you skip this after adding/renaming a column, nothing breaks immediately — the
generated types just silently describe the *old* schema until you regenerate, which can
mask a real mismatch instead of catching it at compile time. Note: only a portion of
`lib/*` has been migrated to use these generated types so far (see the note in the
relevant PR/commit history) — `lib/tours.ts`, `lib/journeys.ts`, and their `lib/admin/
data/` counterparts still use hand-rolled types, since their heavily-joined multi-table
selects need custom composed types rather than a straight swap.

### Option B — Dashboard SQL Editor (no CLI needed)

1. Open your project's SQL Editor in the Supabase Dashboard.
2. Paste the contents of `supabase/migrations/20260718000000_init_schema.sql`, run it.
3. Paste the contents of `supabase/seed.sql` (skip the commented-out staff section at
   the bottom for now), run it.

### Creating staff accounts (either option)

Auth users can't be created via plain SQL, so this part is manual regardless of which
option you used above:

1. Dashboard → Authentication → Users → Add User, once per staff member (set a real
   password here — this is the actual login credential, nothing is hardcoded in the app).
2. Copy each new user's UUID from the Users table.
3. Back in the SQL Editor, run the `insert into staff (...)` statements commented at
   the bottom of `supabase/seed.sql`, replacing `REPLACE_WITH_AUTH_UUID` with the UUIDs
   from step 2.

### Environment variables

Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (used by the public enquiry forms to upsert customer
  records server-side; enquiries still land without it, just unlinked from customers)
- `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`, `EMAIL_FROM` (transactional email via
  Resend — enquiry notifications and customer confirmations; sends are skipped
  gracefully when unset)
- `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` (error monitoring — errors just aren't reported
  when unset)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (rate limiting on the booking/
  contact/trip-planner forms via Upstash Redis — see `lib/rate-limit.ts`; forms stay
  unthrottled when unset, they don't break)

The Supabase keys are on your project's Settings > API page. Restart `npm run dev`
after adding them.

### Troubleshooting: pages show no data even though the tables are seeded

Supabase enables Row Level Security on every new table by default, with zero
policies — so every query returns an empty result to both the public site
(`anon` role) and the admin dashboard (`authenticated` role), even when the
underlying table has rows. It doesn't error, so this fails silently. Only a
`service_role` key bypasses RLS, which is why the data looks fine from the
Dashboard's table editor while the app shows nothing.

Fix: run `supabase db push` to apply
`supabase/migrations/20260718163423_add_rls_policies.sql`, which grants
`anon`/`authenticated` read access to public content (destinations, tours,
published blog posts, approved reviews) and full read/write access to
`authenticated` staff on the rest (bookings, customers, payments, etc.).

**Until you do this**, the site still runs and looks identical — every data-fetching
function in `lib/` falls back to seed data automatically when Supabase env vars are
absent, and `/admin` fails closed (redirects to login with a config-error message)
rather than staying open with no auth.

### Making future schema changes

Once you're on migrations, always create new changes as new migration files rather
than editing the database directly in the Dashboard — editing directly breaks
`db push`'s ability to track what's already been applied.

```bash
supabase migration new add_some_new_table
# edit the generated file in supabase/migrations/, then:
supabase db push
```

## Admin dashboard (Phase 3)

**Auth**: `proxy.ts` (Next.js 16's route-guard convention) protects every `/admin/*`
route, checking a real Supabase Auth session on every request and refreshing it as
needed. `lib/admin/session.ts` additionally requires a matching row in the `staff`
table — a Supabase Auth user alone isn't enough to get into `/admin`, they also need
to be added to `staff` with a role (see "Connecting Supabase" above).

**Role permissions** live in one place: `lib/admin/permissions.ts`. The sidebar and
route access both read from `ROLE_MODULE_ACCESS` in that file, so adjusting who can see
what is a one-file change.

**All 19 modules are built and navigable**:
Dashboard, Tour Management (full add/edit form with itinerary builder), Destination
Management, Booking Management (with detail view, voucher/invoice/refund/cancel
actions), Customer Management (CRM), Payment Management, Inquiry Management, AI Trip
Planner admin, Blog Management, Reviews, Media Library, Coupons & Promotions, Reports &
Analytics, Staff Management, Website Settings, Travel Resources, Affiliate Management
(scaffolded per spec — schema only, UI is a readonly placeholder), Notifications, and
Inventory & Availability.

**Data**: every admin module now reads from real Supabase tables (with seed-data
fallback if Supabase isn't configured) — destinations, tours, bookings, customers,
payments, inquiries, coupons, media, notifications, affiliates, blog posts, inventory,
and staff all follow the same pattern in `lib/`. Write operations (the "Save" buttons
on forms) still only update local component state, not the database — that's the next
piece of Phase 4 work.

## What's stubbed, not yet wired (later phases)

- **Writes**: every admin form reads real data but "Save"/"Book Now"/etc. don't
  persist changes back to Supabase yet — only reads are wired up so far. Each module's
  data file (`lib/admin/data/*.ts` or `lib/destinations.ts`/`lib/tours.ts`) is the
  natural place to add the corresponding `insert`/`update` calls.
- **Public blog content**: the public `/blog` and `/blog/[slug]` pages still hold their
  article bodies directly in the page code rather than reading from `blog_posts` (the
  admin Blog Management module does read/write-ready against the real table — this is
  specifically about the public-facing article text). Migrating those bodies into the
  database is a content task, not a code change.
- **Images**: components reference `/images/...` or `picsum.photos` placeholder paths.
  Add real photography to `public/images/` using matching filenames, or point the data
  layer at a CDN/Supabase Storage URLs instead.
- **WhatsApp Business API, Maps, Analytics** (Phase 4): see `.env.example` for the
  credentials each integration will need. The booking enquiry, contact, and trip
  planner forms all submit to Supabase and send email via Resend; online payment is
  permanently out of scope (the business quotes by email/WhatsApp and takes payment
  offline).
- **AI Trip Planner logic**: the public form captures inputs; itinerary generation
  isn't wired to an AI provider yet. Requests appear in Inquiry Management, where
  staff can edit the itinerary and convert a request to a booking.
- **Guide/driver/vehicle assignment**: the `tour_availability` table holds real
  capacity/booking counts, but assignment fields aren't in the
  schema yet — extend that table (or add a linked assignments table) when ready to
  track this for real.

## Getting started

```bash
npm install
npm run dev
```

To verify a production build:

```bash
npm run build
```

Note: `next/font/google` fetches fonts from Google at build time, so build machines
need outbound internet access to `fonts.googleapis.com` — this works on Vercel and
any normal dev machine by default.

## Next steps

Continue **Phase 4: Integrations** — the booking flow is now inquiry-based (no online
payment gateway; enquiries are quoted by staff and paid offline), with transactional
email via Resend. Remaining: WhatsApp Business API, Maps/GA4/GTM — followed by
Phase 5 (polish).


