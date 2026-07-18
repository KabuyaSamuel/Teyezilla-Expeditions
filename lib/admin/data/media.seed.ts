export interface MediaItem {
  id: string;
  fileUrl: string;
  fileType: "image" | "video" | "pdf";
  altText: string;
  tags: string[];
  uploadedAt: string;
}

export const seedMediaItems: MediaItem[] = [
  { id: "m1", fileUrl: "https://picsum.photos/seed/kenya-hero/1200/800", fileType: "image", altText: "Maasai Mara plains at sunrise", tags: ["kenya", "safari"], uploadedAt: "2026-05-10" },
  { id: "m2", fileUrl: "https://picsum.photos/seed/sahara/1200/800", fileType: "image", altText: "Sahara desert dunes at dusk", tags: ["morocco", "desert"], uploadedAt: "2026-05-12" },
  { id: "m3", fileUrl: "https://picsum.photos/seed/pyramids/1200/800", fileType: "image", altText: "Pyramids of Giza", tags: ["egypt", "pyramids"], uploadedAt: "2026-05-14" },
  { id: "m4", fileUrl: "/brochures/kenya-safari-brochure.pdf", fileType: "pdf", altText: "Kenya Safari Brochure 2026", tags: ["kenya", "brochure"], uploadedAt: "2026-06-01" },
];
