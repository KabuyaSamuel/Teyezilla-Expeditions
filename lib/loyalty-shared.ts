// Plain (non-server-action) loyalty math, kept separate from
// lib/admin/actions/loyalty.ts because a "use server" file may only export
// async functions -- these need to be callable directly from client
// components too (e.g. a live discount preview while staff type a point
// amount into the quote form).

// Points earned per $10 of a booking's quoted total, admin-editable in
// Website Settings. Redemption uses the same rate in reverse (1 point =
// $10 / rate) so earning and spending stay symmetric.
export const LOYALTY_ACCRUAL_SETTING_KEY = "loyaltyPointsPer10" as const;
export const LOYALTY_ACCRUAL_DEFAULT = 1;

export function parseLoyaltyAccrualRate(raw: string | null): number {
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : LOYALTY_ACCRUAL_DEFAULT;
}

export function pointsForAmount(amount: number, ratePer10: number): number {
  return Math.floor(amount * (ratePer10 / 10));
}

export function dollarValueOfPoints(points: number, ratePer10: number): number {
  return Math.round(points * (10 / ratePer10) * 100) / 100;
}
