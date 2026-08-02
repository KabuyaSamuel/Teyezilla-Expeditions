import type { Metadata } from "next";
import Link from "next/link";
import { getCollections } from "@/lib/collections";

export const metadata: Metadata = {
  title: "The Teyezilla Collections",
  description: "Curated collections, each a distinct way to experience Africa with Teyezilla Expeditions.",
  alternates: { canonical: "/collections" },
};

export const revalidate = 3600;

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="section">
      <h1 className="h1-page">The Teyezilla Collections</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        {collections.length} curated way{collections.length !== 1 ? "s" : ""} to experience the magic of Africa,
        each one hand-curated by our team.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.slug}`} className="card p-6">
            <h2 className="font-heading text-xl font-semibold text-foreground">{collection.name}</h2>
            <p className="mt-2 text-sm text-foreground/70">{collection.description}</p>
          </Link>
        ))}
        {collections.length === 0 && <p className="text-sm text-foreground/50">No collections yet.</p>}
      </div>
    </div>
  );
}
