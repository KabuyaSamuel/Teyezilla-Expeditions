import { getSupabaseServerClient } from "@/lib/supabase/server";

// Affiliate Management (Phase 3 spec: "scaffold the schema now; UI can come later").
// Partner records (name/status/commission rate/notes) are fully editable;
// the live booking-sync/commission-tracking integration itself is still
// future work, per that spec; that's a different feature, not this CRUD.

export interface AffiliatePartner {
  id: string;
  name: string;
  status: "not_connected" | "connected" | "pending";
  commissionRate: number | null;
  notes: string;
}

function mapRow(row: Record<string, any>): AffiliatePartner {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    commissionRate: row.commission_rate !== null ? Number(row.commission_rate) : null,
    notes: row.notes ?? "",
  };
}

export async function getAffiliatePartners(): Promise<AffiliatePartner[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[affiliates] Supabase not configured, returning no affiliate partners.");
    return [];
  }

  const { data, error } = await supabase.from("affiliate_partners").select("*").order("name");

  if (error || !data) {
    console.warn("[affiliates] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAffiliatePartnerById(id: string): Promise<AffiliatePartner | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[affiliates] Supabase not configured, returning no affiliate partner.");
    return undefined;
  }

  const { data, error } = await supabase.from("affiliate_partners").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[affiliates] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
