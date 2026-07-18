import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedCustomers, type Customer } from "./customers.seed";

export type { Customer };

function mapRow(row: Record<string, any>): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    nationality: row.nationality ?? "",
    emergencyContact: row.emergency_contact ?? "",
    notes: row.notes ?? "",
    loyaltyPoints: Number(row.loyalty_points ?? 0),
    createdAt: row.created_at,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedCustomers;

  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[customers] Supabase query failed, using seed data:", error?.message);
    return seedCustomers;
  }

  return data.map(mapRow);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedCustomers.find((c) => c.id === id);

  const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[customers] Supabase query failed, using seed data:", error.message);
    return seedCustomers.find((c) => c.id === id);
  }

  return mapRow(data);
}
