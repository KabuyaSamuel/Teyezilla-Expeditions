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
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[customers] Supabase not configured, returning no customers.");
    return [];
  }

  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });

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
