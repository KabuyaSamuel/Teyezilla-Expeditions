"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface TravelResourcesInput {
  visaInfo: string;
  healthGuidance: string;
  packingList: string;
  insuranceInfo: string;
}

export async function saveTravelResources(destinationId: string, input: TravelResourcesInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase
    .from("destinations")
    .update({
      visa_info: input.visaInfo,
      health_guidance: input.healthGuidance,
      packing_list: input.packingList,
      insurance_info: input.insuranceInfo,
    })
    .eq("id", destinationId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/travel-resources");
  revalidatePath("/destinations", "layout");
}
