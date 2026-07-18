import type { StaffRole } from "../permissions";

// Stands in for the `staff` table until Supabase Auth is connected in Phase 4.
export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  password: string; // plaintext ONLY for this mock login screen — never do this with real auth
}

export const staffMembers: StaffMember[] = [
  { id: "s1", fullName: "Amina Wanjiru", email: "admin@teyezilla.com", role: "admin", password: "demo123" },
  { id: "s2", fullName: "James Otieno", email: "manager@teyezilla.com", role: "manager", password: "demo123" },
  { id: "s3", fullName: "Grace Mwangi", email: "sales@teyezilla.com", role: "sales_agent", password: "demo123" },
  { id: "s4", fullName: "Peter Kamau", email: "guide@teyezilla.com", role: "tour_guide", password: "demo123" },
  { id: "s5", fullName: "Samuel Njoroge", email: "driver@teyezilla.com", role: "driver", password: "demo123" },
];

export function findStaffByEmail(email: string): StaffMember | undefined {
  return staffMembers.find((s) => s.email.toLowerCase() === email.toLowerCase());
}
