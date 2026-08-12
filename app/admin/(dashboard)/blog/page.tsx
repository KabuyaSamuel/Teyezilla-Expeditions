import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminBlogPosts, type AdminBlogPost } from "@/lib/admin/data/blog";
import { contentStatusTone } from "@/lib/admin/status-tone";
import { formatDateTime } from "@/lib/formatDate";

function dateLabel(post: AdminBlogPost): string {
  if (post.publishedAt) return formatDateTime(post.publishedAt);
  if (post.scheduledFor) return `Scheduled: ${formatDateTime(post.scheduledFor)}`;
  return "-";
}

export default async function AdminBlogPage() {
  const adminBlogPosts = await getAdminBlogPosts();
  return (
    <div>
      <PageHeader
        title="Blog Management"
        description="Posts, categories, tags, and SEO for every travel guide article."
        action={
          <Link href="/admin/blog/new" className="btn-primary text-sm">
            + New Post
          </Link>
        }
      />
      <ResponsiveTable
        rows={adminBlogPosts}
        keyField={(post) => post.id}
        emptyMessage="No posts yet."
        columns={[
          { header: "Title", cell: (post) => post.title, className: "font-medium text-foreground" },
          { header: "Category", cell: (post) => post.category },
          { header: "Status", cell: (post) => <Badge tone={contentStatusTone(post.status)}>{post.status}</Badge> },
          { header: "Date", cell: (post) => dateLabel(post) },
          { header: "", cell: (post) => <Link href={`/admin/blog/${post.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(post) => (
          <>
            <MobileCardHeader
              title={post.title}
              subtitle={post.category}
              action={<Link href={`/admin/blog/${post.slug}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Status" value={<Badge tone={contentStatusTone(post.status)}>{post.status}</Badge>} />
              <MobileCardField label="Date" value={dateLabel(post)} />
            </div>
          </>
        )}
      />
    </div>
  );
}
