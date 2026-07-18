import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Africa Travel Guides & Blog",
  description: "Safari guides, destination comparisons, and travel tips from Teyezilla Expeditions.",
};

const SEED_POSTS = [
  { slug: "best-safari-in-kenya", title: "Best Safari in Kenya", excerpt: "Where to go and when, for a first Kenyan safari." },
  { slug: "kenya-vs-tanzania-safari", title: "Kenya vs Tanzania Safari", excerpt: "How the two classic safari countries compare." },
  { slug: "best-time-to-visit-zanzibar", title: "Best Time to Visit Zanzibar", excerpt: "Seasons, weather, and when to book." },
  { slug: "egypt-travel-guide", title: "Egypt Travel Guide", excerpt: "Pyramids, Nile cruises, and Luxor, planned out." },
  { slug: "morocco-travel-guide", title: "Morocco Travel Guide", excerpt: "Marrakech, Chefchaouen, and the Sahara." },
  { slug: "africa-travel-tips", title: "Africa Travel Tips", excerpt: "Practical advice before your first trip." },
];

export default function BlogPage() {
  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-foreground">Travel Guides</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SEED_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">{post.title}</h2>
            <p className="mt-2 text-sm text-foreground/70">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
