#!/usr/bin/env node
// Hits a handful of real pages on a real deployment and checks they render
// without error. This exists specifically because of a bug that nothing
// else in this repo's CI would catch: a missing SUPABASE_SERVICE_ROLE_KEY
// env var in Vercel caused a production 500 on /admin/staff/new that only
// showed up once real traffic hit it -- the build succeeded, typecheck
// passed, and every data-fetching function fails open with an empty
// result rather than throwing, so nothing short of an actual HTTP request
// against the real deployed environment would have caught it.
//
// Usage:
//   node scripts/smoke-test.mjs [baseUrl]
//   SMOKE_TEST_URL=https://... node scripts/smoke-test.mjs

const baseUrl = (process.argv[2] || process.env.SMOKE_TEST_URL || "https://www.teyezillaexpeditions.com").replace(/\/$/, "");

// Server-render error markers Next.js/React actually emit in production,
// distinct from any ordinary page content that happens to mention "error"
// (e.g. an FAQ about cancellations).
const ERROR_MARKERS = [
  "An error occurred in the Server Components render",
  "Application error: a client-side exception has occurred",
];

// Routes that exist regardless of catalogue content -- the page itself, not
// any particular tour/journey/etc, so a hardcoded path is safe here.
const STATIC_CHECKS = [
  { path: "/", label: "Homepage" },
  { path: "/safari", label: "Safari (tour category) page" },
  { path: "/journeys", label: "Journeys listing" },
  { path: "/destinations", label: "Destinations listing" },
  { path: "/booking-information", label: "Booking information page" },
  { path: "/faqs", label: "FAQs page" },
  { path: "/admin/login", label: "Admin login page" },
];

// Content-dependent checks: the client deletes and replaces catalogue
// content (tours, journeys, ...) as part of normal site management, so any
// hardcoded slug here goes stale the moment that item is removed or renamed
// -- a real, correct 404, not a bug. Instead of a fixed slug, each entry
// discovers any one live URL matching its path prefix from the site's own
// sitemap.xml at test time, so the check tracks whatever content actually
// exists right now.
const CONTENT_TYPE_CHECKS = [
  { prefix: "/tours/", label: "A real tour detail page" },
  { prefix: "/journeys/", label: "A real journey detail page" },
  { prefix: "/destinations/", label: "A real destination page" },
  { prefix: "/blog/", label: "A real blog post" },
];

// All checks below fire concurrently (see Promise.all in main()), which
// occasionally trips a transient "fetch failed" against one or two of
// them -- confirmed directly: a real failing run had a different random
// subset fail each time, while pages backed by real dynamic data
// (journey/tour detail pages, admin login) consistently passed, and
// Lighthouse's own separate live fetches against the same deployment in
// the same CI run succeeded cleanly. That signature is connection-level
// flakiness from bursting requests at once, not a real app error --
// genuine HTTP error statuses and rendered error-boundary markers still
// fail immediately below, no retry, since those are real problems.
async function fetchWithRetry(url, attempts = 5) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetch(url, { redirect: "follow" });
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw lastErr;
}

// Discovers live content URLs from the deployment's own sitemap.xml rather
// than trusting hardcoded slugs, so checks track whatever the client
// currently has published instead of a snapshot from whenever this test was
// last written.
async function fetchSitemapPaths() {
  const res = await fetchWithRetry(`${baseUrl}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

function buildContentChecks(sitemapPaths, sitemapError) {
  return CONTENT_TYPE_CHECKS.map(({ prefix, label }) => {
    if (sitemapError) {
      return { path: `${prefix}*`, label, status: "fail", reason: `could not read sitemap.xml to discover a live URL -- ${sitemapError.message}` };
    }
    const match = sitemapPaths.find((p) => p.startsWith(prefix) && p !== prefix);
    if (!match) {
      return { path: `${prefix}*`, label, status: "skip", reason: `no published content currently exists under ${prefix}` };
    }
    return { path: match, label };
  });
}

async function checkPath({ path, label, status: presetStatus, reason: presetReason }) {
  if (presetStatus) {
    return { path, label, status: presetStatus, reason: presetReason };
  }

  const url = `${baseUrl}${path}`;
  try {
    const res = await fetchWithRetry(url);
    const body = await res.text();

    if (!res.ok) {
      return { path, label, status: "fail", reason: `HTTP ${res.status}` };
    }
    const marker = ERROR_MARKERS.find((m) => body.includes(m));
    if (marker) {
      return { path, label, status: "fail", reason: `page rendered an error boundary ("${marker}")` };
    }
    return { path, label, status: "pass" };
  } catch (err) {
    return { path, label, status: "fail", reason: err instanceof Error ? err.message : String(err) };
  }
}

async function main() {
  console.log(`Smoke testing ${baseUrl}\n`);

  let sitemapPaths = [];
  let sitemapError;
  try {
    sitemapPaths = await fetchSitemapPaths();
  } catch (err) {
    sitemapError = err instanceof Error ? err : new Error(String(err));
  }

  const checks = [...STATIC_CHECKS, ...buildContentChecks(sitemapPaths, sitemapError)];
  const results = await Promise.all(checks.map(checkPath));

  let failed = false;
  let skipped = 0;
  for (const r of results) {
    if (r.status === "pass") {
      console.log(`  PASS  ${r.label} (${r.path})`);
    } else if (r.status === "skip") {
      skipped += 1;
      console.log(`  SKIP  ${r.label} (${r.path}) -- ${r.reason}`);
    } else {
      failed = true;
      console.log(`  FAIL  ${r.label} (${r.path}) -- ${r.reason}`);
    }
  }

  console.log("");
  if (failed) {
    console.error("Smoke test failed.");
    process.exit(1);
  }
  console.log(skipped > 0 ? `All smoke checks passed (${skipped} skipped -- no content currently published for that type).` : "All smoke checks passed.");
}

main();
