// Shared between the homepage sections below (fallback when a site_settings
// row is unset) and the admin Settings form (pre-filled default value),
// same reasoning as HERO_TEXT_DEFAULTS in lib/hero.ts.

export const WHY_CHOOSE_DEFAULTS = {
  whyChooseHeadlineLine1: "More Than Just a Trip,",
  whyChooseHeadlineLine2: "It's a Connection.",
  whyChooseDescription:
    "We don't just show you places; we connect you to the people, the culture, and the wild beauty of Africa.",
  whyChooseImage: "https://upload.wikimedia.org/wikipedia/commons/4/41/Kenya_safari.jpg",
  whyChooseChecklist1: "Local travel experts who live where they guide",
  whyChooseChecklist2: "Personalized, flexible itineraries",
  whyChooseChecklist3: "Transparent pricing, no hidden fees",
  whyChooseChecklist4: "24/7 customer support",
  whyChooseCtaLabel: "About Teyezilla",
  whyChooseCtaHref: "/about",
} as const;

export type WhyChooseKey = keyof typeof WHY_CHOOSE_DEFAULTS;

export const TRUST_INDICATORS_DEFAULTS = {
  trustIndicator1Title: "Local Experts",
  trustIndicator1Desc: "Passionate guides with deep local knowledge.",
  trustIndicator2Title: "Safe & Reliable",
  trustIndicator2Desc: "Your safety and comfort are our priority.",
  trustIndicator3Title: "Quality Experiences",
  trustIndicator3Desc: "Handpicked activities and premium services.",
  trustIndicator4Title: "Sustainable Tourism",
  trustIndicator4Desc: "Travel responsibly and support local communities.",
} as const;

export type TrustIndicatorKey = keyof typeof TRUST_INDICATORS_DEFAULTS;

export const CATEGORY_OVERVIEW_DEFAULTS = {
  categoryDestinationsDescription: "Diverse lands. Diverse cultures. Unforgettable experiences.",
  categoryDestinationsImage: "https://picsum.photos/seed/category-destinations/600/800",
  categoryJourneysDescription: "Curated itineraries for every kind of traveler.",
  categoryJourneysImage: "https://picsum.photos/seed/category-journeys/600/800",
  categoryExperiencesDescription: "Handpicked activities that bring Africa to life.",
  categoryExperiencesImage: "https://picsum.photos/seed/category-experiences/600/800",
  categoryCollectionsDescription: "Curated collections, each a distinct way to experience Africa.",
  categoryCollectionsImage: "https://picsum.photos/seed/category-collections/600/800",
  categorySafariDescription: "The art of the African safari, perfectly crafted.",
  categorySafariImage: "https://picsum.photos/seed/category-safari/600/800",
  categoryBespokeDescription: "Your journey. Your way. Designed around you.",
  categoryBespokeImage: "https://picsum.photos/seed/category-bespoke/600/800",
  categoryJournalDescription: "Travel stories, guides and inspiration from Africa.",
  categoryJournalImage: "https://picsum.photos/seed/category-journal/600/800",
} as const;

export type CategoryOverviewKey = keyof typeof CATEGORY_OVERVIEW_DEFAULTS;
