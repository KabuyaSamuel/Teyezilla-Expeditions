import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Badge from "@/components/admin/Badge";
import { getPayments } from "@/lib/admin/data/payments";
import { paymentStatusTone } from "@/lib/admin/status-tone";

const PROVIDER_LABELS: Record<string, string> = {
  stripe: "Stripe (Visa/Mastercard/PayPal)",
  mpesa: "M-Pesa",
  paypal: "PayPal",
  bank_transfer: "Bank Transfer",
};

export default async function AdminPaymentsPage() {
  const payments = await getPayments();
  const succeeded = payments.filter((p) => p.status === "succeeded");
  const pending = payments.filter((p) => p.status === "pending");
  const refunded = payments.filter((p) => p.status === "refunded");
  const total = succeeded.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <PageHeader title="Payment Management" description="Records across every payment provider." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Collected" value={`$${total.toLocaleString()}`} accent />
        <StatCard label="Pending Payments" value={String(pending.length)} />
        <StatCard label="Refunds" value={String(refunded.length)} />
      </div>

      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Booking Ref</th>
              <th className="px-5 py-3">Provider</th>
              <th className="px-5 py-3">Provider Ref</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{p.bookingReference}</td>
                <td className="px-5 py-3 text-foreground/70">{PROVIDER_LABELS[p.provider]}</td>
                <td className="px-5 py-3 text-foreground/70">{p.providerReference}</td>
                <td className="px-5 py-3 text-foreground/70">{p.currency} {p.amount}</td>
                <td className="px-5 py-3"><Badge tone={paymentStatusTone(p.status)}>{p.status}</Badge></td>
                <td className="px-5 py-3 text-foreground/70">{p.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        These records mirror the `payments` table in `supabase/schema.sql`. Once Stripe,
        M-Pesa, and PayPal webhooks are wired up in Phase 4, each provider writes here
        automatically instead of through the mock data layer.
      </div>
    </div>
  );
}
