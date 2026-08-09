import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperienceTypes, getExperienceTypeBySlug, getToursByExperienceType } from "@/lib/experienceTypes";
import TourCard from "@/components/TourCard";

interface Props {
  params: Promise<{ category: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const types = await getExperienceTypes();
  return types.map((t) => ({ category: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const type = await getExperienceTypeBySlug(category);
  if (!type) return {};

  return {
    // Kept short and distinct from the on-page `description` field, which
    // is a long-form paragraph meant for body content -- dumping that into
    // a <meta name="description"> would blow past Google's ~155-160
    // character display limit and just get truncated.
    title: `${type.name} in Africa`,
    description: `${type.name} tours and experiences across Africa with Teyezilla Expeditions.`,
  };
}

export default async function ExperienceCategoryPage({ params }: Props) {
  const { category } = await params;
  const type = await getExperienceTypeBySlug(category);
  if (!type) notFound();

  const tours = await getToursByExperienceType(category);

  return (
    <div className="section">
      <h1 className="h1-page">{type.name}</h1>
      {type.description && <p className="mt-3 max-w-2xl text-foreground/70">{type.description}</p>}
      <p className="mt-3 max-w-2xl text-sm text-foreground/50">
        {tours.length} experience{tours.length !== 1 ? "s" : ""} in this category.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
        {tours.length === 0 && <p className="text-sm text-foreground/50">No tours published in this category yet.</p>}
      </div>
    </div>
  );
}
