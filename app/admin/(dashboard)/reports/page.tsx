import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { getBookings } from "@/lib/admin/data/bookings";
import { getDestinations } from "@/lib/destinations";
import { getTours } from "@/lib/tours";

export default async function AdminReportsPage() {
  const [destinations, tours, bookings] = await Promise.all([
    getDestinations(),
    getTours(),
    getBookings(),
  ]);
  // Revenue is staff-entered: bookings marked paid, using the quoted total.
  const revenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + b.totalAmount, 0);
  const conversion = bookings.length
    ? Math.round(
        (bookings.filter((b) => ["confirmed", "completed"].includes(b.bookingStatus)).length /
          bookings.length) *
          100
      )
    : 0;

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
        <StatCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} accent sublabel="bookings marked paid" />
        <StatCard label="Conversion Rate" value={`${conversion}%`} sublabel="enquiries confirmed or completed" />
        <StatCard label="Most Viewed Tour" value="Maasai Mara Safari" sublabel="requires GA4 (later phase)" />
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
        up in a later phase. Revenue and sales-by-destination above are computed from
        bookings staff have quoted and marked as paid.
      </div>
    </div>
  );
}
