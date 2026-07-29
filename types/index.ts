import type { ContentBlock } from "@/lib/blogBlocks";

export interface SEOFields {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  slug: string;
}

export interface Destination extends SEOFields {
  id: string;
  countryName: string;
  flagEmoji: string;
  heroImage: string;
  shortDescription: string;
  overview: string;
  bestTimeToVisit: string;
  visaInfo: string;
  isLaunchDestination: boolean;
}

export interface Tour extends SEOFields {
  id: string;
  destinationId: string;
  title: string;
  categoryLabel: string;
  productType: string;
  heroImage: string;
  shortDescription: string;
  durationDays: number;
  durationHours: number | null;
  priceFrom: number;
  currency: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  featured: boolean;
  status: "draft" | "published";
}

export interface Review {
  id: string;
  authorName: string;
  source: "Google" | "TripAdvisor" | "GetYourGuide";
  rating: number;
  quote: string;
  tourTitle?: string;
}

export interface BlogPost extends SEOFields {
  id: string;
  title: string;
  excerpt: string;
  answer: string;
  body: string;
  heroImage: string;
  authorName: string;
  authorBio: string;
  publishedAt: string;
  category: string;
  destinationId: string | null;
  bodyBlocks: ContentBlock[];
}
