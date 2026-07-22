import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import BlogPostForm from "@/components/admin/BlogPostForm";
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
      <BlogPostForm existingPost={post} />
    </div>
  );
}
