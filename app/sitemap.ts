import type { MetadataRoute } from "next";
import { destinations } from "@/lib/destinations";
import { tours } from "@/lib/tours";

const BASE_URL = "https://www.teyezillaexpeditions.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/destinations",
    "/safaris",
    "/experiences",
    "/tailor-made-trips",
    "/blog",
    "/about",
    "/reviews",
    "/contact",
    "/trip-planner",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  const destinationRoutes = destinations.map((d) => ({
    url: `${BASE_URL}/destinations/${d.slug}`,
    lastModified: new Date(),
  }));

  const tourRoutes = tours.map((t) => ({
    url: `${BASE_URL}/tours/${t.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...destinationRoutes, ...tourRoutes];
}
