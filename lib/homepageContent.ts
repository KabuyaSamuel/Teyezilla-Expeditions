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

// Reuses real Media Library uploads (already used elsewhere for
// destinations/tours/journeys/blog posts) instead of picsum.photos
// placeholders -- repeating a real photo across a couple of cards reads
// better than random stock placeholder images. See also the same
// replacement applied directly to picsum rows in the destinations/tours/
// journeys/blog_posts tables.
const MEDIA_BASE = "https://qqcolygpeoymlshsnyir.supabase.co/storage/v1/object/public/media/";

export const CATEGORY_OVERVIEW_DEFAULTS = {
  categoryDestinationsDescription: "Diverse lands. Diverse cultures. Unforgettable experiences.",
  categoryDestinationsImage: `${MEDIA_BASE}930b866b-bc15-4837-83d8-c1e40034e44b.jpg`,
  categoryJourneysDescription: "Curated itineraries for every kind of traveler.",
  categoryJourneysImage: `${MEDIA_BASE}cb11321a-9f2f-49f3-aeb1-6cd0530adae3.jpg`,
  categoryExperiencesDescription: "Handpicked activities that bring Africa to life.",
  categoryExperiencesImage: `${MEDIA_BASE}4da737ba-b37e-40b1-85c0-68b1af6088e1.jpeg`,
  categoryCollectionsDescription: "Curated collections, each a distinct way to experience Africa.",
  categoryCollectionsImage: `${MEDIA_BASE}sample-journey-tanzania-1785298804.jpg`,
  categorySafariDescription: "The art of the African safari, perfectly crafted.",
  categorySafariImage: `${MEDIA_BASE}98fa177e-1e65-4e2c-b064-28ba86a2af0c.jpeg`,
  categoryBespokeDescription: "Your journey. Your way. Designed around you.",
  categoryBespokeImage: `${MEDIA_BASE}sample-journey-morocco-1785298807.jpg`,
  categoryJournalDescription: "Travel stories, guides and inspiration from Africa.",
  categoryJournalImage: `${MEDIA_BASE}blog-africa-travel-tips.jpg`,
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
