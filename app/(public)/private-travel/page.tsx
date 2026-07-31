import type { Metadata } from "next";
import { getPublishedTours } from "@/lib/tours";
import TourCard from "@/components/TourCard";

export const metadata: Metadata = {
  title: "Private Travel",
  description: "Africa, exclusively yours: private journeys designed around your time, interests and travel style with Teyezilla Expeditions.",
};

export const revalidate = 3600;

export default async function PrivateTravelPage() {
  const tours = await getPublishedTours();
  const privateTours = tours.filter((t) => t.productType === "private_travel");

  return (
    <div className="section">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Private Travel</span>
      <h1 className="mt-3 h1-page">
        Africa, Exclusively Yours
      </h1>
      <p className="mt-6 max-w-2xl intro-text text-foreground/70">
        Private journeys designed around your time, interests, and travel style: just your group,
        a dedicated guide, and Africa on your terms.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {privateTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
        {privateTours.length === 0 && (
          <p className="text-sm text-foreground/50">
            No private travel packages published yet. Reach out and our team will design one for you.
          </p>
        )}
      </div>
    </div>
  );
}
