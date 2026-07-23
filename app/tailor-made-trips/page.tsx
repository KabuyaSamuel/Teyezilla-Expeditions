import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bespoke Journeys",
  description: "Your journey, your way — design a custom African itinerary with Teyezilla Expeditions' AI trip planner or our travel team.",
};

export default function BespokePage() {
  return (
    <div className="section max-w-3xl">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Bespoke</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-foreground">Your Journey, Your Way</h1>
      <p className="mt-4 text-foreground/70">
        Every Teyezilla journey can be shaped around your budget, travel style, and luxury
        level. Use our AI Trip Planner to get a suggested itinerary in minutes, or send
        us your ideas directly on WhatsApp.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/trip-planner" className="btn-primary">Design My Journey</Link>
        <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="btn-outline">
          WhatsApp Us
        </a>
      </div>
    </div>
  );
}
