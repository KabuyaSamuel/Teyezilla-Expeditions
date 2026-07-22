import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isReferral: boolean;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
}

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
  if (!supabase) {
    console.warn("[coupons] Supabase not configured, returning no coupons.");
    return [];
  }

  const { data, error } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[coupons] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getCouponByCode(code: string): Promise<Coupon | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[coupons] Supabase not configured, returning no coupon.");
    return undefined;
  }

  const { data, error } = await supabase.from("discount_codes").select("*").eq("code", code).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[coupons] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
