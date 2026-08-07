"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/types";
import ReviewCard from "./ReviewCard";

// Circular: Prev from the first testimonial wraps to the last, Next from
// the last wraps back to the first, via modulo arithmetic on the index.
export default function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);

  if (reviews.length === 0) return null;

  function goPrev() {
    setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  }
  function goNext() {
    setIndex((i) => (i + 1) % reviews.length);
  }

  return (
    <div className="mt-10">
      <div className="mx-auto flex max-w-2xl items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-foreground transition-colors hover:bg-secondary/25"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <ReviewCard review={reviews[index]} />
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next testimonial"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-foreground transition-colors hover:bg-secondary/25"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {reviews.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1} of ${reviews.length}`}
              aria-current={i === index}
              className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-secondary/30 hover:bg-secondary/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
