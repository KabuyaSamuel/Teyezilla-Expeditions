import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedAdminBlogPosts, type AdminBlogPost } from "./blog.seed";

export type { AdminBlogPost };

// NOTE: the public-facing /blog and /blog/[slug] pages currently hold their
// own hardcoded article content (with the answer-first/AEO blocks written
// directly into the page) rather than reading from `blog_posts`. This admin
// module reads/writes the real table so editorial workflow (draft/schedule/
// publish) works against real data; migrating the public pages' article
// bodies into the database is a follow-up content-migration task, not a
// code change — the schema and this data layer are already ready for it.

function mapRow(row: Record<string, any>): AdminBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category ?? "",
    tags: row.tags ?? [],
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    featuredImage: row.hero_image ?? "",
    status: row.status,
    scheduledFor: row.published_at && row.status === "scheduled" ? row.published_at : undefined,
    publishedAt: row.status === "published" ? row.published_at : undefined,
  };
}

export async function getAdminBlogPosts(): Promise<AdminBlogPost[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedAdminBlogPosts;

  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[blog] Supabase query failed, using seed data:", error?.message);
    return seedAdminBlogPosts;
  }

  return data.map(mapRow);
}

export async function getAdminBlogPostBySlug(slug: string): Promise<AdminBlogPost | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedAdminBlogPosts.find((p) => p.slug === slug);

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[blog] Supabase query failed, using seed data:", error.message);
    return seedAdminBlogPosts.find((p) => p.slug === slug);
  }

  return mapRow(data);
}
