# Teyezilla Expeditions

Premium African travel platform: a public marketing/booking site plus a staff-facing
admin dashboard, both backed by a real Supabase database. Customers browse
destinations, tours, and multi-country journeys and submit a booking enquiry, contact
message, or AI trip planner request; staff work those enquiries through to a quote and
confirmation in the admin dashboard. There's no online payment gateway by design — the
business quotes by email/WhatsApp and takes payment offline.

## The story so far

The build went through three broad phases:

1. **Foundation** — Next.js App Router project, design tokens, fonts, base layout.
2. **Public website** — every marketing/booking page, SEO/AEO infrastructure.
3. **Admin dashboard** — 20 staff-facing modules, initially reading from Supabase with
   seed-data fallback.

It's now well into **Phase 4: Integrations and real persistence**. The admin dashboard
has moved past "reads only" — every module's forms write back to Supabase for real
(destinations, tours, journeys, bookings, customers, blog posts, etc. all persist), the
public blog reads live content instead of hardcoded article bodies, and
guide/driver/vehicle assignment for upcoming departures is fully wired (see
Operations below). What's left in Phase 4 is external integrations: analytics, search
console, and a plan for AI-assisted itinerary generation that doesn't depend on a paid
LLM subscription. See "Current state" and "Roadmap" below for the specifics — some
things in earlier drafts of this document had drifted from what's actually in the code,
so treat this version as the source of truth.

## Tech stack

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v3** — `tailwind.config.ts`
  holds the brand design tokens (colors, fonts, shadows, animation)
- **React 19**, `next/font/google` loading Poppins (headings) and Inter (body)
- **Supabase** — Postgres + Auth + Storage. All data reads/writes go through `lib/`
  (public site) and `lib/admin/data/` + `lib/admin/actions/` (admin), with seed-data
  fallback when Supabase env vars are absent
- **Sentry** — error monitoring, client + server
- **Vercel Analytics + Speed Insights** — already live (distinct from Google Analytics,
  see Roadmap)
- **Upstash Redis** — rate limiting on public forms
- **Resend** — transactional email
- **Vitest** — RLS regression tests run against the real Supabase project (throwaway
  rows, cleaned up after each test) plus rate-limit tests
- **Lighthouse CI** — performance/accessibility/SEO audits against real deployments

## Current state

### Public site

Homepage, destinations index + `[slug]` pages, tours `[slug]` pages, journeys index +
`[slug]` pages, collections, safaris, experiences, tailor-made trips, private travel,
concierge, blog index + `[slug]` pages, reviews, about, contact, booking enquiry form,
booking confirmation, booking information, cancellation policy, travel guide, FAQs, AI
trip planner form, privacy policy, terms.

**SEO**: `generateMetadata` on every dynamic route, `app/sitemap.ts`, `app/robots.ts`,
canonical URLs, JSON-LD (`BreadcrumbList`, `FAQPage`, `TouristTrip`, `BlogPosting`).
**AEO/GEO**: `public/llms.txt`, answer-first content blocks, FAQ schema, comparison-format
blog posts.

### Admin dashboard (`/admin`)

**Auth**: `proxy.ts` (Next.js 16's route-guard convention) checks a real Supabase Auth
session on every `/admin/*` request and refreshes it as needed. `lib/admin/session.ts`
additionally requires a matching row in the `staff` table — a Supabase Auth user alone
isn't enough; they also need a `staff` row with a role.

**Roles & permissions** live in one file, `lib/admin/permissions.ts` — `ROLE_MODULE_ACCESS`
is the single source of truth for both the sidebar and route access. Five roles: `admin`,
`manager`, `tour_guide`, `driver`, `sales_agent`, each seeing a different subset of the 20
modules.

**The 20 modules, all built, all reading and writing real data**:
Dashboard, Tour Management, Journey Management, Collections, Activities Library, Vehicle
Library, Accommodation Library, Destination Management, Operations (assign
guides/drivers/vehicles to upcoming departures), Booking Management, Customer Management
(CRM), Inquiry Management (website, WhatsApp, contact form, and trip planner enquiries
all land here), Blog Management, Reviews, Media Library, Reports & Analytics, Staff
Management, Website Settings, Status Options (custom taxonomy for booking/payment
statuses), Travel Resources, Notifications.

**Write pattern**: every module follows the same shape —
`lib/admin/data/<module>.ts` for reads, `lib/admin/actions/<module>.ts` for
`"use server"` writes (`insert`/`update`/`delete` against Supabase, then
`revalidatePath` on the affected public + admin routes), and a `components/admin/
<Module>Form.tsx` client component that calls the action directly from its submit
handler. Follow this pattern for any new module.

### What's dormant (schema exists, no UI — deliberately out of scope for now)

- **Coupons/discount codes** (`discount_codes` table, seeded) — no admin UI. There's no
  payment gateway to apply a discount against yet, so this isn't worth building until
  online payment (if ever) is in scope.
- **Affiliate program** (`affiliate_partners` table, no seed data, zero code references
  anywhere) — deferred; revisit if client budget allows building this out.
- **Google Maps** (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` declared in `lib/env.ts`, unused
  everywhere) — not needed for the current product.

None of this is a bug or an oversight — these were reviewed and explicitly deprioritized.

### What's genuinely still open

- **AI Trip Planner**: the public form captures customer input (destination, days,
  budget, travel style) and it lands in Inquiry Management, where staff currently
  hand-write the suggested itinerary (`saveTripPlannerItinerary` in
  `lib/admin/actions/trip-planner.ts` just saves whatever text staff type). No AI
  provider is wired. The client doesn't have (or want) a paid LLM subscription, so the
  plan is a deterministic itinerary suggestion engine built from data already in
  Supabase (tours, journeys, accommodations, activities matched against the customer's
  inputs) rather than a real LLM call — gives staff a real draft to start from instead
  of a blank page, at zero ongoing cost. The seam should be built so a real LLM call can
  replace it later without touching callers, the same way Sentry/email/rate-limiting are
  already optional integrations that degrade gracefully.
- **WhatsApp Business Cloud API** (`WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` in
  `lib/env.ts`) — for *automated* WhatsApp messaging, not yet wired. The manual
  `wa.me` click-to-chat link (`components/WhatsAppButton.tsx`,
  `NEXT_PUBLIC_WHATSAPP_NUMBER`) already works everywhere today and covers the core need.
- **Google Analytics 4**: code is written but commented out (`app/layout.tsx`, look for
  `<GoogleAnalytics>`) — waiting on a real `NEXT_PUBLIC_GA_MEASUREMENT_ID` and the
  custom domain being connected before going live.
- **Google Search Console**: not started. Once the domain is connected, verify via a DNS
  TXT record (no code needed) and submit `sitemap.xml` (already live at `app/sitemap.ts`).
- **Custom domain**: the site currently lives on `teyezillaexpeditions.vercel.app`, not
  the custom domain. `lib/site.ts`'s `SITE_URL` already points at the intended final
  domain (`https://www.teyezillaexpeditions.com`) since that's what should get indexed —
  `scripts/smoke-test.mjs` and `scripts/fetch-admin-auth-cookie.mjs` have TODOs to switch
  back to it once it's live.
- **Real photography**: components still reference `picsum.photos` placeholder images
  (one real photo on the homepage is CC BY 2.0 licensed from Wikimedia, credited in
  `components/WhyChoose.tsx`). See `docs/replacing-placeholder-images.md`.

## Getting started (new dev setup)

### Prerequisites

- Node 22 (matches CI — `.github/workflows/ci.yml`)
- A Supabase project (free tier is enough) — or skip this and run against seed-data
  fallback for a quick look, see below

### Install and run

```bash
npm install
cp .env.example .env.local   # fill in as described below
npm run dev
```

The site runs and looks correct even with an empty `.env.local` — every data-fetching
function in `lib/` falls back to seed fixtures when Supabase env vars are absent. You
won't be able to log into `/admin` though: `proxy.ts` fails closed (redirects to login
with a config-error message) when Supabase isn't configured, rather than leaving it open.

### Connecting Supabase for real

Two ways to get the schema + seed data into your project — the CLI (recommended, tracks
migrations in git) or pasting SQL directly into the Dashboard (simplest, no local setup).

#### Option A — Supabase CLI

```bash
npm install -g supabase
supabase login
supabase init                              # safe even though supabase/migrations exists
supabase link --project-ref YOUR_PROJECT_REF   # ref is in Dashboard > Settings > General
supabase db push                           # applies every migration in supabase/migrations/
supabase db reset --linked                 # applies migrations + supabase/seed.sql
```

`supabase db reset --linked` wipes any data you've already added by hand — safe on a
fresh project, not otherwise. If you'd rather not risk that, skip it and use Option B
just for the seed step.

#### Option B — Dashboard SQL Editor

1. Paste and run each file in `supabase/migrations/`, in filename order (they're
   timestamp-prefixed, so alphabetical = chronological).
2. Paste and run `supabase/seed.sql` (skip the commented-out staff section at the
   bottom — see "Creating staff accounts" below).

**Regenerating `types/database.ts`** after any schema change (not automatic):

```bash
supabase gen types typescript --linked > types/database.ts
```

Skipping this doesn't break anything immediately — the generated types just silently
describe the *old* schema until regenerated, which can mask a real mismatch instead of
catching it at compile time. Note only part of `lib/` uses these generated types today
(`lib/tours.ts`, `lib/journeys.ts`, and their `lib/admin/data/` counterparts still use
hand-rolled types — their heavily-joined multi-table selects need custom composed types
rather than a straight swap).

**Creating staff accounts** (manual regardless of which option above — Auth users can't
be created via plain SQL):

1. Dashboard → Authentication → Users → Add User, once per staff member (set a real
   password — nothing is hardcoded in the app).
2. Copy each new user's UUID from the Users table.
3. In the SQL Editor, run the `insert into staff (...)` statements commented at the
   bottom of `supabase/seed.sql`, replacing `REPLACE_WITH_AUTH_UUID` with the real UUIDs.

**Troubleshooting: pages show no data even though tables are seeded** — Supabase enables
Row Level Security on every new table by default with zero policies, so every query
returns empty to both `anon` and `authenticated` roles even though the table has rows.
It doesn't error, so this fails silently, and looks fine from the Dashboard's table
editor (which uses the `service_role` key and bypasses RLS) while the app shows nothing.
Fix: `supabase db push` to apply `supabase/migrations/20260718163423_add_rls_policies.sql`
and the later write-policy migrations.

**Making future schema changes**: always a new migration file, never edit the Dashboard
directly — direct edits break `db push`'s ability to track what's already applied.

```bash
supabase migration new add_some_new_table
# edit the generated file in supabase/migrations/, then:
supabase db push
```

### Environment variables

See `.env.example` for the full list with inline notes. Summary of what's required vs.
optional:

- **Required**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` — the app cannot serve real traffic without these.
  `lib/env.ts` validates all env vars at build/boot time with a clear error naming which
  one is missing, rather than the app silently degrading until someone hits the feature
  that needed it.
- **Optional, fail open** (feature just doesn't activate, nothing breaks):
  `RESEND_API_KEY` and email vars, `SENTRY_DSN` and Sentry vars,
  `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`, WhatsApp Business API vars,
  `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
  `NEXT_PUBLIC_GTM_ID`.
- CI builds without any Supabase secrets by setting `SKIP_ENV_VALIDATION=1` — that job
  checks compile correctness only, not real data. A real build (Vercel, or a local
  `npm run build` without `.env.local`) is expected to fail loudly on the required vars.

### Verifying a production build

```bash
npm run build
```

`next/font/google` fetches fonts from Google at build time, so the build machine needs
outbound internet access to `fonts.googleapis.com` — works on Vercel and any normal dev
machine by default.

### Tests

```bash
npm test
```

Runs `tests/rls/*.test.ts` (RLS regression tests against the real Supabase project —
every test creates its own throwaway rows and cleans them up, nothing reads/writes real
content) and `tests/rate-limit.test.ts`. Both need the Supabase env vars above; the
rate-limit test also needs the Upstash ones.

### Lint

`npm run lint` currently fails with ~121 pre-existing `@typescript-eslint/no-explicit-any`
errors scattered across the codebase (none from recent work) — this is why it's
deliberately not run in CI yet (see `.github/workflows/ci.yml`). Don't let it block you;
just don't add new `any` types in files you touch.

### CI

- `.github/workflows/ci.yml` — typecheck + build + tests, on every push/PR to `main`/`Dev2`.
- `.github/workflows/lighthouse.yml` — performance/accessibility/SEO audit against real
  Production deployments (not every push — audits are slow, this tracks trends).
- `.github/workflows/smoke-test.yml` — post-deploy smoke test.

## Making changes — where things live

- `app/(public)/` — public-facing pages (route group so `/admin/*` doesn't inherit the
  public Navbar/Footer, see the comment in `app/layout.tsx`).
- `app/admin/(dashboard)/` — one folder per admin module, matching the `key` in
  `lib/admin/permissions.ts`.
- `components/` — shared public-site components; `components/admin/` — admin-only
  components, mostly `<Module>Form.tsx` client components.
- `lib/` — public-site data fetchers (e.g. `lib/tours.ts`, `lib/blog.ts`).
- `lib/admin/data/` — admin reads; `lib/admin/actions/` — admin writes (`"use server"`).
- `lib/admin/permissions.ts` — single source of truth for module list + role access.
- `supabase/migrations/` — schema, timestamp-ordered; `supabase/seed.sql` — demo content.
- `types/database.ts` — generated from the live schema, regenerate after migrations.

**Design principle to follow**: optional integrations (email, Sentry, rate limiting,
analytics) all fail open — the feature just doesn't activate rather than breaking
anything when unconfigured. Follow this pattern for any new external integration
(`lib/env.ts` documents the reasoning inline). The one deliberate exception is
`SUPABASE_SERVICE_ROLE_KEY`, which is required and validated at boot — the app cannot
correctly serve real traffic without it.

## Roadmap

Remaining Phase 4 work, roughly in priority order:

1. **AI Trip Planner** — build the deterministic itinerary-suggestion engine described
   above (no paid LLM dependency).
2. **Connect the custom domain**, then flip on GA4 (`app/layout.tsx`, currently commented
   out) and verify Google Search Console.
3. **Real photography** — replace `picsum.photos`/Wikimedia placeholders.

Explicitly **out of scope** unless the client's budget changes: coupons/discount codes,
affiliate management, Google Maps, WhatsApp Business API automation, any online payment
gateway.

Phase 5 (polish) follows once the above lands.
