"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface InventoryInput {
  tourId: string;
  date: string;
  capacity: number;
  bookedCount: number;
}

function toRow(input: InventoryInput) {
  return {
    tour_id: input.tourId,
    date: input.date,
    capacity: input.capacity,
    booked_count: input.bookedCount,
  };
}

export async function createInventoryRecord(input: InventoryInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tour_availability").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

export async function updateInventoryRecord(id: string, input: InventoryInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tour_availability").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

export async function deleteInventoryRecord(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("tour_availability").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}
