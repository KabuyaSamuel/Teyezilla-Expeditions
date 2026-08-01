import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Teyezilla Concierge",
  description:
    "A dedicated point of contact for personalized itinerary design, private logistics, and support throughout your African journey.",
};

const SERVICES = [
  "One dedicated point of contact from first enquiry to the end of your trip",
  "Fully custom itinerary design around your interests, pace, and budget",
  "Private guides, vehicles, and logistics arranged on request",
  "Flexible date and booking changes handled directly, without back-and-forth",
];

export default function ConciergePage() {
  return (
    <div className="section max-w-3xl">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
        Teyezilla Concierge
      </span>
      <h1 className="mt-3 h1-page">
        A More Personal Way to Travel
      </h1>
      <p className="mt-6 intro-text text-foreground/70">
        For travelers who want their journey planned around them (not the other way around),
        Teyezilla Concierge is our dedicated, personalized planning service. You work directly
        with our team to design a trip around exactly what you want to see, do, and experience.
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
          Tell us about the trip you have in mind: destinations, dates, group size, and the kind
          of experience you&apos;re after, and our team will put together a tailored proposal.
          There&apos;s no separate booking system for Concierge; it runs through the same team
          that handles every Teyezilla journey, just with a more hands-on, one-to-one planning
          process.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tailor-made-trips" className="btn-primary">
            Start Planning Your Journey
          </Link>
          <Link href="/contact" className="btn-outline">
            Talk to Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
