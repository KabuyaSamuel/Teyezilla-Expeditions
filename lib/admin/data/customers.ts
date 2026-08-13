import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  emergencyContact: string;
  notes: string;
  loyaltyPoints: number;
  createdAt: string;
  archivedAt: string | null;
}

function mapRow(row: Tables<"customers">): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    nationality: row.nationality ?? "",
    emergencyContact: row.emergency_contact ?? "",
    notes: row.notes ?? "",
    loyaltyPoints: Number(row.loyalty_points ?? 0),
    createdAt: row.created_at ?? "",
    archivedAt: row.archived_at,
  };
}

// Archived customers are excluded by default -- they're kept (not deleted)
// specifically so their booking/payment/loyalty history stays intact, but
// they shouldn't clutter the active customer list. Pass includeArchived to
// show them (e.g. an "archived customers" view).
export async function getCustomers({ includeArchived = false } = {}): Promise<Customer[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[customers] Supabase not configured, returning no customers.");
    return [];
  }

  let query = supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (!includeArchived) query = query.is("archived_at", null);

  const { data, error } = await query;

  if (error || !data) {
    console.warn("[customers] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[customers] Supabase not configured, returning no customer.");
    return undefined;
  }

  const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[customers] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
