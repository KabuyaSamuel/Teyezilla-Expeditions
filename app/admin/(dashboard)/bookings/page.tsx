import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getBookings } from "@/lib/admin/data/bookings";
import { bookingStatusTone, paymentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  return (
    <div>
      <PageHeader
        title="Booking Management"
        description="All bookings, payment status, and fulfillment status."
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Tour</th>
              <th className="px-5 py-3">Travel Date</th>
              <th className="px-5 py-3">Travelers</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{b.bookingReference}</td>
                <td className="px-5 py-3 text-foreground/70">{b.customerName}</td>
                <td className="px-5 py-3 text-foreground/70">{b.tourTitle}</td>
                <td className="px-5 py-3 text-foreground/70">{b.travelDate}</td>
                <td className="px-5 py-3 text-foreground/70">{b.travelerCount}</td>
                <td className="px-5 py-3"><Badge tone={paymentStatusTone(b.paymentStatus)}>{b.paymentStatus}</Badge></td>
                <td className="px-5 py-3"><Badge tone={bookingStatusTone(b.bookingStatus)}>{b.bookingStatus}</Badge></td>
                <td className="px-5 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="text-primary hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
