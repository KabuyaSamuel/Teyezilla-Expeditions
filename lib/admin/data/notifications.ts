export interface AdminNotification {
  id: string;
  type: "new_booking" | "payment_confirmed" | "tour_reminder" | "follow_up" | "admin_alert";
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notifications: AdminNotification[] = [
  { id: "n1", type: "new_booking", message: "New booking TZ-10234 for Pyramids of Giza Tour.", isRead: false, createdAt: "2026-07-17T09:20:00Z" },
  { id: "n2", type: "payment_confirmed", message: "Payment confirmed for TZ-10232 via M-Pesa.", isRead: false, createdAt: "2026-07-16T14:05:00Z" },
  { id: "n3", type: "follow_up", message: "Inquiry from Sofia Rossi needs a follow-up.", isRead: true, createdAt: "2026-07-15T11:40:00Z" },
  { id: "n4", type: "tour_reminder", message: "Maasai Mara Safari (TZ-10231) departs in 4 weeks — confirm guide assignment.", isRead: false, createdAt: "2026-07-14T08:00:00Z" },
];
