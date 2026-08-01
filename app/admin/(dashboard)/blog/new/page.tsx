import PageHeader from "@/components/admin/PageHeader";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { getDestinations } from "@/lib/destinations";

export default async function NewBlogPostPage() {
  const destinations = await getDestinations();

  return (
    <div>
      <PageHeader title="New Post" description="Write a new travel guide article." />
      <BlogPostForm destinations={destinations} />
    </div>
  );
}
