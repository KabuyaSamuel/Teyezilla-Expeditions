import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/enquiry-shared";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "How cancellations and refunds work for Teyezilla Expeditions bookings.",
};

export default function CancellationPolicyPage() {
  return (
    <div className="section max-w-3xl">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Support</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-foreground">Cancellation Policy</h1>
      <p className="mt-4 text-foreground/70">
        Cancellation and refund terms vary by tour and journey; they depend on factors like
        supplier deposits, park permits, and accommodation booking terms, so we set them per
        package rather than a single blanket policy.
      </p>
      <p className="mt-4 text-foreground/70">
        You&apos;ll find the specific cancellation terms for a package on its detail page, and your
        travel consultant will confirm them again before you book. If you&apos;re not sure about a
        package you&apos;re considering, just ask before you enquire.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/contact" className="btn-primary">Contact Us</Link>
        <a
          href={whatsappLink("Hi! I have a question about cancellation terms for a Teyezilla trip.")}
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
