import Image from "next/image";
import Link from "next/link";
import { Star, Users, Check } from "lucide-react";
import type { Review } from "@/types";
import ScrollReveal from "./ScrollReveal";
import { getSiteSetting } from "@/lib/settings";
import { WHY_CHOOSE_DEFAULTS, type WhyChooseKey } from "@/lib/homepageContent";

export default async function WhyChoose({
  testimonial,
  happyTravelersCount,
}: {
  testimonial?: Review;
  happyTravelersCount: string;
}) {
  const keys = Object.keys(WHY_CHOOSE_DEFAULTS) as WhyChooseKey[];
  const values = await Promise.all(keys.map((key) => getSiteSetting(key)));
  const text = Object.fromEntries(
    keys.map((key, i) => [key, values[i] || WHY_CHOOSE_DEFAULTS[key]])
  ) as typeof WHY_CHOOSE_DEFAULTS;

  const checklist = [
    text.whyChooseChecklist1,
    text.whyChooseChecklist2,
    text.whyChooseChecklist3,
    text.whyChooseChecklist4,
  ].filter(Boolean);

  return (
    <section className="section grid gap-12 lg:grid-cols-2 lg:items-center">
      <ScrollReveal className="relative">
        <div className="relative h-[420px] w-full overflow-hidden rounded-xl2 shadow-card">
          <Image
            src={text.whyChooseImage}
            alt="Safari vehicle with travelers watching wildebeest cross the road in the Maasai Mara, Kenya"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {testimonial && (
          <div className="absolute -bottom-8 -right-4 w-64 rounded-xl2 bg-primary p-5 text-white shadow-cardHover sm:-right-8">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <div>
                <p className="font-heading text-lg font-bold leading-none">
                  {happyTravelersCount}+
                </p>
                <p className="text-xs text-white/70">Happy Travelers</p>
              </div>
            </div>
            <p className="mt-3 text-sm italic text-white/90">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
              <span className="ml-1 text-xs text-white/60">{testimonial.authorName}</span>
            </div>
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <h2 className="h2-section">
          {text.whyChooseHeadlineLine1}
          <span className="block font-normal italic text-primary">{text.whyChooseHeadlineLine2}</span>
        </h2>
        <p className="mt-4 text-foreground/70">{text.whyChooseDescription}</p>

        <ul className="mt-6 space-y-3">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <Link href={text.whyChooseCtaHref} className="btn-primary mt-8 inline-flex">
          {text.whyChooseCtaLabel} →
        </Link>
      </ScrollReveal>
    </section>
  );
}
