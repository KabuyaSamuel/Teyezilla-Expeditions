import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { getAdminBlogPostBySlug } from "@/lib/admin/data/blog";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getAdminBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${post.title}`} description="Update content, categorization, and SEO fields." />
      <form className="space-y-6">
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="text-xs font-medium text-foreground/60">Title</label>
            <input id="title" name="title" defaultValue={post.title} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="category" className="text-xs font-medium text-foreground/60">Category</label>
            <input id="category" name="category" defaultValue={post.category} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tags" className="text-xs font-medium text-foreground/60">Tags (comma-separated)</label>
            <input id="tags" name="tags" defaultValue={post.tags.join(", ")} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">SEO</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label htmlFor="metaTitle" className="text-xs font-medium text-foreground/60">Meta Title</label>
              <input id="metaTitle" name="metaTitle" defaultValue={post.metaTitle} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="metaDescription" className="text-xs font-medium text-foreground/60">Meta Description</label>
              <textarea id="metaDescription" name="metaDescription" defaultValue={post.metaDescription} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Publishing</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <select id="status" name="status" defaultValue={post.status} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
            <input id="scheduledFor" name="scheduledFor" type="date" defaultValue={post.scheduledFor} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </section>

        <button type="submit" className="btn-primary">Save Post</button>
      </form>
    </div>
  );
}
