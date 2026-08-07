import PageHeader from "@/components/admin/PageHeader";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { getDestinations } from "@/lib/destinations";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function NewBlogPostPage() {
  const [destinations, mediaItems] = await Promise.all([getDestinations(), getMediaItems()]);

  return (
    <div>
      <PageHeader title="New Post" description="Write a new travel guide article." />
      <BlogPostForm destinations={destinations} mediaItems={mediaItems} />
    </div>
  );
}
