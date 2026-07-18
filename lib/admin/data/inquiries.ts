export type InquirySource = "website" | "whatsapp" | "contact_form" | "ai_trip_planner";
export type InquiryStatus = "new" | "in_progress" | "quoted" | "converted" | "closed";

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  source: InquirySource;
  tourTitle?: string;
  message: string;
  assignedStaff?: string;
  status: InquiryStatus;
  createdAt: string;
}

export const inquiries: Inquiry[] = [
  { id: "i1", customerName: "Laila Haddad", customerEmail: "laila.h@example.com", source: "whatsapp", tourTitle: "Marrakech & Sahara Desert", message: "Is the Sahara camp suitable for a 70-year-old traveler?", assignedStaff: "Grace Mwangi", status: "in_progress", createdAt: "2026-07-14" },
  { id: "i2", customerName: "Tom Reilly", customerEmail: "tom.reilly@example.com", source: "ai_trip_planner", tourTitle: undefined, message: "10-day Kenya + Zanzibar combo, budget $3,500, 2 travelers, mid-range luxury.", assignedStaff: undefined, status: "new", createdAt: "2026-07-16" },
  { id: "i3", customerName: "Chen Wei", customerEmail: "chen.wei@example.com", source: "contact_form", tourTitle: "Pyramids of Giza Tour", message: "Can you add a private guide for our group of 4?", assignedStaff: "Grace Mwangi", status: "quoted", createdAt: "2026-07-11" },
  { id: "i4", customerName: "Sofia Rossi", customerEmail: "sofia.rossi@example.com", source: "website", tourTitle: "Zanzibar Beach Escape", message: "Do you have availability the last week of September?", assignedStaff: undefined, status: "new", createdAt: "2026-07-17" },
];
