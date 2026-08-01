import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBlogPosts, getPublishedBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog";
import { getRelatedTours } from "@/lib/tours";
import { getJourneysByDestination } from "@/lib/journeys";
import RelatedContent from "@/components/RelatedContent";
import BlogContentBlocks from "@/components/BlogContentBlocks";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();
  const publishedLabel = formatDate(post.publishedAt);

  const [relatedTours, relatedJourneys, relatedArticles] = post.destinationId
    ? await Promise.all([
        getRelatedTours(post.destinationId, undefined, 3),
        getJourneysByDestination(post.destinationId, undefined, 3),
        getRelatedBlogPosts(post.destinationId, post.slug, 3),
      ])
    : [[], [], []];

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    author: { "@type": "Person", name: post.authorName },
    description: post.metaDescription,
  };

  return (
    <div>
      <article className="section max-w-prose">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
        <h1 className="h1-page">{post.title}</h1>
        <p className="mt-2 text-sm text-foreground/60">
          {publishedLabel}
          {publishedLabel && post.authorName && " · "}
          {post.authorName && `By ${post.authorName}`}
        </p>

        {/* Answer-first block for AEO/GEO */}
        <p className="mt-6 rounded-2xl bg-secondary/15 p-5 text-lg font-medium text-foreground">
          {post.answer}
        </p>

        {post.bodyBlocks.length > 0 ? (
          <BlogContentBlocks blocks={post.bodyBlocks} />
        ) : (
          post.body && <p className="mt-6 text-foreground/80">{post.body}</p>
        )}

        <div className="mt-10 rounded-2xl bg-primary/5 p-6 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">Ready to plan your own journey?</p>
          <p className="mt-1 text-sm text-foreground/70">
            Let our travel team craft a personal itinerary around what you just read.
          </p>
          <Link href="/trip-planner" className="btn-primary mt-4 inline-block">
            Plan My Journey
          </Link>
        </div>
      </article>

      <RelatedContent
        title="Bring This Story to Life"
        tours={relatedTours}
        journeys={relatedJourneys}
        articles={relatedArticles}
      />
    </div>
  );
}
