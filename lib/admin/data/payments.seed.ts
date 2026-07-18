export type PaymentProvider = "stripe" | "mpesa" | "paypal" | "bank_transfer";

export interface Payment {
  id: string;
  bookingReference: string;
  provider: PaymentProvider;
  providerReference: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: string;
}

export const seedPayments: Payment[] = [
  { id: "p1", bookingReference: "TZ-10231", provider: "stripe", providerReference: "pi_3P8x...", amount: 500, currency: "USD", status: "succeeded", createdAt: "2026-06-02" },
  { id: "p2", bookingReference: "TZ-10232", provider: "mpesa", providerReference: "QK7T8H2X", amount: 1200, currency: "USD", status: "succeeded", createdAt: "2026-06-15" },
  { id: "p3", bookingReference: "TZ-10233", provider: "paypal", providerReference: "PAYID-M8..", amount: 900, currency: "USD", status: "succeeded", createdAt: "2026-07-01" },
  { id: "p4", bookingReference: "TZ-10235", provider: "bank_transfer", providerReference: "REF-88213", amount: 1560, currency: "USD", status: "succeeded", createdAt: "2026-05-01" },
  { id: "p5", bookingReference: "TZ-10236", provider: "stripe", providerReference: "pi_3P9y...", amount: 130, currency: "USD", status: "refunded", createdAt: "2026-06-05" },
];
