import type { StaffRole } from "../permissions";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

// Staff directory for the Staff Management module. Reads from the real
// `staff` table; auth is entirely owned by Supabase Auth, not this file.

export interface StaffMember {
  id: string;
  authUserId: string;
  fullName: string;
  email: string;
  role: StaffRole;
}

type StaffRow = Pick<Tables<"staff">, "id" | "auth_user_id" | "full_name" | "email" | "role">;

function mapRow(row: StaffRow): StaffMember {
  return {
    id: row.id,
    authUserId: row.auth_user_id ?? "",
    fullName: row.full_name,
    email: row.email,
    role: row.role as StaffRole,
  };
}

export async function getStaffMembers(): Promise<StaffMember[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[staff] Supabase not configured, returning no staff.");
    return [];
  }

  const { data, error } = await supabase.from("staff").select("id, auth_user_id, full_name, email, role");

  if (error || !data) {
    console.warn("[staff] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getStaffMemberById(id: string): Promise<StaffMember | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[staff] Supabase not configured, returning no staff member.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("staff")
    .select("id, auth_user_id, full_name, email, role")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[staff] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
