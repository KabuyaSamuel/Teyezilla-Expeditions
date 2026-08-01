"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface DepartureAssignment {
  guideId: string | null;
  driverId: string | null;
  vehicleId: string | null;
}

export async function assignDeparture(bookingId: string, input: DepartureAssignment): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase
    .from("bookings")
    .update({
      assigned_guide_id: input.guideId,
      assigned_driver_id: input.driverId,
      assigned_vehicle_id: input.vehicleId,
    })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/operations");
}
