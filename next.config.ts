import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // TEMP: picsum.photos serves placeholder images until real destination
    // and tour photography is added to /public/images or Supabase Storage.
    // upload.wikimedia.org serves one real, CC BY 2.0 licensed photo
    // (credited in components/WhyChoose.tsx) standing in for that section
    // until Teyezilla supplies its own. The homepage hero itself is a
    // Mixkit stock video, not an Image (see components/HeroCarousel.tsx) --
    // it doesn't need an entry here since next/image isn't involved. The
    // Supabase hostname serves real uploads from the Media Library
    // (Storage), already used for some journeys/blog posts.
    // Remove the first two once real image URLs are used everywhere. See
    // docs/replacing-placeholder-images.md.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // picsum.photos redirects here for the actual image bytes.
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
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
  },
  experimental: {
    serverActions: {
      // Default is 1MB, too small for real media uploads.
      bodySizeLimit: "10mb",
    },
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
