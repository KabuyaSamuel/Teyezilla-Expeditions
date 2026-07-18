import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { getBookings } from "@/lib/admin/data/bookings";
import { getPayments } from "@/lib/admin/data/payments";
import { getDestinations } from "@/lib/destinations";
import { getTours } from "@/lib/tours";

export default async function AdminReportsPage() {
  const [destinations, tours, bookings, payments] = await Promise.all([
    getDestinations(),
    getTours(),
    getBookings(),
    getPayments(),
  ]);
  const revenue = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amount, 0);
  const conversion = Math.round(
    (bookings.filter((b) => b.bookingStatus !== "cancelled").length / bookings.length) * 100
  );

  const salesByDestination = destinations
    .map((d) => {
      const destTours = tours.filter((t) => t.destinationId === d.id).map((t) => t.slug);
      const revenueForDest = bookings
        .filter((b) => destTours.includes(b.tourSlug))
        .reduce((s, b) => s + b.totalAmount, 0);
      return { name: d.countryName, revenue: revenueForDest };
    })
    .filter((d) => d.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);

  const maxRevenue = Math.max(...salesByDestination.map((d) => d.revenue), 1);

  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Revenue, bookings, and conversion across the platform." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} accent />
        <StatCard label="Conversion Rate" value={`${conversion}%`} sublabel="bookings not cancelled" />
        <StatCard label="Most Viewed Tour" value="Maasai Mara Safari" sublabel="requires GA4 (Phase 4)" />
      </div>

      <div className="mt-6 card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Sales by Destination</h2>
        <div className="mt-4 space-y-3">
          {salesByDestination.map((d) => (
            <div key={d.name}>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/80">{d.name}</span>
                <span className="font-medium text-foreground">${d.revenue.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-secondary/20">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        Customer demographics and most-viewed tours require Google Analytics 4, wired
        up in Phase 4. Revenue and sales-by-destination above are computed from the
        mock booking/payment data and will reflect real numbers once Supabase is connected.
      </div>
    </div>
  );
}
