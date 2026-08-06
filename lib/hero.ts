import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface HeroSlide {
  id: string;
  mediaUrl: string;
  altText: string;
}

// Shared between the homepage Hero (fallback when a site_settings row is
// unset) and the admin Settings form (pre-filled default values), so both
// sides of "what does this look like before anyone has ever saved it" agree.
export const HERO_TEXT_DEFAULTS = {
  heroBadgeText: "Africa, Beyond Expectation.",
  heroHeadlineLine1: "Extraordinary Journeys.",
  heroHeadlineLine2: "Wild Places. Deeper Connections.",
  heroSubtitle:
    "Discover Africa through extraordinary safaris, immersive experiences, and thoughtfully crafted journeys, created by locals who know the places they call home.",
  heroCta1Label: "Explore Tours",
  heroCta1Href: "/destinations",
  heroCta2Label: "Design My Journey",
  heroCta2Href: "/tailor-made-trips",
} as const;

export type HeroTextKey = keyof typeof HERO_TEXT_DEFAULTS;

// TEMP: free-license (Mixkit) African wildlife footage, standing in until
// staff add real Teyezilla footage via Website Settings -> Homepage Hero.
// Hand-picked to be genuinely African wilderness (several Mixkit "safari"
// clips turned out to be zoo/botanical-garden or Southeast Asian elephant
// footage on close inspection; excluded those).
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "default-11054",
    mediaUrl: "https://assets.mixkit.co/videos/11054/11054-720.mp4",
    altText: "Lions in the African savanna",
  },
  {
    id: "default-4285",
    mediaUrl: "https://assets.mixkit.co/videos/4285/4285-720.mp4",
    altText: "Camel caravan crossing the Sahara desert dunes, Morocco",
  },
  {
    id: "default-11363",
    mediaUrl: "https://assets.mixkit.co/videos/11363/11363-720.mp4",
    altText: "Giraffe drinking at a watering hole",
  },
  {
    id: "default-11165",
    mediaUrl: "https://assets.mixkit.co/videos/11165/11165-720.mp4",
    altText: "Giraffe, zebra, and springbok sharing a watering hole",
  },
];

function mapRow(row: { id: string; media_url: string; alt_text: string | null }): HeroSlide {
  return {
    id: row.id,
    mediaUrl: row.media_url,
    altText: row.alt_text ?? "",
  };
}

// Falls back to DEFAULT_HERO_SLIDES when staff haven't configured any yet,
// so the homepage never renders with an empty hero.
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[hero] Supabase not configured, using default hero slides.");
    return DEFAULT_HERO_SLIDES;
  }

  const { data, error } = await supabase.from("hero_slides").select("*").order("display_order");

  if (error) {
    console.warn("[hero] Supabase query failed:", error.message);
    return DEFAULT_HERO_SLIDES;
  }
  if (!data || data.length === 0) return DEFAULT_HERO_SLIDES;

  return data.map(mapRow);
}
