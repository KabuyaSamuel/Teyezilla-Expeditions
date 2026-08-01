import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentBlock } from "@/lib/blogBlocks";

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  destinationId: string | null;
  excerpt: string;
  answer: string;
  body: string;
  bodyBlocks: ContentBlock[];
  authorName: string;
  authorBio: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  status: "draft" | "published" | "scheduled";
  scheduledFor?: string;
  publishedAt?: string;
}

function mapRow(row: Record<string, any>): AdminBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category ?? "",
    tags: row.tags ?? [],
    destinationId: row.destination_id ?? null,
    excerpt: row.excerpt ?? "",
    answer: row.answer ?? "",
    body: row.body ?? "",
    bodyBlocks: Array.isArray(row.body_blocks) ? row.body_blocks : [],
    authorName: row.author_name ?? "",
    authorBio: row.author_bio ?? "",
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
  if (!supabase) {
    console.warn("[blog] Supabase not configured, returning no posts.");
    return [];
  }

  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[blog] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAdminBlogPostBySlug(slug: string): Promise<AdminBlogPost | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[blog] Supabase not configured, returning no post.");
    return undefined;
  }

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[blog] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
