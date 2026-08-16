// Lighthouse CI config for public marketing pages, run against a real
// deployment (not a local build+serve) so scores reflect actual network/
// CDN conditions. Base URL is overridable via LHCI_BASE_URL (the
// smoke-test workflow does the same thing for the same reason: preview
// deployments should be checked on their own URL, not just production).
//
// Real baseline, measured directly against production on 2026-08-02
// (`npx lighthouse <url> --only-categories=performance,accessibility,seo,
// best-practices`, one run per URL, no averaging):
//
//   URL                                                perf  a11y  seo  bp
//   /                                                    63    92  100 100
//   /safari                                              94    96  100 100
//   /journeys                                            85    94  100 100
//   /destinations                                        82    94  100 100
//   /journeys/great-kenyan-frontier-expedition            90    96  100 100
//   /tours/zanzibar-beach-escape                          89    96  100 100
//
// /tours/zanzibar-beach-escape above no longer exists in the catalogue as
// of 2026-08-13 (confirmed 404 both live and in the Lighthouse workflow
// run right after PR #45's merge -- https://github.com/KabuyaSamuel/
// Teyezilla-Expeditions/actions/runs/31672995465) -- swapped for
// /tours/maasai-mara-safari, a currently-published, statically-generated
// tour page. Not re-baselined with its own measured row above: the
// existing thresholds below are already the loosest (worst-page minus
// margin) across the rest of this set, so they still apply without
// fabricating a number for a page that hasn't actually been measured.
//
// The homepage is the clear outlier on performance (hero video carousel);
// every other page scores 82+. Thresholds below are the worst-page score
// minus a 5-point margin, so a real regression fails without flagging
// ordinary run-to-run noise. Performance stays "warn" (a single run isn't
// averaged, so it's the noisiest metric); accessibility/seo/best-practices
// are stable enough to "error" on.

const baseUrl = (process.env.LHCI_BASE_URL || "https://www.teyezillaexpeditions.com").replace(/\/$/, "");

// Vercel sends `X-Robots-Tag: noindex` on every preview deployment
// automatically (confirmed directly) -- correct, deliberate platform
// behavior, not something this app controls or should try to override.
// Lighthouse's SEO category penalizes exactly that ("blocked from
// indexing"), so asserting on it against a Dev2 preview would be
// asserting on Vercel's own noindex header, not a real regression --
// same reasoning lighthouserc.admin.js already applies to the
// deliberately-noindex'd admin dashboard.
const isProduction = baseUrl === "https://www.teyezillaexpeditions.com";

// Preview deployments (Dev2 pushes) sit behind Vercel's Deployment
// Protection SSO wall -- confirmed directly: an unauthenticated request to
// a preview URL 302s to vercel.com/sso-api instead of serving the app.
// Appended as query params rather than sent via collect.settings.extraHeaders
// (a header, unlike a cookie, isn't scoped by origin) -- confirmed directly
// that broke things: extraHeaders applies to *every* request the page
// makes, including cross-origin ones like the browser's own Sentry error
// reporting, whose CORS preflight rejected the unexpected header and
// blocked the request outright, a real console error that only existed
// because of this test setup, not a real app bug. Vercel's response to a
// request carrying these sets a bypass cookie instead, which the browser
// naturally only ever re-sends to Vercel's own origin on later navigations
// -- correctly scoped without any extra work. Harmless to omit
// (production isn't protected, so this is only ever set for Dev2/preview).
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const withBypass = (url) =>
  bypassSecret ? `${url}?x-vercel-protection-bypass=${bypassSecret}&x-vercel-set-bypass-cookie=true` : url;

// best-practices dropped from the 100 in the baseline table above (measured
// pre-Clarity) to a real, permanent ceiling of ~0.79 after Microsoft
// Clarity was added on 2026-08-09 (commit 6f6a883) -- confirmed via the
// actual Lighthouse report JSON from a live Dev2 run, not just the
// pass/fail summary. Root cause: Clarity's tracking pixel redirects
// through a Bing Ads sync pixel (c.bing.com/c.gif) that sets third-party
// cookies (CLID, MUID, SRM_B, etc.), tripping both the "third-party
// cookies" audit (weight 5/28) and the resulting "issues logged in
// DevTools" audit (weight 1/28) -- 6 of 28 points lost on every single
// page, deterministically, not run-to-run noise. This is Clarity's own
// default snippet behavior, not an opt-in integration -- confirmed
// directly in the Clarity dashboard's Integrations page, which shows
// Microsoft Ads as "Not Connected". Not fixable via CSP (a same-origin-
// permitted request setting a cookie isn't a policy violation to block).
// Decision made 2026-08-16: keep Clarity (heatmaps/session replay GA4
// doesn't provide) and accept this ceiling rather than rip it out.
// Unrelated to performance/accessibility/SEO, which stay fully achievable
// at 90-100 -- this is the one category Clarity puts a hard cap on.
module.exports = {
  ci: {
    collect: {
      url: [
        `${baseUrl}/`,
        `${baseUrl}/safari`,
        `${baseUrl}/journeys`,
        `${baseUrl}/destinations`,
        `${baseUrl}/journeys/great-kenyan-frontier-expedition`,
        `${baseUrl}/tours/maasai-mara-safari`,
      ].map(withBypass),
      numberOfRuns: 1,
      settings: {
        // GitHub Actions runners (and this dev sandbox) need --no-sandbox
        // for Chrome to launch at all; without it, Lighthouse just hangs.
        chromeFlags: "--no-sandbox --headless",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.58 }],
        "categories:accessibility": ["error", { minScore: 0.87 }],
        ...(isProduction ? { "categories:seo": ["error", { minScore: 0.95 }] } : {}),
        "categories:best-practices": ["error", { minScore: 0.74 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
