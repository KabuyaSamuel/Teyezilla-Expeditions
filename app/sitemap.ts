import type { MetadataRoute } from "next";
import { getDestinations } from "@/lib/destinations";
import { getPublishedTours } from "@/lib/tours";

const BASE_URL = "https://www.teyezillaexpeditions.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, tours] = await Promise.all([getDestinations(), getPublishedTours()]);

  const staticRoutes = [
    "",
    "/destinations",
    "/safari",
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
