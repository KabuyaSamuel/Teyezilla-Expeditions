import type { Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "r1",
    authorName: "Amara O.",
    source: "TripAdvisor",
    rating: 5,
    quote:
      "Our Maasai Mara safari was flawlessly organized from the airport pickup to the last game drive.",
    tourTitle: "Maasai Mara Safari",
  },
  {
    id: "r2",
    authorName: "Daniel K.",
    source: "Google",
    rating: 5,
    quote:
      "The Zanzibar beach escape struck the perfect balance between Stone Town culture and beach downtime.",
    tourTitle: "Zanzibar Beach Escape",
  },
  {
    id: "r3",
    authorName: "Priya S.",
    source: "GetYourGuide",
    rating: 5,
    quote:
      "Our guide's knowledge of the pyramids and Egyptian history made the whole day come alive.",
    tourTitle: "Pyramids of Giza Tour",
  },
];
