import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TEMP: picsum.photos serves placeholder images until real destination
    // and tour photography is added to /public/images or Supabase Storage.
    // Remove this once real image URLs are used everywhere.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
