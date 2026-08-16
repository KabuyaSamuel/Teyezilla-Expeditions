"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/types";
import ReviewCard from "./ReviewCard";
import { useMediaQuery } from "@/lib/useMediaQuery";

const PER_PAGE_DESKTOP = 3;
const PER_PAGE_MOBILE = 1;
const MOBILE_QUERY = "(max-width: 639px)";

// Shows perPage testimonials at once -- 3 on desktop, 1 on mobile so cards
// don't spill over a narrow screen. Circular: Next from the last page wraps
// to the first, Prev from the first page wraps to the last, via modulo
// arithmetic on the page index.
export default function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  // useMediaQuery (useSyncExternalStore under the hood) rather than a
  // useState lazy initializer reading window.matchMedia directly -- that
  // ran during SSR too (window undefined there, always falling back to
  // desktop) and diverged from a real mobile client's first hydration
  // pass, which would slice `visible` to a different length than the
  // server rendered. Confirmed directly: a genuine React hydration error
  // (extra ReviewCard nodes) on any page load on a mobile viewport.
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const perPage = isMobile ? PER_PAGE_MOBILE : PER_PAGE_DESKTOP;
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(reviews.length / perPage));

  // perPage changing (crossing the breakpoint) can push the current page
  // out of range -- clamp it back onto the last valid page instead of
  // rendering an empty slice. Only ever fires in response to pageCount
  // actually changing after mount (matchMedia's live breakpoint crossing),
  // not on the initial render, so there's no cascading-render risk despite
  // react-hooks/set-state-in-effect's generic warning here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  if (reviews.length === 0) return null;

  function goPrev() {
    setPage((p) => (p - 1 + pageCount) % pageCount);
  }
  function goNext() {
    setPage((p) => (p + 1) % pageCount);
  }

  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous testimonials"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-foreground transition-colors hover:bg-secondary/25"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="grid min-w-0 flex-1 gap-6 sm:grid-cols-3">
          {visible.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next testimonials"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-foreground transition-colors hover:bg-secondary/25"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {pageCount > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to testimonials page ${i + 1} of ${pageCount}`}
              aria-current={i === page}
              className={`h-2 w-2 rounded-full transition-colors ${i === page ? "bg-primary" : "bg-secondary/30 hover:bg-secondary/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
