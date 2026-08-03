import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import BookingActions from "@/components/admin/BookingActions";
import InquiryReplyForm from "@/components/admin/InquiryReplyForm";
import GuestRoster from "@/components/admin/GuestRoster";
import { getBookingById } from "@/lib/admin/data/bookings";
import { getCustomerById } from "@/lib/admin/data/customers";
import { getInquiryByBookingId } from "@/lib/admin/data/inquiries";
import { getInquiryReplies } from "@/lib/admin/data/inquiry-replies";
import { getBookingGuests } from "@/lib/admin/data/booking-guests";
import { addBookingGuest, removeBookingGuest } from "@/lib/admin/actions/booking-guests";
import { getStatusOptions } from "@/lib/admin/data/status-options";
import { getLoyaltyAccrualRate } from "@/lib/admin/actions/loyalty";
import { getAdminSession } from "@/lib/admin/session";
import { bookingStatusTone, paymentStatusTone, inquiryStatusTone } from "@/lib/admin/status-tone";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const customer = booking.customerId ? await getCustomerById(booking.customerId) : undefined;
  const [bookingStatusOptions, paymentStatusOptions, loyaltyAccrualRate, session, linkedInquiry, guests] = await Promise.all([
    getStatusOptions("booking_status"),
    getStatusOptions("payment_status"),
    getLoyaltyAccrualRate(),
    getAdminSession(),
    getInquiryByBookingId(id),
    getBookingGuests(id),
  ]);
  const linkedInquiryReplies = linkedInquiry ? await getInquiryReplies(linkedInquiry.id) : [];
  // Loyalty redemption is a write to a customer's point balance; restrict it
  // to the roles the loyalty programme is scoped to (see permissions.ts).
  const canRedeemLoyalty = session?.role === "admin" || session?.role === "manager";
  const bookingTone =
    bookingStatusOptions.find((o) => o.key === booking.bookingStatus)?.tone ?? bookingStatusTone(booking.bookingStatus);
  const paymentTone =
    paymentStatusOptions.find((o) => o.key === booking.paymentStatus)?.tone ?? paymentStatusTone(booking.paymentStatus);
  const travelDateLabel = booking.travelDate
    ? `${booking.travelDate}${booking.flexibleDates ? " (flexible)" : ""}`
    : "Flexible";
  const travelersLabel =
    booking.adults != null
      ? `${booking.adults} adult(s)${booking.children > 0 ? `, ${booking.children} child(ren)` : ""}`
      : String(booking.travelerCount);

  return (
    <div>
      <PageHeader
        title={booking.bookingReference}
        description={`${booking.productTitle} · ${travelDateLabel}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Enquiry Details</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-foreground/50">Customer</dt><dd className="font-medium text-foreground">{booking.customerName}</dd></div>
            <div><dt className="text-foreground/50">{booking.journeyTitle ? "Journey" : "Tour"}</dt><dd className="font-medium text-foreground">{booking.productTitle}</dd></div>
            <div><dt className="text-foreground/50">Travel Date</dt><dd className="font-medium text-foreground">{travelDateLabel}</dd></div>
            <div><dt className="text-foreground/50">Travelers</dt><dd className="font-medium text-foreground">{travelersLabel}</dd></div>
            {booking.children > 0 && (
              <div><dt className="text-foreground/50">Children's Ages</dt><dd className="font-medium text-foreground">{booking.childrenAges || "Not given"}</dd></div>
            )}
            <div><dt className="text-foreground/50">Country of Residence</dt><dd className="font-medium text-foreground">{booking.countryOfResidence || "-"}</dd></div>
            <div><dt className="text-foreground/50">Budget Range (per person)</dt><dd className="font-medium text-foreground">{booking.budgetRange || "Not specified"}</dd></div>
            <div><dt className="text-foreground/50">Heard About Us Via</dt><dd className="font-medium text-foreground">{booking.referralSource || "-"}</dd></div>
            <div><dt className="text-foreground/50">Quoted / Total Amount</dt><dd className="font-medium text-foreground">{booking.totalAmount > 0 ? `${booking.currency} ${booking.totalAmount.toLocaleString()}` : "Not quoted yet"}</dd></div>
            <div><dt className="text-foreground/50">Payment (manual record)</dt><dd><Badge tone={paymentTone}>{booking.paymentStatus.replace("_", " ")}</Badge></dd></div>
            <div><dt className="text-foreground/50">Booking Status</dt><dd><Badge tone={bookingTone}>{booking.bookingStatus}</Badge></dd></div>
          </dl>

          {(booking.basePrice > 0 || booking.addons.length > 0) && (
            <div className="mt-6 rounded-2xl border border-secondary/20 bg-secondary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                Requested at Enquiry Time
              </p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-foreground/60">Base price</dt><dd className="font-medium text-foreground">{booking.currency} {booking.basePrice.toLocaleString()}</dd></div>
                {booking.addons.map((a, i) => (
                  <div key={i} className="flex justify-between"><dt className="text-foreground/60">+ {a.title}</dt><dd className="font-medium text-foreground">{a.currency} {a.price.toLocaleString()}</dd></div>
                ))}
                <div className="flex justify-between border-t border-secondary/20 pt-1"><dt className="font-medium text-foreground">Requested total</dt><dd className="font-heading font-bold text-accent">{booking.currency} {(booking.basePrice + booking.addonsTotal).toLocaleString()}</dd></div>
              </dl>
            </div>
          )}

          {booking.specialRequests && (
            <>
              <h2 className="mt-8 font-heading text-lg font-semibold text-foreground">Special Requests</h2>
              <p className="mt-3 whitespace-pre-line rounded-2xl bg-secondary/10 p-4 text-sm text-foreground/80">
                {booking.specialRequests}
              </p>
            </>
          )}

          {linkedInquiry && (
            <>
              <div className="mt-8 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-foreground">Linked Inquiry</h2>
                <Link href={`/admin/inquiries/${linkedInquiry.id}`} className="text-xs font-medium text-primary hover:underline">
                  Open full inquiry →
                </Link>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge tone={inquiryStatusTone(linkedInquiry.status)}>{linkedInquiry.status.replace("_", " ")}</Badge>
                <span className="text-xs text-foreground/50">{linkedInquiry.createdAt}</span>
              </div>
              <div className="mt-3">
                <InquiryReplyForm
                  id={linkedInquiry.id}
                  status={linkedInquiry.status}
                  replies={linkedInquiryReplies}
                  customerEmail={linkedInquiry.customerEmail}
                  customerPhone={linkedInquiry.customerPhone}
                  source={linkedInquiry.source}
                />
              </div>
            </>
          )}

          <div className="mt-8">
            <GuestRoster
              guests={guests}
              onAdd={addBookingGuest.bind(null, booking.id)}
              onRemove={removeBookingGuest.bind(null, booking.id)}
            />
          </div>

          <div className="mt-8">
            <BookingActions
              id={booking.id}
              bookingReference={booking.bookingReference}
              bookingStatus={booking.bookingStatus}
              paymentStatus={booking.paymentStatus}
              currency={booking.currency}
              requestedTotal={booking.basePrice + booking.addonsTotal}
              bookingStatusOptions={bookingStatusOptions}
              paymentStatusOptions={paymentStatusOptions}
              customerLoyaltyBalance={customer?.loyaltyPoints}
              loyaltyAccrualRate={loyaltyAccrualRate}
              canRedeemLoyalty={canRedeemLoyalty}
            />
          </div>
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Customer</h2>
          {customer ? (
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-medium text-foreground">{customer.fullName}</p>
              <p className="text-foreground/70">{customer.email}</p>
              <p className="text-foreground/70">{customer.phone}</p>
              <p className="text-foreground/70">{customer.nationality}</p>
              <a href={`/admin/customers/${customer.id}`} className="mt-2 inline-block text-primary hover:underline">
                View full profile →
              </a>
            </div>
          ) : (
            <p className="mt-3 text-sm text-foreground/50">Customer record not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
