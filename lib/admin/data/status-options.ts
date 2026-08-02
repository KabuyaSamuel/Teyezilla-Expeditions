import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type StatusCategory = "booking_status" | "payment_status";
export type StatusTone = "success" | "error" | "pending" | "info" | "neutral";

export interface StatusOption {
  id: string;
  category: StatusCategory;
  key: string;
  label: string;
  tone: StatusTone;
  displayOrder: number;
}

function mapRow(row: Tables<"status_options">): StatusOption {
  return {
    id: row.id,
    category: row.category as StatusCategory,
    key: row.key,
    label: row.label,
    tone: row.tone as StatusTone,
    displayOrder: row.display_order,
  };
}

export async function getAllStatusOptions(): Promise<StatusOption[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[status-options] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("status_options")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.warn("[status-options] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getStatusOptions(category: StatusCategory): Promise<StatusOption[]> {
  const all = await getAllStatusOptions();
  return all.filter((o) => o.category === category);
}
