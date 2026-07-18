export interface TripPlannerRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  destination: string;
  budgetUsd: number;
  days: number;
  travelers: number;
  travelStyle: string;
  luxuryLevel: string;
  aiSuggestedItinerary: string;
  status: "new" | "reviewed" | "quoted" | "converted";
  createdAt: string;
}

export const seedTripPlannerRequests: TripPlannerRequest[] = [
  {
    id: "tp1",
    customerName: "Tom Reilly",
    customerEmail: "tom.reilly@example.com",
    destination: "Kenya + Zanzibar",
    budgetUsd: 3500,
    days: 10,
    travelers: 2,
    travelStyle: "Relaxed",
    luxuryLevel: "Mid-range",
    aiSuggestedItinerary: "Day 1-4: Maasai Mara safari. Day 5: Fly to Zanzibar. Day 6-10: Stone Town + beach at Nungwi.",
    status: "new",
    createdAt: "2026-07-16",
  },
  {
    id: "tp2",
    customerName: "Elena Petrova",
    customerEmail: "elena.p@example.com",
    destination: "Morocco",
    budgetUsd: 1800,
    days: 6,
    travelers: 2,
    travelStyle: "Culture-focused",
    luxuryLevel: "Boutique",
    aiSuggestedItinerary: "Day 1-2: Marrakech medina and food tour. Day 3: Chefchaouen day trip. Day 4-5: Sahara desert camp. Day 6: Return to Marrakech.",
    status: "quoted",
    createdAt: "2026-07-09",
  },
];
