import type { Metadata } from "next";
import { getTours } from "@/lib/tours";
import TourCard from "@/components/TourCard";

export const metadata: Metadata = {
  title: "African Safari Tours",
  description: "Browse safari tours across Kenya and Tanzania with Teyezilla Expeditions.",
};

export const revalidate = 3600;

export default async function SafarisPage() {
  const tours = await getTours();
  const safariTours = tours.filter((t) => t.categoryLabel === "Safari");
  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-foreground">Safaris</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Big-five game drives across Kenya and Tanzania's most iconic reserves.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {safariTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
