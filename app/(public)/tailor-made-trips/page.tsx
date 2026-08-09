import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { BESPOKE_PAGE_DEFAULTS, type BespokePageKey } from "@/lib/homepageContent";

export const metadata: Metadata = {
  title: "Bespoke Journeys",
  description:
    "Your journey, your way: a dedicated point of contact designs a custom African itinerary around your budget, travel style, and luxury level.",
};

export default async function BespokePage() {
  const keys = Object.keys(BESPOKE_PAGE_DEFAULTS) as BespokePageKey[];
  const values = await Promise.all(keys.map((key) => getSiteSetting(key)));
  const text = resolveSiteText(BESPOKE_PAGE_DEFAULTS, keys, values);

  const services = [text.bespokeService1, text.bespokeService2, text.bespokeService3, text.bespokeService4].filter(
    Boolean
  );

  return (
    <div className="section max-w-3xl">
      {text.bespokeEyebrow && (
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{text.bespokeEyebrow}</span>
      )}
      <h1 className="mt-3 h1-page">{text.bespokeHeadline}</h1>
      <p className="mt-6 intro-text text-foreground/70">{text.bespokeIntro}</p>

      {services.length > 0 && (
        <div className="mt-10 space-y-3">
          {services.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-secondary/10 p-4 text-sm text-foreground/80">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {item}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 card p-8">
        {text.bespokeHowItWorksHeading && (
          <h2 className="font-heading text-xl font-semibold text-foreground">{text.bespokeHowItWorksHeading}</h2>
        )}
        <p className="mt-3 text-sm text-foreground/70">
          {text.bespokeHowItWorksBody}
          {text.bespokeHowItWorksBody && " "}
          You can also reach us any time on{" "}
          <Link href="/contact" className="font-medium text-primary underline">
            our contact page
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {text.bespokeCtaLabel && (
            <Link href="/trip-planner" className="btn-primary">
              {text.bespokeCtaLabel}
            </Link>
          )}
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
