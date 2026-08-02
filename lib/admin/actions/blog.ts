"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import type { ContentBlock } from "@/lib/blogBlocks";

export interface BlogPostInput {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  destinationId: string;
  excerpt: string;
  answer: string;
  bodyBlocks: ContentBlock[];
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  status: "draft" | "published" | "scheduled";
  scheduledFor: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: BlogPostInput) {
  const publishedAt =
    input.status === "published"
      ? new Date().toISOString()
      : input.status === "scheduled"
        ? input.scheduledFor || null
        : null;

  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    category: input.category,
    tags: input.tags,
    destination_id: input.destinationId || null,
    excerpt: input.excerpt,
    answer: input.answer,
    body_blocks: input.bodyBlocks,
    author_name: input.authorName,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
    status: input.status,
    published_at: publishedAt,
  };
}

export async function createBlogPost(input: BlogPostInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("blog_posts").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePublicSite();
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, input: BlogPostInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("blog_posts").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePublicSite();
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePublicSite();
  redirect("/admin/blog");
}
