import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Africa Travel Guides & Blog",
  description: "Safari guides, destination comparisons, and travel tips from Teyezilla Expeditions.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-foreground">Travel Guides</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">{post.title}</h2>
            <p className="mt-2 text-sm text-foreground/70">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
