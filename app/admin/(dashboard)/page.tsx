import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Badge from "@/components/admin/Badge";
import Link from "next/link";
import { getBookings } from "@/lib/admin/data/bookings";
import { getInquiries } from "@/lib/admin/data/inquiries";
import { getDestinations } from "@/lib/destinations";
import { bookingStatusTone } from "@/lib/admin/status-tone";

export default async function AdminDashboardPage() {
  const [destinations, bookings, inquiries] = await Promise.all([
    getDestinations(),
    getBookings(),
    getInquiries(),
  ]);
  const totalBookings = bookings.length;
  // Revenue is staff-entered: bookings marked paid, using the quoted total.
  const revenueTotal = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const newEnquiries =
    bookings.filter((b) => b.bookingStatus === "inquiry").length +
    inquiries.filter((i) => i.status === "new").length;

  const now = new Date("2026-07-18");
  const upcomingTours = bookings
    .filter((b) => b.travelDate && new Date(b.travelDate) >= now && b.bookingStatus !== "cancelled")
    .sort((a, b) => new Date(a.travelDate!).getTime() - new Date(b.travelDate!).getTime());

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const destinationCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    const dest = destinations.find((d) =>
      b.tourSlug.includes(d.slug.split("-")[0])
    );
    const key = dest?.countryName ?? "Other";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const popularDestinations = Object.entries(destinationCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of bookings, revenue, and activity across Teyezilla Expeditions."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New Enquiries" value={String(newEnquiries)} accent sublabel="awaiting first response" />
        <StatCard label="Total Bookings" value={String(totalBookings)} sublabel="all time" />
        <StatCard label="Revenue (recorded)" value={`$${revenueTotal.toLocaleString()}`} sublabel="bookings marked paid" />
        <StatCard label="Upcoming Tours" value={String(upcomingTours.length)} sublabel="with a set travel date" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Booking Calendar</h2>
          <p className="mt-1 text-xs text-foreground/50">Upcoming departures, soonest first</p>
          <div className="mt-4 space-y-3">
            {upcomingTours.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.productTitle}</p>
                  <p className="text-xs text-foreground/60">{b.bookingReference} · {b.customerName} · {b.travelerCount} traveler(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{b.travelDate}</p>
                  <Badge tone={bookingStatusTone(b.bookingStatus)}>{b.bookingStatus}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/bookings" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            View all bookings →
          </Link>
        </div>

        <div className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Popular Destinations</h2>
          <div className="mt-4 space-y-3">
            {popularDestinations.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="text-foreground/80">{name}</span>
                <span className="font-semibold text-primary">{count} booking(s)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Recent Inquiries</h2>
        <div className="mt-4 space-y-3">
          {recentInquiries.map((inq) => (
            <div key={inq.id} className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{inq.customerName}</p>
                <p className="text-xs text-foreground/60">{inq.message}</p>
              </div>
              <Badge tone="info">{inq.source.replace("_", " ")}</Badge>
            </div>
          ))}
        </div>
        <Link href="/admin/inquiries" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          View all inquiries →
        </Link>
      </div>

      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        Visitor stats require Google Analytics 4 (wired up in a later phase). Bookings,
        revenue, and inquiries above reflect live Supabase data; revenue is the total of
        bookings staff have marked as paid.
      </div>
    </div>
  );
}
