"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqEntry {
  question: string;
  answer: string;
}

// Single-open accordion: opening one entry collapses whichever other entry
// was open, tracked as one index instead of a per-item boolean set.
export default function ProductFaqAccordion({ faqs }: { faqs: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="font-heading text-xl font-semibold text-foreground">FAQs</h2>
      <div className="mt-4 divide-y divide-secondary/20">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="py-3 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <h3 className="font-heading font-semibold text-foreground">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-foreground/50 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && <p className="mt-2 text-sm text-foreground/70">{faq.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
