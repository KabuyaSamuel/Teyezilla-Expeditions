import type { Metadata } from "next";
import Link from "next/link";
import { getSafariGuideFaqs } from "@/lib/safari";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about traveling with Teyezilla Expeditions.",
};

export const revalidate = 3600;

export default async function FaqsPage() {
  const faqs = await getSafariGuideFaqs();

  return (
    <div className="section max-w-3xl">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Support</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-foreground">Frequently Asked Questions</h1>
      <p className="mt-4 text-foreground/70">
        Can&apos;t find what you&apos;re looking for? Reach out on{" "}
        <Link href="/contact" className="text-primary hover:underline">Contact</Link> or{" "}
        <Link href="/booking" className="text-primary hover:underline">start an enquiry</Link> and our
        travel team will help directly.
      </p>

      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="card p-5">
            <h3 className="font-heading text-base font-semibold text-foreground">{faq.question}</h3>
            <p className="mt-2 text-sm text-foreground/70">{faq.answer}</p>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-sm text-foreground/50">
            No FAQs published yet. Reach out to our team with any questions.
          </p>
        )}
      </div>
    </div>
  );
}
