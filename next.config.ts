import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // TEMP: picsum.photos serves placeholder images until real destination
    // and tour photography is added to /public/images or Supabase Storage.
    // upload.wikimedia.org serves real (CC BY-SA licensed, credited in
    // HeroCarousel.tsx) Kenyan wildlife photos standing in for the hero
    // carousel until Teyezilla supplies its own photography. The Supabase
    // hostname serves real uploads from the Media Library (Storage).
    // Remove the first two once real image URLs are used everywhere.
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
// SENTRY_AUTH_TOKEN is added to Vercel. Not setting disableLogger/
// automaticVercelMonitors -- both are webpack-only options and this
// project builds with Turbopack, so they'd be silent no-ops either way.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
