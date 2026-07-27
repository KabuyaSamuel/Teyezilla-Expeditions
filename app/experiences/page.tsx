import type { Metadata } from "next";
import { getPublishedTours } from "@/lib/tours";
import TourCard from "@/components/TourCard";

export const metadata: Metadata = {
  title: "African Travel Experiences",
  description: "Food tours, city tours, and cultural experiences across Africa with Teyezilla Expeditions.",
};

export const revalidate = 3600;

export default async function ExperiencesPage() {
  const tours = await getPublishedTours();
  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-foreground">Experiences</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        From street food in Nairobi to desert camps in the Sahara.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
