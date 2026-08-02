import Image from "next/image";
import Link from "next/link";
import { Star, Users, Check } from "lucide-react";
import type { Review } from "@/types";
import ScrollReveal from "./ScrollReveal";

const CHECKLIST = [
  "Local travel experts who live where they guide",
  "Personalized, flexible itineraries",
  "Transparent pricing, no hidden fees",
  "24/7 customer support",
];

export default function WhyChoose({
  testimonial,
  happyTravelersCount,
}: {
  testimonial?: Review;
  happyTravelersCount: string;
}) {
  return (
    <section className="section grid gap-12 lg:grid-cols-2 lg:items-center">
      <ScrollReveal className="relative">
        <div className="relative h-[420px] w-full overflow-hidden rounded-xl2 shadow-card">
          {/* TEMP placeholder until real Teyezilla photography is available.
              "Kenya safari.jpg" by Flickr user DEMOSH (Nairobi, Kenya),
              CC BY 2.0: https://creativecommons.org/licenses/by/2.0 --
              https://commons.wikimedia.org/wiki/File:Kenya_safari.jpg */}
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Kenya_safari.jpg"
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
          More Than Just a Trip,
          <span className="block font-normal italic text-primary">It&apos;s a Connection.</span>
        </h2>
        <p className="mt-4 text-foreground/70">
          We don&apos;t just show you places; we connect you to the people, the culture, and the
          wild beauty of Africa.
        </p>

        <ul className="mt-6 space-y-3">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <Link href="/about" className="btn-primary mt-8 inline-flex">
          About Teyezilla →
        </Link>
      </ScrollReveal>
    </section>
  );
}
