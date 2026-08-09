import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionBySlug, getCollections } from "@/lib/collections";
import TourCard from "@/components/TourCard";
import JsonLd from "@/components/JsonLd";
import { breadcrumbListJsonLd, collectionPageJsonLd } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: collection.name, path: `/collections/${collection.slug}` },
  ]);

  const collectionPageJsonLdData = collectionPageJsonLd({
    name: collection.name,
    description: collection.description,
    path: `/collections/${collection.slug}`,
    items: collection.tours.map((t) => ({ name: t.title, path: `/tours/${t.slug}` })),
  });

  return (
    <div className="section">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionPageJsonLdData} />
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
        The Teyezilla Collections
      </span>
      <h1 className="mt-3 h1-page">{collection.name}</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">{collection.description}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collection.tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
        {collection.tours.length === 0 && (
          <p className="text-sm text-foreground/50">More journeys and tours coming soon to this collection.</p>
        )}
      </div>
    </div>
  );
}
