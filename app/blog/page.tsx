import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "The Teyezilla Journal",
  description: "Safari guides, destination comparisons, and travel tips from Teyezilla Expeditions.",
};

export const revalidate = 3600;

const JOURNAL_CATEGORIES = [
  "Africa Travel",
  "Safari Stories",
  "Destination Guides",
  "Wildlife & Conservation",
  "Culture & Heritage",
  "Food & Lifestyle",
  "Travel Tips",
  "Travel Inspiration",
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const posts = await getPublishedBlogPosts();
  const filteredPosts = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <div className="section">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">The Teyezilla Journal</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-foreground">Stories from the Field</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !category ? "bg-primary text-white" : "bg-secondary/15 text-foreground hover:bg-secondary/25"
          }`}
        >
          All
        </Link>
        {JOURNAL_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/blog?category=${encodeURIComponent(c)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c ? "bg-primary text-white" : "bg-secondary/15 text-foreground hover:bg-secondary/25"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-sm text-foreground/50">No stories published in this category yet.</p>
        )}
      </div>
    </div>
  );
}
