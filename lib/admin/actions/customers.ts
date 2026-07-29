"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface CustomerInput {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  emergencyContact: string;
  notes: string;
  loyaltyPoints: number;
}

function toRow(input: CustomerInput) {
  return {
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    nationality: input.nationality,
    emergency_contact: input.emergencyContact,
    notes: input.notes,
    loyalty_points: input.loyaltyPoints,
  };
}

export async function createCustomer(input: CustomerInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("customers").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("customers").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");
}

// customers is referenced by bookings.customer_id with no ON DELETE clause
// (defaults to RESTRICT), so this will fail with a clear FK-violation error
// for any customer who has bookings; by design, not a bug to work around.
export async function deleteCustomer(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}
