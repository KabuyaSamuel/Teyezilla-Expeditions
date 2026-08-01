import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const publishedLabel = formatDate(post.publishedAt);

  return (
    <Link href={`/blog/${post.slug}`} className="card group overflow-hidden block">
      {post.heroImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
          />
        </div>
      )}
      <div className="p-5">
        {(publishedLabel || post.authorName) && (
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            {publishedLabel}
            {publishedLabel && post.authorName && " · "}
            {post.authorName && `By ${post.authorName}`}
          </p>
        )}
        <h3 className="mt-1 font-heading text-lg font-semibold text-foreground group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-foreground/70">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Read Article
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
