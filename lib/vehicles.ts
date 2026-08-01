import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  vehicleType: string;
  seats: number | null;
  description: string;
  features: string[];
  image: string;
}

export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[vehicles] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("id, name, slug, vehicle_type, seats, description, features, image")
    .order("display_order");

  if (error || !data) {
    console.warn("[vehicles] Supabase query failed:", error?.message);
    return [];
  }

  return data.map((v: any) => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    vehicleType: v.vehicle_type ?? "",
    seats: v.seats ?? null,
    description: v.description ?? "",
    features: v.features ?? [],
    image: v.image ?? "",
  }));
}
