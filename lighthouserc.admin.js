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
// Assertions are "warn" thresholds, deliberately low: the point right now
// is to get real numbers on record, not fail a workflow on a known
// problem. Tighten these as the dashboard's performance actually improves.

// TODO: switch back to the custom domain (www.teyezillaexpeditions.com)
// once it's connected in Vercel -- not live yet, so DNS for it doesn't
// resolve at all.
const baseUrl = (process.env.LHCI_BASE_URL || "https://teyezillaexpeditions.vercel.app").replace(/\/$/, "");

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
        "categories:performance": ["warn", { minScore: 0.15 }],
        "categories:accessibility": ["warn", { minScore: 0.5 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
