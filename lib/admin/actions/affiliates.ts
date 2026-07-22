"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AffiliateInput {
  name: string;
  status: "not_connected" | "connected" | "pending";
  commissionRate: number | null;
  notes: string;
}

function toRow(input: AffiliateInput) {
  return {
    name: input.name,
    status: input.status,
    commission_rate: input.commissionRate,
    notes: input.notes,
  };
}

export async function createAffiliatePartner(input: AffiliateInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("affiliate_partners").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/affiliates");
  redirect("/admin/affiliates");
}

export async function updateAffiliatePartner(id: string, input: AffiliateInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("affiliate_partners").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/affiliates");
  redirect("/admin/affiliates");
}

export async function deleteAffiliatePartner(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("affiliate_partners").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/affiliates");
  redirect("/admin/affiliates");
}
