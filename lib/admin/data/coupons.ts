import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedCoupons, type Coupon } from "./coupons.seed";

export type { Coupon };

function mapRow(row: Record<string, any>): Coupon {
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value ?? 0),
    isReferral: Boolean(row.is_referral),
    usageLimit: Number(row.usage_limit ?? 0),
    usedCount: Number(row.used_count ?? 0),
    expiresAt: row.expires_at,
  };
}

export async function getCoupons(): Promise<Coupon[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedCoupons;

  const { data, error } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[coupons] Supabase query failed, using seed data:", error?.message);
    return seedCoupons;
  }

  return data.map(mapRow);
}
