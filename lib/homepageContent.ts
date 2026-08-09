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

// Hard cap enforced on the admin description fields (Settings -> Explore
// Teyezilla) so the card display -- fixed at 4 clamped lines, see
// CategoryOverview.tsx -- never has to truncate with an ellipsis. Measured
// against the narrowest real layout (the 7-column desktop row, ~162px
// cards): realistic sentences stop fitting cleanly somewhere around 75-80
// characters, so this stays comfortably under that.
export const CATEGORY_DESCRIPTION_MAX_LENGTH = 75;

// The standalone /tailor-made-trips ("Bespoke") page.
export const BESPOKE_PAGE_DEFAULTS = {
  bespokeEyebrow: "Bespoke",
  bespokeHeadline: "Your Journey, Your Way",
  bespokeIntro:
    "Every Teyezilla journey can be shaped around your budget, travel style, and luxury level. You work directly with our team to design a trip around exactly what you want to see, do, and experience, not the other way around.",
  bespokeService1: "One dedicated point of contact from first enquiry to the end of your trip",
  bespokeService2: "Fully custom itinerary design around your interests, pace, and budget",
  bespokeService3: "Private guides, vehicles, and logistics arranged on request",
  bespokeService4: "Flexible date and booking changes handled directly, without back-and-forth",
  bespokeHowItWorksHeading: "How It Works",
  bespokeHowItWorksBody:
    "Use our AI Trip Planner to get a suggested itinerary in minutes, or tell us about the trip you have in mind directly: destinations, dates, group size, and the kind of experience you're after, and our team will put together a tailored proposal. There's no separate booking system for this; it runs through the same team that handles every Teyezilla journey, just with a more hands-on, one-to-one planning process.",
  bespokeCtaLabel: "Design My Journey",
} as const;

export type BespokePageKey = keyof typeof BESPOKE_PAGE_DEFAULTS;
