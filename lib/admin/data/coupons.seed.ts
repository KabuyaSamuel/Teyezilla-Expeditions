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

export const seedCoupons: Coupon[] = [
  { id: "co1", code: "SAFARI10", discountType: "percentage", discountValue: 10, isReferral: false, usageLimit: 200, usedCount: 84, expiresAt: "2026-12-31" },
  { id: "co2", code: "ZANZIBAR50", discountType: "fixed", discountValue: 50, isReferral: false, usageLimit: 100, usedCount: 22, expiresAt: "2026-09-30" },
  { id: "co3", code: "REFERAMARA", discountType: "percentage", discountValue: 15, isReferral: true, usageLimit: 50, usedCount: 6, expiresAt: "2027-01-01" },
  { id: "co4", code: "GROUP6PLUS", discountType: "percentage", discountValue: 12, isReferral: false, usageLimit: 999, usedCount: 14, expiresAt: "2026-11-30" },
];
