import type { Metadata } from "next";
import { getTours } from "@/lib/tours";
import { getSafariThemes, getSafariGuideFaqs } from "@/lib/safari";
import TourCard from "@/components/TourCard";

export const metadata: Metadata = {
  title: "Safari",
  description: "The art of the African safari, perfectly crafted — Wildlife & safari tours with Teyezilla Expeditions.",
};

export const revalidate = 3600;

export default async function SafariPage() {
  const [tours, themes, faqs] = await Promise.all([getTours(), getSafariThemes(), getSafariGuideFaqs()]);
  const safariTours = tours.filter((t) => t.categoryLabel === "Safari");

  return (
    <div>
      <div className="section max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Safari</span>
        <h1 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">
          The Art of the African Safari
        </h1>
        <p className="mt-6 text-lg text-foreground/70">
          Go deeper into the wild with Teyezilla — from the Great Migration to gorilla trekking,
          every safari is planned by guides who know these landscapes firsthand.
        </p>
      </div>

      <div className="bg-secondary/10">
        <div className="section">
          <h2 className="font-heading text-2xl font-bold text-foreground">Signature Safari</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {themes.map((theme) => (
              <div key={theme.id} className="card p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">{theme.name}</h3>
                <p className="mt-2 text-sm text-foreground/70">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="font-heading text-2xl font-bold text-foreground">Safari Tours</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safariTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
          {safariTours.length === 0 && <p className="text-sm text-foreground/50">No safari tours published yet.</p>}
        </div>
      </div>

      <div className="bg-secondary/10">
        <div className="section max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-foreground">Safari Guide</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="card p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm text-foreground/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
