export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  status: "draft" | "published" | "scheduled";
  scheduledFor?: string;
  publishedAt?: string;
}

export const adminBlogPosts: AdminBlogPost[] = [
  { id: "bp1", title: "Best Safari in Kenya", slug: "best-safari-in-kenya", category: "Safari Guides", tags: ["kenya", "safari"], metaTitle: "Best Safari in Kenya | Teyezilla Expeditions", metaDescription: "The best Kenya safari for first-time visitors.", featuredImage: "https://picsum.photos/seed/blog-kenya/800/500", status: "published", publishedAt: "2026-05-01" },
  { id: "bp2", title: "Kenya vs Tanzania Safari", slug: "kenya-vs-tanzania-safari", category: "Comparisons", tags: ["kenya", "tanzania"], metaTitle: "Kenya vs Tanzania Safari | Teyezilla Expeditions", metaDescription: "How the two classic safari countries compare.", featuredImage: "https://picsum.photos/seed/blog-comparison/800/500", status: "published", publishedAt: "2026-05-10" },
  { id: "bp3", title: "Best Time to Visit Zanzibar", slug: "best-time-to-visit-zanzibar", category: "Travel Tips", tags: ["zanzibar"], metaTitle: "Best Time to Visit Zanzibar | Teyezilla Expeditions", metaDescription: "Seasons, weather, and when to book.", featuredImage: "https://picsum.photos/seed/blog-zanzibar/800/500", status: "published", publishedAt: "2026-05-18" },
  { id: "bp4", title: "Egypt Travel Guide", slug: "egypt-travel-guide", category: "Destination Guides", tags: ["egypt"], metaTitle: "Egypt Travel Guide | Teyezilla Expeditions", metaDescription: "Pyramids, Nile cruises, and Luxor, planned out.", featuredImage: "https://picsum.photos/seed/blog-egypt/800/500", status: "published", publishedAt: "2026-06-02" },
  { id: "bp5", title: "Morocco Travel Guide", slug: "morocco-travel-guide", category: "Destination Guides", tags: ["morocco"], metaTitle: "Morocco Travel Guide | Teyezilla Expeditions", metaDescription: "Marrakech, Chefchaouen, and the Sahara.", featuredImage: "https://picsum.photos/seed/blog-morocco/800/500", status: "published", publishedAt: "2026-06-14" },
  { id: "bp6", title: "Africa Travel Tips", slug: "africa-travel-tips", category: "Travel Tips", tags: ["general"], metaTitle: "Africa Travel Tips | Teyezilla Expeditions", metaDescription: "Practical advice before your first trip.", featuredImage: "https://picsum.photos/seed/blog-tips/800/500", status: "published", publishedAt: "2026-06-25" },
  { id: "bp7", title: "Family Safaris: What to Know Before You Go", slug: "family-safaris-what-to-know", category: "Travel Tips", tags: ["kenya", "family"], metaTitle: "Family Safari Guide | Teyezilla Expeditions", metaDescription: "Planning a safari with kids.", featuredImage: "https://picsum.photos/seed/blog-family/800/500", status: "draft" },
  { id: "bp8", title: "Zanzibar Diving Guide: Mnemba Island", slug: "zanzibar-diving-mnemba", category: "Destination Guides", tags: ["zanzibar", "diving"], metaTitle: "Mnemba Island Diving Guide", metaDescription: "What to expect diving Mnemba Island.", featuredImage: "https://picsum.photos/seed/blog-diving/800/500", status: "scheduled", scheduledFor: "2026-08-01" },
];
