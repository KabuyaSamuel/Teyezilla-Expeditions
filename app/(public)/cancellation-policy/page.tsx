import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/enquiry-shared";
import { getSiteSetting } from "@/lib/settings";
import { DEFAULT_CANCELLATION_POLICY_CONTENT } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "How cancellations and refunds work for Teyezilla Expeditions bookings.",
};

export default async function CancellationPolicyPage() {
  const content = (await getSiteSetting("cancellationPolicyContent")) || DEFAULT_CANCELLATION_POLICY_CONTENT;

  return (
    <div className="section max-w-prose">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Support</span>
      <h1 className="mt-3 h1-page">Cancellation Policy</h1>
      <p className="mt-4 whitespace-pre-line text-foreground/70">{content}</p>

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
