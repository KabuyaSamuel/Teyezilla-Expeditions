// Affiliate Management (Phase 3 spec: "scaffold the schema now; UI can come later").
// This mirrors the intended schema so the module has a real shape once
// commission tracking is built out; the page renders it as a simple readonly list.

export interface AffiliatePartner {
  id: string;
  name: string;
  status: "not_connected" | "connected" | "pending";
  commissionRate: number | null;
  notes: string;
}

export const seedAffiliatePartners: AffiliatePartner[] = [
  { id: "a1", name: "Viator", status: "not_connected", commissionRate: null, notes: "Planned for post-launch." },
  { id: "a2", name: "GetYourGuide", status: "not_connected", commissionRate: null, notes: "Reviews already pulled in on the public site; booking sync is future work." },
  { id: "a3", name: "Booking.com", status: "not_connected", commissionRate: null, notes: "For accommodation bundling, future phase." },
  { id: "a4", name: "Expedia", status: "not_connected", commissionRate: null, notes: "Not prioritized for launch." },
  { id: "a5", name: "Klook", status: "not_connected", commissionRate: null, notes: "Not prioritized for launch." },
];
