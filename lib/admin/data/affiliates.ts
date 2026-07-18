import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedAffiliatePartners, type AffiliatePartner } from "./affiliates.seed";

export type { AffiliatePartner };

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
  if (!supabase) return seedAffiliatePartners;

  const { data, error } = await supabase.from("affiliate_partners").select("*").order("name");

  if (error || !data) {
    console.warn("[affiliates] Supabase query failed, using seed data:", error?.message);
    return seedAffiliatePartners;
  }

  return data.map(mapRow);
}
