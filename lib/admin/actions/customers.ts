"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirectWithSaved } from "./saved-redirect";

export interface CustomerInput {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  emergencyContact: string;
  notes: string;
}

// loyalty_points is deliberately not settable here -- it only changes
// through lib/admin/actions/loyalty.ts, which writes a ledger row alongside
// every balance change. Direct overwrite would leave adjustments unaudited.
function toRow(input: CustomerInput) {
  return {
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    nationality: input.nationality,
    emergency_contact: input.emergencyContact,
    notes: input.notes,
  };
}

export async function createCustomer(input: CustomerInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("customers").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/customers");
  redirectWithSaved("/admin/customers", `"${input.fullName}" created.`);
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("customers").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");
}

// Soft-delete: customers is referenced by bookings.customer_id (no cascade,
// so a hard delete fails for anyone with bookings) and by
// loyalty_transactions.customer_id (which *does* cascade, so a hard delete
// silently erases their points history for anyone without bookings).
// Archiving avoids both -- history stays intact, the record just drops out
// of the default list.
export async function archiveCustomer(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("customers").update({ archived_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/customers");
  redirectWithSaved("/admin/customers", "Customer archived.");
}

export async function unarchiveCustomer(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("customers").update({ archived_at: null }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/customers");
  redirectWithSaved(`/admin/customers/${id}`, "Customer unarchived.");
}
