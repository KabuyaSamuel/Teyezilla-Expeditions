// Lighthouse CI config for public marketing pages, run against a real
// deployment (not a local build+serve) so scores reflect actual network/
// CDN conditions. Base URL is overridable via LHCI_BASE_URL (the
// smoke-test workflow does the same thing for the same reason: preview
// deployments should be checked on their own URL, not just production).
//
// Assertions are deliberately loose ("warn", not "error") and set as a low
// floor rather than a target: nobody has actually benchmarked this site's
// current Lighthouse scores yet, so an aspirational threshold would just
// make this workflow red on day one for no actionable reason (the same
// mistake almost made with eslint in ci.yml). Tighten these once real
// baseline numbers exist.

const baseUrl = (process.env.LHCI_BASE_URL || "https://www.teyezillaexpeditions.com").replace(/\/$/, "");

module.exports = {
  ci: {
    collect: {
      url: [
        `${baseUrl}/`,
        `${baseUrl}/safari`,
        `${baseUrl}/journeys`,
        `${baseUrl}/destinations`,
        `${baseUrl}/journeys/great-kenyan-frontier-expedition`,
        `${baseUrl}/tours/zanzibar-beach-escape`,
      ],
      numberOfRuns: 1,
      settings: {
        // GitHub Actions runners (and this dev sandbox) need --no-sandbox
        // for Chrome to launch at all; without it, Lighthouse just hangs.
        chromeFlags: "--no-sandbox --headless",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.3 }],
        "categories:accessibility": ["warn", { minScore: 0.5 }],
        "categories:seo": ["warn", { minScore: 0.5 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
