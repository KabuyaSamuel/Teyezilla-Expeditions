"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import { redirectWithSaved } from "./saved-redirect";

export interface VehicleInput {
  name: string;
  slug: string;
  vehicleType: string;
  seats: number | null;
  description: string;
  features: string[];
  image: string;
  displayOrder: number;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: VehicleInput) {
  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    vehicle_type: input.vehicleType,
    seats: input.seats,
    description: input.description,
    features: input.features,
    image: input.image,
    display_order: input.displayOrder,
  };
}

export async function createVehicle(input: VehicleInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("vehicles").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/vehicles");
  revalidatePublicSite();
  redirectWithSaved("/admin/vehicles", `"${input.name}" created.`);
}

export async function updateVehicle(id: string, input: VehicleInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("vehicles").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/vehicles");
  revalidatePublicSite();
  redirectWithSaved("/admin/vehicles", `"${input.name}" saved.`);
}

export async function deleteVehicle(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  // tour_vehicles / journey_vehicles reference vehicle_id on delete cascade.
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/vehicles");
  revalidatePublicSite();
  redirectWithSaved("/admin/vehicles", "Vehicle deleted.");
}
