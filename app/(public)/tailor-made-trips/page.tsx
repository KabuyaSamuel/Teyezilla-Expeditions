import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";

export const metadata: Metadata = {
  title: "Bespoke Journeys",
  description:
    "Your journey, your way: a dedicated point of contact designs a custom African itinerary around your budget, travel style, and luxury level.",
};

const SERVICES = [
  "One dedicated point of contact from first enquiry to the end of your trip",
  "Fully custom itinerary design around your interests, pace, and budget",
  "Private guides, vehicles, and logistics arranged on request",
  "Flexible date and booking changes handled directly, without back-and-forth",
];

export default function BespokePage() {
  return (
    <div className="section max-w-3xl">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Bespoke</span>
      <h1 className="mt-3 h1-page">Your Journey, Your Way</h1>
      <p className="mt-6 intro-text text-foreground/70">
        Every Teyezilla journey can be shaped around your budget, travel style, and luxury
        level. You work directly with our team to design a trip around exactly what you want
        to see, do, and experience, not the other way around.
      </p>

      <div className="mt-10 space-y-3">
        {SERVICES.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-secondary/10 p-4 text-sm text-foreground/80">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {item}
          </div>
        ))}
      </div>

      <div className="mt-10 card p-8">
        <h2 className="font-heading text-xl font-semibold text-foreground">How It Works</h2>
        <p className="mt-3 text-sm text-foreground/70">
          Use our AI Trip Planner to get a suggested itinerary in minutes, or tell us about the
          trip you have in mind directly: destinations, dates, group size, and the kind of
          experience you&apos;re after, and our team will put together a tailored proposal.
          There&apos;s no separate booking system for this; it runs through the same team that
          handles every Teyezilla journey, just with a more hands-on, one-to-one planning
          process. You can also reach us any time on{" "}
          <Link href="/contact" className="font-medium text-primary underline">
            our contact page
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/trip-planner" className="btn-primary">
            Design My Journey
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
