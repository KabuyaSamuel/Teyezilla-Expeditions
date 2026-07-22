import PageHeader from "@/components/admin/PageHeader";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <PageHeader title="New Post" description="Write a new travel guide article." />
      <BlogPostForm />
    </div>
  );
}
