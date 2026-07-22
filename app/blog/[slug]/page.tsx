import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedBlogPosts, getPublishedBlogPostBySlug } from "@/lib/blog";

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

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    author: { "@type": "Person", name: post.authorName },
    description: post.metaDescription,
  };

  return (
    <article className="section max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <h1 className="font-heading text-4xl font-bold text-foreground">{post.title}</h1>
      <p className="mt-2 text-sm text-foreground/60">By {post.authorName}</p>

      {/* Answer-first block for AEO/GEO */}
      <p className="mt-6 rounded-2xl bg-secondary/15 p-5 text-lg font-medium text-foreground">
        {post.answer}
      </p>

      <p className="mt-6 text-foreground/80">{post.body}</p>
    </article>
  );
}
