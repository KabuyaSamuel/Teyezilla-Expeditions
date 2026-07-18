# Teyezilla Expeditions

# Teyezilla Expeditions

Premium African travel platform. Phase 1 (foundation), Phase 2 (public website), and
Phase 3 (admin dashboard) of the 5-phase build are implemented here.

## What's in this build

- **Next.js 14 App Router + TypeScript + Tailwind CSS v3** (`tailwind.config.ts` holds
  the brand design tokens: colors, fonts, shadows, animation)
- **`next/font/google`** loading Poppins (headings) and Inter (body)
- **Database schema** at `supabase/schema.sql` — run this against a Supabase project
  to create all Phase 1 tables (destinations, tours, bookings, customers, payments,
  blog_posts, reviews, discount_codes, media, inquiries, staff)
- **Public site pages**: homepage, destinations index + dynamic `[slug]` pages, tours
  dynamic `[slug]` pages, safaris, experiences, tailor-made trips, blog index + dynamic
  `[slug]` pages, reviews, about, contact, booking form, AI trip planner form
- **SEO**: `generateMetadata` on every dynamic route, `app/sitemap.ts`, `app/robots.ts`,
  canonical URLs, JSON-LD (`BreadcrumbList`, `FAQPage`, `TouristTrip`, `BlogPosting`)
- **AEO/GEO**: `public/llms.txt`, answer-first content blocks on destination/tour/blog
  pages, FAQ schema, comparison-format blog posts
- **Admin dashboard** (`/admin`) — auth-gated, role-based, all 19 modules from the
  Phase 3 spec built as their own routes (see below)

## Admin dashboard (Phase 3)

**Auth**: `proxy.ts` (Next.js 16's route-guard convention, formerly `middleware.ts`)
protects every `/admin/*` route except `/admin/login`. Login uses a mock cookie-based
session (`lib/admin/session.ts`) — swap this for real Supabase Auth in Phase 4 without
changing any page, since every page reads the session through the same function.

**Demo accounts** (password `demo123` for all):
| Email | Role |
|---|---|
| admin@teyezilla.com | Admin — full access |
| manager@teyezilla.com | Manager |
| sales@teyezilla.com | Sales Agent |
| guide@teyezilla.com | Tour Guide |
| driver@teyezilla.com | Driver |

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

**Data**: `lib/admin/data/*.ts` holds mock records shaped like the Phase 1 schema
(bookings, customers, payments, inquiries, staff, coupons, media, notifications,
affiliates, blog posts, inventory). Forms show a "saved locally" confirmation but don't
persist — wire each module to Supabase queries/mutations in Phase 4 and the UI won't
need to change.

## What's stubbed, not yet wired (later phases)

- **Data layer**: seed data throughout `lib/` and `lib/admin/data/` matches the schema
  shape. Swap for real Supabase queries once a project is connected — component props
  won't need to change.
- **Images**: components reference `/images/...` or `picsum.photos` placeholder paths.
  Add real photography to `public/images/` using matching filenames, or point the data
  layer at a CDN/Supabase Storage URLs instead.
- **Payments, WhatsApp Business API, Maps, Analytics, Email** (Phase 4): booking and
  trip planner forms exist but don't submit anywhere yet. See `.env.example` for the
  credentials each integration will need.
- **AI Trip Planner logic**: the public form captures inputs; itinerary generation
  isn't wired to an AI provider yet. The admin module for reviewing/editing/quoting
  requests is fully built against mock submissions.
- **Real authentication**: the admin login is a demo cookie session, not production-grade
  auth. Replace with Supabase Auth (or another provider) before going live.

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

## Database setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor (or via the Supabase CLI).
3. Add the project URL and keys to `.env.local` (copy from `.env.example`).

## Next steps

Move to **Phase 4: Integrations** using the phase prompt, then Phase 5 (polish).

