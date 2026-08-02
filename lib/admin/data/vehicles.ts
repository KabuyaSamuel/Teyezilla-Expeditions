import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface AdminVehicle {
  id: string;
  name: string;
  slug: string;
  vehicleType: string;
  seats: number | null;
  description: string;
  features: string[];
  image: string;
  displayOrder: number;
}

function mapRow(row: Tables<"vehicles">): AdminVehicle {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    vehicleType: row.vehicle_type ?? "",
    seats: row.seats ?? null,
    description: row.description ?? "",
    features: row.features ?? [],
    image: row.image ?? "",
    displayOrder: Number(row.display_order ?? 0),
  };
}

export async function getAdminVehicles(): Promise<AdminVehicle[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/vehicles] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase.from("vehicles").select("*").order("display_order");

  if (error || !data) {
    console.warn("[admin/vehicles] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAdminVehicleBySlug(slug: string): Promise<AdminVehicle | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/vehicles] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase.from("vehicles").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/vehicles] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
