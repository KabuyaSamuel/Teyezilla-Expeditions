import type { Tour, BlogPost } from "@/types";
import type { Journey } from "@/lib/journeys";
import TourCard from "./TourCard";
import JourneyCard from "./JourneyCard";
import BlogCard from "./BlogCard";
import ScrollReveal from "./ScrollReveal";

export default function RelatedContent({
  title = "You Might Also Like",
  tours = [],
  journeys = [],
  articles = [],
}: {
  title?: string;
  tours?: Tour[];
  journeys?: Journey[];
  articles?: BlogPost[];
}) {
  if (tours.length === 0 && journeys.length === 0 && articles.length === 0) return null;

  return (
    <section className="section border-t border-secondary/20">
      <ScrollReveal>
        <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
      </ScrollReveal>

      {journeys.length > 0 && (
        <div className="mt-8">
          {(tours.length > 0 || articles.length > 0) && (
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Related Journeys
            </h3>
          )}
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
        </div>
      )}

      {tours.length > 0 && (
        <div className="mt-8">
          {(journeys.length > 0 || articles.length > 0) && (
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Related Tours & Experiences
            </h3>
          )}
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="mt-8">
          {(tours.length > 0 || journeys.length > 0) && (
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/50">
              From The Journal
            </h3>
          )}
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
