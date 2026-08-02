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

// TODO: switch back to the custom domain (www.teyezillaexpeditions.com)
// once it's connected in Vercel -- it isn't live yet, so DNS for it
// doesn't resolve and every check here fails with "fetch failed"/Chrome
// interstitial errors that have nothing to do with the app itself.
const baseUrl = (process.argv[2] || process.env.SMOKE_TEST_URL || "https://teyezillaexpeditions.vercel.app").replace(/\/$/, "");

// Server-render error markers Next.js/React actually emit in production,
// distinct from any ordinary page content that happens to mention "error"
// (e.g. an FAQ about cancellations).
const ERROR_MARKERS = [
  "An error occurred in the Server Components render",
  "Application error: a client-side exception has occurred",
];

const CHECKS = [
  { path: "/", label: "Homepage" },
  { path: "/safari", label: "Safari (tour category) page" },
  { path: "/journeys", label: "Journeys listing" },
  { path: "/destinations", label: "Destinations listing" },
  { path: "/journeys/great-kenyan-frontier-expedition", label: "A real journey detail page" },
  { path: "/tours/zanzibar-beach-escape", label: "A real tour detail page" },
  { path: "/booking-information", label: "Booking information page" },
  { path: "/faqs", label: "FAQs page" },
  { path: "/admin/login", label: "Admin login page" },
];

async function checkPath({ path, label }) {
  const url = `${baseUrl}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const body = await res.text();

    if (!res.ok) {
      return { path, label, ok: false, reason: `HTTP ${res.status}` };
    }
    const marker = ERROR_MARKERS.find((m) => body.includes(m));
    if (marker) {
      return { path, label, ok: false, reason: `page rendered an error boundary ("${marker}")` };
    }
    return { path, label, ok: true };
  } catch (err) {
    return { path, label, ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

async function main() {
  console.log(`Smoke testing ${baseUrl}\n`);
  const results = await Promise.all(CHECKS.map(checkPath));

  let failed = false;
  for (const r of results) {
    if (r.ok) {
      console.log(`  PASS  ${r.label} (${r.path})`);
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
  console.log("All smoke checks passed.");
}

main();
