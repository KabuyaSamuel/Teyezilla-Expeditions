import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { SENTRY_INGEST_ORIGIN } from "./lib/site";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // upload.wikimedia.org serves one real, CC BY 2.0 licensed photo
    // (credited in components/WhyChoose.tsx) standing in for that section
    // until Teyezilla supplies its own. The homepage hero itself is a
    // Mixkit stock video, not an Image (see components/HeroCarousel.tsx) --
    // it doesn't need an entry here since next/image isn't involved. The
    // Supabase hostname serves real uploads from the Media Library
    // (Storage), used for all destination/tour/journey/blog photography.
    // picsum.photos/fastly.picsum.photos were here for placeholder images;
    // every reference to them (database rows, site_settings, seed data)
    // has been replaced with real Media Library uploads, so they're
    // removed rather than left allowlisted for content that no longer
    // exists. See docs/replacing-placeholder-images.md.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      ...(supabaseHostname
        ? [{ protocol: "https" as const, hostname: supabaseHostname }]
        : []),
    ],
    // Netlify's image CDN otherwise serves optimized images with
    // max-age=0,must-revalidate -- every repeat view re-fetches full-size
    // photography instead of hitting cache, which is most of what
    // Lighthouse's "image delivery"/"cache lifetime" findings were
    // flagging. A day, not a year: admin-uploaded media (Media Library)
    // can change reasonably often, and this project has already hit a
    // stale-asset surprise once with an aggressively-cached logo file.
    minimumCacheTTL: 60 * 60 * 24,
    // Default-only quality is 75; Lighthouse's "improve image delivery"
    // flagged tour card photography as over-compressed for its actual
    // display size. 70 is the extra bucket TourCard opts into below --
    // visually indistinguishable at card size, smaller transfer.
    qualities: [70, 75],
  },
  experimental: {
    serverActions: {
      // Default is 1MB, too small for real media uploads.
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      // /tours never had a listing page -- only /tours/[slug] detail pages
      // exist, so it 404s. Tour listings actually live at /experiences.
      {
        source: "/tours",
        destination: "/experiences",
        permanent: true,
      },
    ];
  },

  // Site-wide security headers. Every one of these applies to every route
  // (public + /admin) via the "/:path*" match below -- there was no
  // headers() function at all before this, so the site shipped with zero
  // of the standard defensive headers.
  //
  // CSP ships as Report-Only for now, deliberately: it's the one header
  // here with real potential to break something (a legitimate script/image/
  // connection that isn't on the allowlist gets silently blocked instead
  // of just reported), so it needs a monitoring period against a real
  // deployed preview -- checking the browser console for
  // "[Report Only]" CSP violations across the public site (forms,
  // HeroCarousel video, YouTube blog embeds, GTM/GA4/Clarity, Sentry) and
  // /admin (Media Library upload, every *Form.tsx) -- before switching the
  // header name to the enforcing `Content-Security-Policy`. The other four
  // headers are all safe to enforce immediately; they only restrict
  // behaviors (framing, MIME sniffing, referrer leakage, unused browser
  // features) this app never relied on.
  async headers() {
    // Reuses the same hostname derivation as images.remotePatterns above
    // instead of hardcoding the project ref, so this stays correct if the
    // Supabase project ever changes without a second edit here.
    const supabaseOrigin = supabaseHostname ? `https://${supabaseHostname}` : "";

    // Sentry's browser SDK (instrumentation-client.ts) sends events
    // directly to its ingest host -- there's no `tunnel` option configured
    // routing that traffic through our own domain instead, so CSP has to
    // allow it explicitly. Shared with app/layout.tsx's preconnect hint
    // via lib/site.ts -- see SENTRY_INGEST_ORIGIN's own comment for why.
    const sentryIngestOrigin = SENTRY_INGEST_ORIGIN;

    // Vercel injects its own Live Feedback toolbar script (vercel.live) on
    // Preview deployments only -- never on production -- so allowlisting it
    // is scoped to non-production builds specifically, rather than widening
    // the production CSP for a script that never actually loads there.
    // VERCEL_ENV is baked in per-deployment at build time (preview and
    // production are separate builds), so this evaluates correctly for
    // whichever deployment is serving the request.
    const isProductionDeploy = process.env.VERCEL_ENV === "production";

    const csp = [
      "default-src 'self'",
      // 'unsafe-inline' here covers two real, current needs rather than
      // being a placeholder: Next.js App Router's own hydration/RSC
      // bootstrap scripts are inline with no nonce wired up yet, and the
      // Microsoft Clarity snippet (app/layout.tsx) is a genuinely inline
      // <Script> block, not an external src. Tightening this to a
      // nonce-based policy (middleware-generated nonce threaded through)
      // is a real follow-up, not done here to keep this pass's blast
      // radius (and risk of breaking hydration) contained.
      // Clarity needs the wildcard, not just www.clarity.ms: the initial
      // tag at www.clarity.ms only bootstraps the real script, which then
      // loads from scripts.clarity.ms -- confirmed directly via a real
      // Lighthouse run against a deployed preview, which showed Clarity's
      // own script blocked by this exact gap (Chrome DevTools Issues panel,
      // CSP issueType). connect-src below already used the wildcard for the
      // same reason; script-src just hadn't been widened to match.
      `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms${isProductionDeploy ? "" : " https://vercel.live"}`,
      // next/image's `fill` prop sets inline `style` attributes directly
      // on the element (position/inset) -- without 'unsafe-inline' here,
      // every fill image on the site (TourCard, DestinationCard,
      // JourneyCard, HeroCarousel, CategoryOverview...) would violate this
      // directive.
      "style-src 'self' 'unsafe-inline'",
      // Most photography is same-origin from the browser's perspective even
      // though it originates in Supabase Storage -- next/image proxies it
      // through /_next/image (or Netlify's Image CDN), so the <img> tag's
      // actual src is usually our own origin, and 'self' would be enough on
      // its own. The Media Library lightbox (MediaGallery.tsx) is the one
      // exception: it needs the image's real natural dimensions to size
      // itself, which next/image's `fill` mode can't give it without a
      // fixed-size box, so it points a raw <img> straight at Supabase
      // Storage instead -- same reasoning as media-src below. Clarity's own
      // tracking pixel (c.clarity.ms/c.gif) is the other real need here --
      // same blocked-script discovery as script-src above. That pixel
      // itself 302-redirects to a Bing Ads sync pixel (c.bing.com/c.gif,
      // part of Clarity's Microsoft Ads integration, not something this
      // app calls directly) -- confirmed via the request's actual network
      // trace, so the redirect target needs allowlisting too, or the
      // browser blocks the redirected request even though the initial one
      // was permitted.
      `img-src 'self' data: https://*.clarity.ms https://*.bing.com${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
      // The hero background (HeroCarousel.tsx) is the one place video
      // isn't going through next/image -- a raw <video><source> pointing
      // straight at the Supabase Storage URL, so media-src needs it
      // explicitly (img-src's same-origin proxying doesn't apply here).
      `media-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
      // next/font/google self-hosts font files at build time (no runtime
      // fonts.googleapis.com/fonts.gstatic.com request), so 'self' is
      // genuinely sufficient here, not an oversight.
      "font-src 'self' data:",
      // Every real fetch()/XHR this app makes client-side: Supabase
      // (auth session refresh, any client-side reads), Sentry error
      // reporting, and the three analytics beacons. Resend is
      // deliberately absent -- it's only ever called server-side from
      // "use server" actions, never from the browser.
      `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ""} ${sentryIngestOrigin} https://www.google-analytics.com https://*.google-analytics.com https://www.clarity.ms https://*.clarity.ms`,
      // The only embedded cross-origin content anywhere on the site:
      // YouTube embeds in blog post video blocks (BlogContentBlocks.tsx).
      "frame-src https://www.youtube-nocookie.com",
      // Belt-and-suspenders with the X-Frame-Options header below --
      // frame-ancestors is the modern equivalent and takes precedence in
      // any browser that supports it, but costs nothing to set both.
      "frame-ancestors 'none'",
      "base-uri 'self'",
      // Every form on this site submits via a Next.js Server Action
      // (same-origin by construction) -- no legitimate cross-origin form
      // target exists to allow.
      "form-action 'self'",
      // No Flash/legacy plugin content anywhere; safe to fully disable.
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: [
              // Hardware/privacy-sensitive features this site has no use
              // for at all -- fully disabled, not even for same-origin.
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "midi=()",
              // Legacy FLoC opt-out; costs nothing to include.
              "interest-cohort=()",
              // These stay open to self + the YouTube embed origin
              // specifically (not a bare wildcard) -- the blog's YouTube
              // video blocks (BlogContentBlocks.tsx) request exactly these
              // via the iframe's own `allow` attribute, and a top-level
              // Permissions-Policy that fully disabled them would override
              // and break that delegation regardless of what the iframe
              // itself asks for.
              'accelerometer=(self "https://www.youtube-nocookie.com")',
              'gyroscope=(self "https://www.youtube-nocookie.com")',
              'autoplay=(self "https://www.youtube-nocookie.com")',
              'encrypted-media=(self "https://www.youtube-nocookie.com")',
              'picture-in-picture=(self "https://www.youtube-nocookie.com")',
              'clipboard-write=(self "https://www.youtube-nocookie.com")',
              'web-share=(self "https://www.youtube-nocookie.com")',
              'fullscreen=(self "https://www.youtube-nocookie.com")',
            ].join(", "),
          },
        ],
      },
      // Was a Netlify-only header rule (netlify.toml); moved here so it's
      // host-agnostic instead of silently dropping on any other platform.
      // public/*.png (logo, og-image) are plain filenames, not content-
      // hashed like _next/static, so a long cache risks repeating the
      // stale-logo confusion this project already ran into once -- a day,
      // not a year/immutable.
      {
        source: "/:path*.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
    ];
  },
};

// org/project/authToken come from env vars rather than being hardcoded so
// this works with an empty/unconfigured Sentry setup: the Sentry build
// plugin skips source map upload (with a warning, not a build failure)
// when authToken is undefined, which is the expected state until a real
// SENTRY_AUTH_TOKEN is added to the hosting platform's env vars. Not
// setting disableLogger/automaticVercelMonitors -- both are webpack-only
// options and this project builds with Turbopack, so they'd be silent
// no-ops either way (automaticVercelMonitors is also Vercel-specific and
// a no-op on Netlify regardless).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
