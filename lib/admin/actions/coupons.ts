"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface CouponInput {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isReferral: boolean;
  usageLimit: number;
  expiresAt: string;
}

function toRow(input: CouponInput) {
  return {
    code: input.code.toUpperCase().trim(),
    discount_type: input.discountType,
    discount_value: input.discountValue,
    is_referral: input.isReferral,
    usage_limit: input.usageLimit,
    expires_at: input.expiresAt || null,
  };
}

export async function createCoupon(input: CouponInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("discount_codes").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(id: string, input: CouponInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("discount_codes").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("discount_codes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}
