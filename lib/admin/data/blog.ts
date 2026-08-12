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
  ogImage: string;
  featuredImage: string;
  status: "draft" | "published" | "scheduled";
  scheduledFor?: string;
  publishedAt?: string;
}

function mapRow(row: Record<string, unknown>): AdminBlogPost {
  const publishedAt = row.published_at as string | null;
  const status = row.status as AdminBlogPost["status"];
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    category: (row.category as string) ?? "",
    tags: (row.tags as string[]) ?? [],
    destinationId: (row.destination_id as string) ?? null,
    excerpt: (row.excerpt as string) ?? "",
    answer: (row.answer as string) ?? "",
    body: (row.body as string) ?? "",
    bodyBlocks: Array.isArray(row.body_blocks) ? (row.body_blocks as ContentBlock[]) : [],
    authorName: (row.author_name as string) ?? "",
    authorBio: (row.author_bio as string) ?? "",
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    ogImage: (row.og_image as string) ?? "",
    featuredImage: (row.hero_image as string) ?? "",
    status,
    scheduledFor: publishedAt && status === "scheduled" ? publishedAt : undefined,
    publishedAt: status === "published" ? (publishedAt ?? undefined) : undefined,
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
