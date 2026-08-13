import type { MetadataRoute } from "next";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/site";

// The sitemap must always reflect the database's CURRENT catalogue, so it's
// deliberately not a build-time static artifact (it would otherwise keep
// listing deleted/renamed tours, journeys, etc. until the next deploy --
// dead URLs that hurt SEO and trip the smoke test, which discovers its
// content checks from this file). Rendering on every request is fine for a
// sitemap: requests are infrequent (crawlers, the smoke test) and each is a
// small indexed select over six tables.
export const revalidate = 0;

// Queries slug + updated_at directly rather than going through lib/tours.ts
// etc. -- those return the app-wide shape (Tour, Journey, ...), none of
// which expose updated_at today, and adding it there would ripple into
// every consumer for a field only the sitemap needs.
async function slugsWithLastModified(
  table: string,
  options: { statusColumn?: boolean; dateColumn?: "updated_at" | "created_at" } = {}
): Promise<{ slug: string; lastModified: Date }[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const dateColumn = options.dateColumn ?? "updated_at";
  let query = supabase.from(table).select(`slug, ${dateColumn}`);
  if (options.statusColumn) query = query.eq("status", "published");

  const { data, error } = await query;
  if (error || !data) {
    console.warn(`[sitemap] ${table} query failed:`, error?.message);
    return [];
  }

  return (data as unknown as Record<string, string | null>[]).map((row) => ({
    slug: row.slug as string,
    lastModified: row[dateColumn] ? new Date(row[dateColumn] as string) : new Date(),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, tours, journeys, blogPosts, collections, experienceTypes] = await Promise.all([
    slugsWithLastModified("destinations"),
    slugsWithLastModified("tours", { statusColumn: true }),
    slugsWithLastModified("journeys", { statusColumn: true }),
    slugsWithLastModified("blog_posts", { statusColumn: true }),
    slugsWithLastModified("collections", { statusColumn: true }),
    slugsWithLastModified("experience_types", { dateColumn: "created_at" }),
  ]);

  const now = new Date();

  // Every static (non-dynamic) public route, i.e. every app/(public)/**/
  // page.tsx that isn't a [slug]/[category] segment or the admin dashboard.
  // /booking/confirmation/[reference] is deliberately excluded (private,
  // per-customer, never meant to be discovered via search).
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/booking",
    "/booking-information",
    "/cancellation-policy",
    "/collections",
    "/contact",
    "/destinations",
    "/experiences",
    "/faqs",
    "/journeys",
    "/privacy-policy",
    "/private-travel",
    "/reviews",
    "/safari",
    "/tailor-made-trips",
    "/terms",
    "/travel-guide",
    "/trip-planner",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));

  const destinationRoutes = destinations.map((d) => ({
    url: `${SITE_URL}/destinations/${d.slug}`,
    lastModified: d.lastModified,
  }));

  const tourRoutes = tours.map((t) => ({
    url: `${SITE_URL}/tours/${t.slug}`,
    lastModified: t.lastModified,
  }));

  const journeyRoutes = journeys.map((j) => ({
    url: `${SITE_URL}/journeys/${j.slug}`,
    lastModified: j.lastModified,
  }));

  const blogRoutes = blogPosts.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.lastModified,
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    lastModified: c.lastModified,
  }));

  const experienceRoutes = experienceTypes.map((e) => ({
    url: `${SITE_URL}/experiences/${e.slug}`,
    lastModified: e.lastModified,
  }));

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...tourRoutes,
    ...journeyRoutes,
    ...blogRoutes,
    ...collectionRoutes,
    ...experienceRoutes,
  ];
}
