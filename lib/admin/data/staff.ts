import type { StaffRole } from "../permissions";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Staff directory for the Staff Management module. Reads from the real
// `staff` table when Supabase is configured; falls back to a seed list (no
// passwords — auth is entirely owned by Supabase Auth now, not this file)
// so the module still renders during local development before Supabase is
// connected.

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
}

const seedStaff: StaffMember[] = [
  { id: "s1", fullName: "Amina Wanjiru", email: "admin@teyezilla.com", role: "admin" },
  { id: "s2", fullName: "James Otieno", email: "manager@teyezilla.com", role: "manager" },
  { id: "s3", fullName: "Grace Mwangi", email: "sales@teyezilla.com", role: "sales_agent" },
  { id: "s4", fullName: "Peter Kamau", email: "guide@teyezilla.com", role: "tour_guide" },
  { id: "s5", fullName: "Samuel Njoroge", email: "driver@teyezilla.com", role: "driver" },
];

export async function getStaffMembers(): Promise<StaffMember[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedStaff;

  const { data, error } = await supabase.from("staff").select("id, full_name, email, role");

  if (error || !data) {
    console.warn("[staff] Supabase query failed, using seed data:", error?.message);
    return seedStaff;
  }

  return data.map((row) => ({
    id: row.id as string,
    fullName: row.full_name as string,
    email: row.email as string,
    role: row.role as StaffRole,
  }));
}
