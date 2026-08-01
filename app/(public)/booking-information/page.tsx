import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/enquiry-shared";

export const metadata: Metadata = {
  title: "Booking Information",
  description: "How booking and enquiries work with Teyezilla Expeditions.",
};

const STEPS = [
  {
    title: "1. Send an enquiry",
    body: "Share a few details about the trip you're interested in: dates, travelers, and budget. No payment is taken online at this stage.",
  },
  {
    title: "2. Get a personal quote",
    body: "Our travel team reviews your enquiry and replies with a tailored quote and itinerary within 24 hours.",
  },
  {
    title: "3. Confirm your journey",
    body: "Once you're happy with the plan, we'll guide you through confirming and arranging payment directly with your consultant.",
  },
  {
    title: "4. Travel with support",
    body: "Your consultant stays your point of contact before and during your trip, from logistics to on-the-ground questions.",
  },
];

export default function BookingInformationPage() {
  return (
    <div className="section max-w-3xl">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Support</span>
      <h1 className="mt-3 h1-page">Booking Information</h1>
      <p className="mt-4 text-foreground/70">
        Every Teyezilla trip starts as an enquiry, not an instant checkout. This is how the process works.
      </p>

      <div className="mt-10 space-y-6">
        {STEPS.map((step) => (
          <div key={step.title} className="card p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">{step.title}</h2>
            <p className="mt-2 text-sm text-foreground/70">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/booking" className="btn-primary">Start an Enquiry</Link>
        <a
          href={whatsappLink("Hi! I have a question about booking with Teyezilla Expeditions.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
