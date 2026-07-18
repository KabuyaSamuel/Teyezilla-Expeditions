import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedInventoryRecords, type InventoryRecord } from "./inventory.seed";

export type { InventoryRecord };

// Reads from `tour_availability`, joined to `tours` for the display title.
// Guide/driver/vehicle assignment isn't in the schema yet as dedicated
// columns — extend `tour_availability` with those fields (or a linked
// assignments table) when the Inventory & Availability module needs to
// write real assignments rather than just display capacity.
function mapRow(row: Record<string, any>): InventoryRecord {
  return {
    id: row.id,
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
  if (!supabase) return seedInventoryRecords;

  const { data, error } = await supabase
    .from("tour_availability")
    .select("*, tour:tours(title)")
    .order("date", { ascending: true });

  if (error || !data) {
    console.warn("[inventory] Supabase query failed, using seed data:", error?.message);
    return seedInventoryRecords;
  }

  return data.map(mapRow);
}
