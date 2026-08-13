# Teyezilla Expeditions

Premium African travel platform: a public marketing/booking site plus a staff-facing
admin dashboard, both backed by a real Supabase database. Customers browse
destinations, tours, and multi-country journeys and submit a booking enquiry, contact
message, or AI trip planner request; staff work those enquiries through to a quote and
confirmation in the admin dashboard. There's no online payment gateway yet — the
business quotes by email/WhatsApp and takes payment offline (see Roadmap).

Live at **[teyezillaexpeditions.com](https://www.teyezillaexpeditions.com)**, hosted on
Netlify, built from the `main` branch. `Dev2` is the active development branch — every
push there runs full CI (typecheck, build, changed-file lint, RLS + rate-limit
regression tests) before anything is merged to `main`.

## What's in the app

### Public site

Homepage, destinations index + `[slug]` pages, tours `[slug]` pages, journeys index +
`[slug]` pages, collections, safaris, experiences, tailor-made trips, private travel,
blog index + `[slug]` pages (with image/video/code content blocks), reviews, about,
contact, booking enquiry form, booking confirmation, booking information, cancellation
policy, travel guide, FAQs, AI trip planner form, search, privacy policy, terms.

**SEO**: `generateMetadata` on every dynamic route, `app/sitemap.ts`, `app/robots.ts`,
canonical URLs, JSON-LD (`BreadcrumbList`, `FAQPage`, `TouristTrip`, `BlogPosting`).
**AEO/GEO**: `public/llms.txt`, answer-first content blocks, FAQ schema, comparison-format
blog posts.
**Analytics**: Google Analytics 4, Google Tag Manager, and Microsoft Clarity are all
live in production, each optional and independently configured (see Environment
variables below) — none of the three block rendering or each other if unset.

### Admin dashboard (`/admin`)

**Auth**: `proxy.ts` (Next.js 16's route-guard convention) checks a real Supabase Auth
session on every `/admin/*` request and refreshes it as needed. `lib/admin/session.ts`
additionally requires a matching row in the `staff` table — a Supabase Auth user alone
isn't enough; they also need a `staff` row with a role. Login itself is rate-limited by
both IP and the submitted email (`app/admin/login/actions.ts`).

**Roles & permissions** live in one file, `lib/admin/permissions.ts` — `ROLE_MODULE_ACCESS`
is the single source of truth for both the sidebar and route access. Five roles: `admin`,
`manager`, `tour_guide`, `driver`, `sales_agent`, each seeing a different subset of the 24
modules below.

**The 24 modules, all built, all reading and writing real data**, grouped the way the
sidebar groups them:

- **Today**: Notifications, Booking Management, Inquiry Management (website, WhatsApp,
  contact form, and trip planner enquiries all land here), Customer Management (CRM),
  Operations (assign guides/drivers/vehicles to upcoming departures)
- **Catalog**: Tour Management, Journey Management, Collections, Destination Management
- **Building Blocks**: Experience Types, Activities Library, Vehicle Library,
  Accommodation Library
- **Content & Marketing**: Blog Management, Reviews, FAQs, Travel Resources, Team
  Members, Media Library (upload-time image resize + type/magic-byte validation, see
  Security), Link Generator (trackable UTM links)
- **Reports & Settings**: Reports & Analytics, Staff Management, Website Settings,
  Status Options (custom taxonomy for booking/payment statuses)
- Dashboard itself sits pinned above all five groups; every card on it links through to
  the full view of whatever it's summarizing.

**Write pattern**: every module follows the same shape —
`lib/admin/data/<module>.ts` for reads, `lib/admin/actions/<module>.ts` for
`"use server"` writes (`insert`/`update`/`delete` against Supabase, then
`revalidatePath` on the affected public + admin routes), and a `components/admin/
<Module>Form.tsx` client component that calls the action directly from its submit
handler. Follow this pattern for any new module.

### What's dormant (schema exists, no UI — deliberately out of scope for now)

- **Coupons/discount codes** (`discount_codes` table, seeded) — no admin UI. There's no
  payment gateway to apply a discount against yet, so this isn't worth building until
  online payment is in scope (see Roadmap).
- **Affiliate program** (`affiliate_partners` table, no seed data, zero code references
  anywhere) — deferred; revisit if client budget allows building this out.

None of this is a bug or an oversight — these were reviewed and explicitly deprioritized.

## Tech stack

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v3** — `tailwind.config.ts`
  holds the brand design tokens (colors, fonts, shadows, animation)
- **React 19**, `next/font/google` (self-hosted at build time, no runtime request to
  Google) loading Poppins (headings) and Inter (body)
- **Supabase** — Postgres + Auth + Storage. All data reads/writes go through `lib/`
  (public site) and `lib/admin/data/` + `lib/admin/actions/` (admin), with seed-data
  fallback when Supabase env vars are absent
- **Netlify** — production hosting, including the Next.js runtime and image
  optimization CDN
- **Sharp** + **file-type** — upload-time image resize/re-encode and magic-byte file
  type verification (Media Library)
- **Sentry** — error monitoring, client + server
- **Google Analytics 4 + Google Tag Manager + Microsoft Clarity** — all live, all
  independently optional
- **Upstash Redis** — rate limiting on public forms and admin login
- **Resend** — transactional email
- **Vitest** — RLS regression tests run against the real Supabase project (throwaway
  rows, cleaned up after each test), rate-limit tests, and pure-function unit tests
  (media validation, email sanitization, legacy-data fallbacks)
- **Lighthouse CI** — performance/accessibility/SEO audits against real deployments

## Security

Site-wide security headers (CSP, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`'s `headers()`. CSP
currently ships as `Content-Security-Policy-Report-Only` — monitor a deployed preview
for violations before switching it to enforcing (see the comment above that function for
exactly what to check).

Other hardening worth knowing about if you're extending these areas:

- **Media Library uploads** (`lib/admin/actions/media.ts`) — server-side allowlist of
  accepted MIME types, magic-byte verification of actual file content (not just the
  client-declared type), and the storage path's extension is derived from the verified
  type rather than the uploaded filename.
- **Public form email** (`contact`, `trip-planner`) — user input going into an email
  subject line is run through `sanitizeForEmailSubject()` (`lib/enquiry-shared.ts`);
  HTML bodies already escape every user value via `escapeHtml()`
  (`lib/email-templates.ts`).
- **Rate limiting** (`lib/rate-limit.ts`) — prefers Netlify's platform-verified
  `x-nf-client-connection-ip` header over the spoofable `x-forwarded-for`. Applies to
  contact, trip planner, booking, and admin login (by IP and by the submitted email).
- **AI integration**: no LLM is wired up yet (the trip planner is a form). Required
  practices for whoever builds that feature are documented in
  `docs/ai-integration-guidelines.md`, written now so it's designed safely from the
  start.

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
  `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
- Production values for all of the above live in Netlify's Site settings → Environment
  variables, not just `.env.local` — a var added locally has no effect on the deployed
  site until it's also added there and a build runs.
- CI builds without any Supabase secrets by setting `SKIP_ENV_VALIDATION=1` — that job
  checks compile correctness only, not real data. A real build (Netlify, or a local
  `npm run build` without `.env.local`) is expected to fail loudly on the required vars.

### Verifying a production build

```bash
npm run build
```

`next/font/google` fetches fonts from Google at build time, so the build machine needs
outbound internet access to `fonts.googleapis.com` — works on Netlify and any normal dev
machine by default.

### Tests

```bash
npm test
```

Runs `tests/rls/*.test.ts` (RLS regression tests against the real Supabase project —
every test creates its own throwaway rows and cleans them up, nothing reads/writes real
content), `tests/rate-limit.test.ts`, and a set of pure-function unit tests needing no
live services (Media Library validation, email sanitization, legacy-data fallbacks). The
RLS and rate-limit tests need the Supabase/Upstash env vars above; the pure-function
tests don't.

### Lint

```bash
npm run lint
```

Currently fails with 135+ pre-existing `@typescript-eslint/no-explicit-any` errors
scattered across the codebase (mostly Supabase row mappers typed as
`Record<string, any>` by design). CI doesn't run this against the whole repo for that
reason — instead `.github/workflows/ci.yml`'s `lint` job only lints files changed in
each push/PR, so old debt doesn't block CI but nothing new can land uncaught. Don't let
the full-repo failure block you locally; just don't add new lint errors in files you
touch.

### CI

- `.github/workflows/ci.yml` — typecheck + build, changed-file lint, and RLS/rate-limit
  tests, on every push/PR to `main`/`Dev2`.
- `.github/workflows/lighthouse.yml` — performance/accessibility/SEO audit against real
  Production deployments (not every push — audits are slow, this tracks trends).
- `.github/workflows/smoke-test.yml` — post-deploy smoke test.
- `.github/workflows/supabase-keep-alive.yml` — see below.

### Supabase keep-alive

`.github/workflows/supabase-keep-alive.yml` runs a real, minimal read query
(`scripts/keep-supabase-alive.ts`) against the database every 3 days.

This exists because Supabase's free tier auto-pauses a project after 7 days with zero
database queries — and this app's data-fetching functions (`lib/tours.ts`,
`lib/destinations.ts`, etc.) fail open to an *empty* result when the database isn't
reachable, not seed/demo data, so a paused project would mean the live site quietly
renders empty pages instead of erroring visibly. A plain HTTP ping to the project URL
would **not** prevent the pause — it has to be a real query against a table, which is
why this is a script rather than a `curl` in the workflow YAML.

If the query fails, the workflow fails loudly: the Actions run itself goes red, and (if
`SENTRY_DSN` is configured as a repo secret) a Sentry event is also captured, since a
silently-broken keep-alive defeats its own purpose.

**To verify it's working:**

- Check the Actions tab for the `Supabase Keep-Alive` workflow's run history.
- Trigger it manually any time via **Actions → Supabase Keep-Alive → Run workflow**
  (`workflow_dispatch`), without waiting for the schedule.
- To verify the *failure* path specifically, run it manually with the
  `simulate_failure` input checked — this deliberately queries a nonexistent table, so
  you can confirm the run goes red and a Sentry event shows up, without touching any
  real code.

### Backups

`.github/workflows/backup.yml` runs `scripts/backup-database.ts` and
`scripts/backup-media.ts` daily, uploading a full database dump and every Media Library
file to Cloudflare R2.

This exists because Supabase's automatic backups are a Pro-plan-and-up feature —
Free-tier projects (this one; see "Supabase keep-alive" above) get none at all. Without
this workflow, losing the Supabase project loses the database and every uploaded photo
permanently, with nothing to restore from.

**One-time setup** (not needed to run the app locally, only to have real backups):

1. Create a Cloudflare account (free) and an R2 bucket — Cloudflare dashboard → R2
   Object Storage → Create bucket. R2's free tier (10GB storage, no egress fees) is far
   more than this project needs for a while.
2. Create an API token scoped to R2 — R2 → Manage API Tokens → Create API Token, with
   Object Read & Write permission. Note the Access Key ID, Secret Access Key, and your
   Account ID (shown on the R2 overview page).
3. Add five repo secrets (Settings → Secrets and variables → Actions → New repository
   secret) — add the *values* there directly, never paste them into a commit, PR, or
   chat:
   - `DATABASE_URL` — Supabase Dashboard → Project Settings → Database → Connection
     string → URI, **"Session pooler"** specifically. Not "Direct connection" —
     confirmed directly, it resolves IPv6-only on newer Supabase projects and GitHub
     Actions runners have no IPv6 egress, so the first live run of this workflow failed
     with "Network is unreachable". Not "Transaction pooler" either — it doesn't
     support the session-level features `pg_dump` needs. Session pooler is the one
     that's both IPv4-reachable from Actions and session-capable.
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` —
     from step 2.

**To verify it's working:**

- Check the Actions tab for the `Backup` workflow's run history.
- Trigger it manually any time via **Actions → Backup → Run workflow**
  (`workflow_dispatch`), without waiting for the schedule.
- Check the R2 bucket directly for `database/<date>.sql.gz` and `media/<date>/...`
  objects after a run.

**Restoring:** download a `database/<date>.sql.gz`, `gunzip` it, and run
`psql <target-connection-string> -f database.sql` against a fresh Supabase project (or
any Postgres instance). Actually run this once against a scratch project so the restore
path is proven before the day it's needed for real — a backup nobody has restored isn't
a verified backup.

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
- `docs/` — standalone guides for things too specific for this file (replacing
  placeholder images, AI integration guidelines).

**Design principle to follow**: optional integrations (email, Sentry, rate limiting,
analytics) all fail open — the feature just doesn't activate rather than breaking
anything when unconfigured. Follow this pattern for any new external integration
(`lib/env.ts` documents the reasoning inline). The one deliberate exception is
`SUPABASE_SERVICE_ROLE_KEY`, which is required and validated at boot — the app cannot
correctly serve real traffic without it.

## Roadmap — future path

The core platform (public site, 24-module admin dashboard, real persistence,
integrations, security hardening) is built and live. What's next, in the order it'll
most likely get tackled:

1. **Customer account creation** — currently every booking is enquiry-first with no
   customer login; a real account system (order history, saved trips, faster repeat
   bookings) is the next foundational piece.
2. **Payment creation** — an actual online payment gateway. Today the business quotes by
   email/WhatsApp and takes payment offline entirely; this is the biggest single change
   to the booking flow, and `discount_codes` (see "What's dormant" above) becomes worth
   building once it lands.
3. **A comprehensive CRM** — Customer Management exists today (`/admin/customers`) but
   is catalog-adjacent, not a full CRM (no lifecycle stages, campaign history, or
   automated follow-up sequences yet).
4. **Automated backups** — Supabase's own point-in-time recovery covers infrastructure
   failure, but there's no independent, app-level backup/export process yet for the
   business's own peace of mind.

Explicitly **out of scope** unless the client's budget changes: affiliate management,
any feature that depends on online payment being live first (see #2).
