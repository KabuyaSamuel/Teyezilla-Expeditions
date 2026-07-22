import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface InventoryRecord {
  id: string;
  tourId: string;
  tourTitle: string;
  date: string;
  capacity: number;
  bookedCount: number;
  guideAssigned?: string;
  driverAssigned?: string;
  vehicle?: string;
}

// Reads from `tour_availability`, joined to `tours` for the display title.
// Guide/driver/vehicle assignment isn't in the schema yet as dedicated
// columns — extend `tour_availability` with those fields (or a linked
// assignments table) when the Inventory & Availability module needs to
// write real assignments rather than just display capacity.
function mapRow(row: Record<string, any>): InventoryRecord {
  return {
    id: row.id,
    tourId: row.tour_id,
    tourTitle: row.tour?.title ?? "Unknown Tour",
    date: row.date,
    capacity: Number(row.capacity ?? 0),
    bookedCount: Number(row.booked_count ?? 0),
    guideAssigned: undefined,
    driverAssigned: undefined,
    vehicle: undefined,
  };
}

export async function getInventoryRecords(): Promise<InventoryRecord[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[inventory] Supabase not configured, returning no records.");
    return [];
  }

  const { data, error } = await supabase
    .from("tour_availability")
    .select("*, tour:tours(title)")
    .order("date", { ascending: true });

  if (error || !data) {
    console.warn("[inventory] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getInventoryRecordById(id: string): Promise<InventoryRecord | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[inventory] Supabase not configured, returning no record.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("tour_availability")
    .select("*, tour:tours(title)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[inventory] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
