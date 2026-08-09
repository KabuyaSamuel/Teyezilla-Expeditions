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
// The homepage is the clear outlier on performance (hero video carousel);
// every other page scores 82+. Thresholds below are the worst-page score
// minus a 5-point margin, so a real regression fails without flagging
// ordinary run-to-run noise. Performance stays "warn" (a single run isn't
// averaged, so it's the noisiest metric); accessibility/seo/best-practices
// are stable enough to "error" on.

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
        "categories:performance": ["warn", { minScore: 0.58 }],
        "categories:accessibility": ["error", { minScore: 0.87 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
