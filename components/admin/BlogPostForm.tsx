"use client";

import { useState } from "react";
import type { Destination } from "@/types";
import type { AdminBlogPost } from "@/lib/admin/data/blog";
import type { ContentBlock } from "@/lib/blogBlocks";
import type { MediaItem } from "@/lib/admin/data/media";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/admin/actions/blog";
import BlogContentEditor from "./BlogContentEditor";
import MediaPickerField from "./MediaPickerField";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function BlogPostForm({
  existingPost,
  destinations,
  mediaItems,
}: {
  existingPost?: AdminBlogPost;
  destinations: Destination[];
  mediaItems: MediaItem[];
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>(existingPost?.bodyBlocks ?? []);
  const [featuredImage, setFeaturedImage] = useState(existingPost?.featuredImage ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const splitCommas = (v: FormDataEntryValue | null) =>
      String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    const input = {
      title: String(formData.get("title") ?? ""),
      slug: existingPost?.slug ?? "",
      category: String(formData.get("category") ?? ""),
      tags: splitCommas(formData.get("tags")),
      destinationId: String(formData.get("destinationId") ?? ""),
      featuredImage,
      excerpt: String(formData.get("excerpt") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      bodyBlocks: blocks,
      authorName: String(formData.get("authorName") ?? "Teyezilla Travel Team"),
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      status: String(formData.get("status") ?? "draft") as "draft" | "published" | "scheduled",
      scheduledFor: String(formData.get("scheduledFor") ?? ""),
    };

    try {
      if (existingPost) {
        await updateBlogPost(existingPost.id, input);
      } else {
        await createBlogPost(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save post.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingPost) return;
    if (!confirm(`Delete "${existingPost.title}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteBlogPost(existingPost.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete post.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
      <p className="text-xs text-foreground/50">Fields marked with <span className="text-error">*</span> are required.</p>

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-xs font-medium text-foreground/60">Title <span className="text-error">*</span></label>
          <input id="title" name="title" required defaultValue={existingPost?.title} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="category" className="text-xs font-medium text-foreground/60">Category</label>
          <input id="category" name="category" defaultValue={existingPost?.category} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="destinationId" className="text-xs font-medium text-foreground/60">Destination (optional)</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">
            Powers &ldquo;related tours/journeys/articles&rdquo; on this post and on that country&rsquo;s pages. Leave blank for general articles.
          </p>
          <select
            id="destinationId"
            name="destinationId"
            defaultValue={existingPost?.destinationId ?? ""}
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">None, general article</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.countryName}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <MediaPickerField id="featuredImage" name="featuredImage" label="Featured Image" value={featuredImage} onChange={setFeaturedImage} mediaItems={mediaItems} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="tags" className="text-xs font-medium text-foreground/60">Tags (comma-separated)</label>
          <input id="tags" name="tags" defaultValue={existingPost?.tags.join(", ")} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="authorName" className="text-xs font-medium text-foreground/60">Author</label>
          <input id="authorName" name="authorName" defaultValue={existingPost?.authorName || "Teyezilla Travel Team"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Article Content</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="excerpt" className="text-xs font-medium text-foreground/60">Excerpt (shown on the /blog listing card)</label>
            <textarea id="excerpt" name="excerpt" rows={2} defaultValue={existingPost?.excerpt} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="answer" className="text-xs font-medium text-foreground/60">Answer-first block (AEO/GEO highlight box)</label>
            <textarea id="answer" name="answer" rows={2} defaultValue={existingPost?.answer} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <BlogContentEditor blocks={blocks} onChange={setBlocks} />

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">SEO</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="metaTitle" className="text-xs font-medium text-foreground/60">Meta Title</label>
            <input id="metaTitle" name="metaTitle" defaultValue={existingPost?.metaTitle} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="metaDescription" className="text-xs font-medium text-foreground/60">Meta Description</label>
            <textarea id="metaDescription" name="metaDescription" defaultValue={existingPost?.metaDescription} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Publishing</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <select id="status" name="status" defaultValue={existingPost?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
          <input id="scheduledFor" name="scheduledFor" type="date" defaultValue={existingPost?.scheduledFor} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        {existingPost && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Post"}
        </button>
      </div>
    </form>
  );
}
