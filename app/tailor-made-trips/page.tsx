import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tailor-Made African Trips",
  description: "Build a custom African itinerary with Teyezilla Expeditions' AI trip planner or our travel team.",
};

export default function TailorMadeTripsPage() {
  return (
    <div className="section max-w-3xl">
      <h1 className="font-heading text-4xl font-bold text-foreground">Tailor-Made Trips</h1>
      <p className="mt-4 text-foreground/70">
        Every Teyezilla trip can be shaped around your budget, travel style, and luxury
        level. Use our AI Trip Planner to get a suggested itinerary in minutes, or send
        us your ideas directly on WhatsApp.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/trip-planner" className="btn-primary">Try the AI Trip Planner</Link>
        <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="btn-outline">
          WhatsApp Us
        </a>
      </div>
    </div>
  );
}
