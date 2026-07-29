import type { BlogPost } from "@/types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

function mapRow(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) ?? "",
    answer: (row.answer as string) ?? "",
    body: (row.body as string) ?? "",
    bodyBlocks: Array.isArray(row.body_blocks) ? (row.body_blocks as BlogPost["bodyBlocks"]) : [],
    heroImage: (row.hero_image as string) ?? "",
    authorName: (row.author_name as string) ?? "",
    authorBio: (row.author_bio as string) ?? "",
    publishedAt: (row.published_at as string) ?? "",
    category: (row.category as string) ?? "",
    destinationId: (row.destination_id as string) ?? null,
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    ogImage: (row.og_image as string) ?? "",
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[blog] Supabase not configured, returning no posts.");
    return [];
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.warn("[blog] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

// Powers "related articles" sections on tour/journey/destination pages.
export async function getRelatedBlogPosts(
  destinationId: string,
  excludeSlug?: string,
  limit = 3
): Promise<BlogPost[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("destination_id", destinationId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (excludeSlug) query = query.neq("slug", excludeSlug);

  const { data, error } = await query;
  if (error || !data) {
    if (error) console.warn("[blog] Related posts query failed:", error.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[blog] Supabase not configured, returning no post.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[blog] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
