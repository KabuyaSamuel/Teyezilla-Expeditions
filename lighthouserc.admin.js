// Lighthouse CI config for the authenticated admin dashboard -- built
// specifically because the admin dashboard's performance is known to be
// poor right now; this is the tool for actually measuring and tracking
// that rather than going on impression.
//
// Authenticates via a pre-fetched Supabase session cookie
// (LHCI_ADMIN_COOKIE, produced by scripts/fetch-admin-auth-cookie.mjs and
// sent on every request via extraHeaders) rather than @lhci/cli's
// collect.settings.puppeteerScript. That mechanism was tried first and
// proved unreliable here: LHCI's NodeRunner runs the actual Lighthouse
// audit as a *separate CLI subprocess* that reconnects to the
// puppeteerScript's browser by port, and that handoff didn't reliably
// preserve the just-created session even with disableStorageReset: true
// (confirmed directly -- a second Puppeteer page in the same browser saw
// the cookie fine; the Lighthouse CLI subprocess sometimes didn't).
// Sending the cookie as a header sidesteps browser-state sharing entirely.
//
// Real baseline, measured directly against production on 2026-08-02 (same
// method as lighthouserc.js), authenticated as the dedicated CI staff
// account:
//
//   URL                    perf  a11y  seo  bp
//   /admin                   96    95   63 100
//   /admin/tours              87    91   63 100
//   /admin/journeys           94    91   63 100
//   /admin/bookings           95    95   63 100
//   /admin/operations         97    90   63 100
//
// The dashboard's performance turned out to already be solid (87+ on every
// page) -- the "known to be poor" note above was based on impression, not a
// real measurement; this run is what corrected it. SEO sits at 63
// everywhere and stays unasserted here on purpose: that's the score for a
// dashboard correctly marked noindex (see app/admin/layout.tsx) -- Lighthouse
// penalizes "blocked from indexing" as an SEO issue, but for this route it's
// the intended behavior, not a regression to chase. Thresholds below are the
// worst-page score minus a 5-point margin, same reasoning as lighthouserc.js.

const baseUrl = (process.env.LHCI_BASE_URL || "https://www.teyezillaexpeditions.com").replace(/\/$/, "");

if (!process.env.LHCI_ADMIN_COOKIE) {
  throw new Error(
    "LHCI_ADMIN_COOKIE is not set. Run scripts/fetch-admin-auth-cookie.mjs first and pass its output through as this env var."
  );
}

module.exports = {
  ci: {
    collect: {
      url: [
        `${baseUrl}/admin`,
        `${baseUrl}/admin/tours`,
        `${baseUrl}/admin/journeys`,
        `${baseUrl}/admin/bookings`,
        `${baseUrl}/admin/operations`,
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox --headless",
        extraHeaders: JSON.stringify({ Cookie: process.env.LHCI_ADMIN_COOKIE }),
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.82 }],
        "categories:accessibility": ["error", { minScore: 0.85 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
