import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTours } from "@/lib/tours";
import { getSafariThemes, getSafariGuideFaqs, getTourIdsBySafariThemeSlug } from "@/lib/safari";
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { SAFARI_PAGE_DEFAULTS, type SafariPageKey } from "@/lib/homepageContent";
import TourCard from "@/components/TourCard";
import JsonLd from "@/components/JsonLd";
import { faqPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Safari",
  description: "The art of the African safari, perfectly crafted: Wildlife & safari tours with Teyezilla Expeditions.",
  alternates: { canonical: "/safari" },
};

export const revalidate = 3600;

const TEXT_KEYS = Object.keys(SAFARI_PAGE_DEFAULTS) as SafariPageKey[];

export default async function SafariPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const { theme } = await searchParams;
  const [tours, themes, faqs, themeTourIds, ...textValues] = await Promise.all([
    getPublishedTours(),
    getSafariThemes(),
    getSafariGuideFaqs(),
    theme ? getTourIdsBySafariThemeSlug(theme) : Promise.resolve<string[] | null>(null),
    ...TEXT_KEYS.map((key) => getSiteSetting(key)),
  ]);
  const text = resolveSiteText(SAFARI_PAGE_DEFAULTS, TEXT_KEYS, textValues);
  const selectedTheme = theme ? themes.find((t) => t.slug === theme) : undefined;
  const safariTours = tours
    .filter((t) => t.productType === "safari")
    .filter((t) => !themeTourIds || themeTourIds.includes(t.id));
  const faqJsonLd = faqs.length > 0 ? faqPageJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer }))) : null;

  return (
    <div>
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <div className="section max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{text.safariEyebrow}</span>
        <h1 className="mt-3 h1-page">
          {text.safariHeadline}
        </h1>
        <p className="mt-6 intro-text whitespace-pre-line text-foreground/70">{text.safariIntro}</p>
      </div>

      <div id="signature-safari" className="bg-secondary/10">
        <div className="section">
          <h2 className="font-heading text-2xl font-bold text-foreground">Signature Safari</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {themes.map((t) => (
              <Link
                key={t.id}
                href={t.slug === theme ? "/safari#signature-safari" : `/safari?theme=${t.slug}#signature-safari`}
                className={`card p-5 transition-colors ${t.slug === theme ? "border-2 border-primary" : ""}`}
              >
                <h3 className="font-heading text-base font-semibold text-foreground">{t.name}</h3>
                <p className="mt-2 text-sm text-foreground/70">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {selectedTheme ? `${selectedTheme.name} Safari Tours` : "Safari Tours"}
          </h2>
          {selectedTheme && (
            <Link href="/safari#signature-safari" className="text-sm font-medium text-primary hover:underline">
              Clear filter ×
            </Link>
          )}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safariTours.map((tour, i) => (
            <TourCard key={tour.id} tour={tour} priority={i === 0} />
          ))}
          {safariTours.length === 0 && (
            <p className="text-sm text-foreground/50">
              {selectedTheme ? `No tours tagged under "${selectedTheme.name}" yet.` : "No safari tours published yet."}
            </p>
          )}
        </div>
      </div>

      <div id="safari-guide" className="bg-secondary/10">
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
