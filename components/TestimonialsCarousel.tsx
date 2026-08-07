"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/types";
import ReviewCard from "./ReviewCard";

const PER_PAGE = 3;

// Shows PER_PAGE testimonials at once. Circular: Next from the last page
// wraps to the first, Prev from the first page wraps to the last, via
// modulo arithmetic on the page index.
export default function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  const pageCount = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  const [page, setPage] = useState(0);

  if (reviews.length === 0) return null;

  function goPrev() {
    setPage((p) => (p - 1 + pageCount) % pageCount);
  }
  function goNext() {
    setPage((p) => (p + 1) % pageCount);
  }

  const visible = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

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
