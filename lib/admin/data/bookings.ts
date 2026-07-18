export type PaymentStatus = "pending" | "partial" | "paid" | "refunded";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  tourSlug: string;
  tourTitle: string;
  travelDate: string;
  travelerCount: number;
  totalAmount: number;
  depositAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
}

export const bookings: Booking[] = [
  { id: "b1", bookingReference: "TZ-10231", customerId: "c1", customerName: "Amara Okafor", tourSlug: "maasai-mara-safari", tourTitle: "Maasai Mara Safari", travelDate: "2026-08-14", travelerCount: 2, totalAmount: 1900, depositAmount: 500, currency: "USD", paymentStatus: "partial", bookingStatus: "confirmed", createdAt: "2026-06-02" },
  { id: "b2", bookingReference: "TZ-10232", customerId: "c2", customerName: "Daniel Kessler", tourSlug: "serengeti-safari", tourTitle: "Serengeti Safari", travelDate: "2026-09-02", travelerCount: 1, totalAmount: 1200, depositAmount: 1200, currency: "USD", paymentStatus: "paid", bookingStatus: "confirmed", createdAt: "2026-06-15" },
  { id: "b3", bookingReference: "TZ-10233", customerId: "c3", customerName: "Priya Sharma", tourSlug: "marrakech-sahara-desert", tourTitle: "Marrakech & Sahara Desert", travelDate: "2026-10-05", travelerCount: 6, totalAmount: 3660, depositAmount: 900, currency: "USD", paymentStatus: "partial", bookingStatus: "pending", createdAt: "2026-07-01" },
  { id: "b4", bookingReference: "TZ-10234", customerId: "c4", customerName: "Michael Thompson", tourSlug: "pyramids-of-giza-tour", tourTitle: "Pyramids of Giza Tour", travelDate: "2026-07-28", travelerCount: 2, totalAmount: 1040, depositAmount: 0, currency: "USD", paymentStatus: "pending", bookingStatus: "pending", createdAt: "2026-07-10" },
  { id: "b5", bookingReference: "TZ-10235", customerId: "c5", customerName: "Fatima Al-Sayed", tourSlug: "zanzibar-beach-escape", tourTitle: "Zanzibar Beach Escape", travelDate: "2026-06-20", travelerCount: 2, totalAmount: 1560, depositAmount: 1560, currency: "USD", paymentStatus: "paid", bookingStatus: "completed", createdAt: "2026-05-01" },
  { id: "b6", bookingReference: "TZ-10236", customerId: "c1", customerName: "Amara Okafor", tourSlug: "nairobi-street-food-tour", tourTitle: "Nairobi Street Food Tour", travelDate: "2026-08-15", travelerCount: 2, totalAmount: 130, depositAmount: 0, currency: "USD", paymentStatus: "pending", bookingStatus: "cancelled", createdAt: "2026-06-03" },
];

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}
