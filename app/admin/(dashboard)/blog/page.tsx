import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getAdminBlogPosts } from "@/lib/admin/data/blog";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminBlogPage() {
  const adminBlogPosts = await getAdminBlogPosts();
  return (
    <div>
      <PageHeader
        title="Blog Management"
        description="Posts, categories, tags, and SEO for every travel guide article."
        action={<button className="btn-primary text-sm">+ New Post</button>}
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {adminBlogPosts.map((post) => (
              <tr key={post.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{post.title}</td>
                <td className="px-5 py-3 text-foreground/70">{post.category}</td>
                <td className="px-5 py-3"><Badge tone={contentStatusTone(post.status)}>{post.status}</Badge></td>
                <td className="px-5 py-3 text-foreground/70">
                  {post.publishedAt ?? (post.scheduledFor ? `Scheduled: ${post.scheduledFor}` : "—")}
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/blog/${post.slug}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
