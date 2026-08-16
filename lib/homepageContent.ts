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

// The "Explore Teyezilla" section heading/subtext above the 7 category
// cards -- kept as its own defaults object rather than folded into
// CATEGORY_OVERVIEW_DEFAULTS since resolveSiteText's structural-field
// regex (image|href) and CATEGORY_DESCRIPTION_MAX_LENGTH both apply only
// to the per-card fields, not this section-level copy.
export const EXPLORE_TEYEZILLA_HEADING_DEFAULTS = {
  exploreTeyezillaHeadline: "Explore Teyezilla",
  exploreTeyezillaSubtext: "Seven ways to discover Africa, all in one place.",
} as const;

export type ExploreTeyezillaHeadingKey = keyof typeof EXPLORE_TEYEZILLA_HEADING_DEFAULTS;

// Heading/subtext for the homepage's three "Featured X" sections
// (Destinations, Journeys, Experiences) -- the cards themselves are
// driven by real data (getFeaturedDestinations/Tours/Journeys), only this
// section-level copy is static text worth making staff-editable.
export const FEATURED_SECTIONS_DEFAULTS = {
  featuredDestinationsHeadline: "Featured Destinations",
  featuredDestinationsSubtext: "A balanced spread across Africa, from safari heartlands to island escapes.",
  featuredJourneysHeadline: "Featured Journeys",
  featuredJourneysSubtext: "Curated multi-day journeys connecting wildlife, culture, and place.",
  featuredExperiencesHeadline: "Featured Experiences",
  featuredExperiencesSubtext: "Handpicked tours our travelers book again and again.",
} as const;

export type FeaturedSectionsKey = keyof typeof FEATURED_SECTIONS_DEFAULTS;

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

// The four catalog hub pages (/experiences, /journeys, /collections,
// /safari) had their intro copy hardcoded directly in each page.tsx --
// fine when it was placeholder text, but the real descriptive copy added
// for SEO needs to be staff-editable without a code change, same as every
// other on-page text in this file (each gets its own defaults object,
// matching BESPOKE_PAGE_DEFAULTS above rather than one shared bag, so
// resolveSiteText's key list always exactly matches the object's own
// keys per page). Collections' page has a second, count-based sentence
// ("N curated ways...") that isn't included here -- that one is
// generated from the live collections count in code, so making it an
// editable static string would let it drift out of sync with the real
// count.
export const EXPERIENCES_PAGE_DEFAULTS = {
  experiencesHeadline: "Experiences",
  experiencesIntro1: "From street food in Nairobi to safaris in the Mara and desert camps in the Sahara.",
  experiencesIntro2:
    "Every trip here starts as a real itinerary, not a template: a private safari through the Maasai Mara timed to the wildebeest migration, a Zanzibar beach stay built around Stone Town and the reef, a Sahara crossing by camel and 4x4, or a few unhurried days eating and wandering through Marrakech or Nairobi. Filter by experience type or destination below, or browse by category above -- wildlife and safari, beach and islands, culture and heritage, adventure, food and lifestyle, or city life -- to find the shape of trip you're after. Every listing links through to a full itinerary with pricing, duration, and what's included, and our travel team is happy to adjust any of them to fit your dates and interests.",
} as const;

export type ExperiencesPageKey = keyof typeof EXPERIENCES_PAGE_DEFAULTS;

export const JOURNEYS_PAGE_DEFAULTS = {
  journeysHeadline: "Journeys",
  journeysIntro:
    "Thoughtfully designed, multi-day itineraries, from signature single-country trips to multi-country expeditions across Africa.",
} as const;

export type JourneysPageKey = keyof typeof JOURNEYS_PAGE_DEFAULTS;

export const COLLECTIONS_PAGE_DEFAULTS = {
  collectionsHeadline: "The Teyezilla Collections",
  collectionsIntro:
    "Instead of browsing every tour and journey individually, these collections group trips by the kind of experience you're after -- an ocean escape, a heritage-focused journey, a hands-on adventure -- so you can start from the feeling you want the trip to have rather than a destination or date. Each collection is picked and maintained by our travel team, not generated automatically, and every trip inside it links through to a full itinerary you can book or ask us to adjust.",
} as const;

export type CollectionsPageKey = keyof typeof COLLECTIONS_PAGE_DEFAULTS;

export const SAFARI_PAGE_DEFAULTS = {
  safariEyebrow: "Safari",
  safariHeadline: "The Art of the African Safari",
  safariIntro:
    "Go deeper into the wild with Teyezilla, from the Great Migration to gorilla trekking, every safari is planned by guides who know these landscapes firsthand.",
} as const;

export type SafariPageKey = keyof typeof SAFARI_PAGE_DEFAULTS;

export const DESTINATIONS_PAGE_DEFAULTS = {
  destinationsHeadline: "Destinations",
  destinationsIntro1: "Five destinations open for booking today, with more of Africa on the way.",
  destinationsIntro2:
    "Kenya and Tanzania cover the classic safari circuit -- the Maasai Mara, the Serengeti, and the wildebeest migration between them. Zanzibar adds the beach half of an East Africa trip, with Stone Town's history alongside the reef. Egypt and Morocco sit further afield: the pyramids and Nile in one, the Atlas Mountains, medinas, and Sahara in the other. Each destination page below covers the tours and journeys available there today; switch to \"Coming Soon\" above for a look at where we're opening next as those itineraries get finalized.",
} as const;

export type DestinationsPageKey = keyof typeof DESTINATIONS_PAGE_DEFAULTS;
