import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import NotificationOpenLink from "@/components/admin/NotificationOpenLink";
import Pagination from "@/components/admin/Pagination";
import { getNotificationsPaginated, getUnreadNotificationCount } from "@/lib/admin/data/notifications";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/admin/actions/notifications";
import { ADMIN_LIST_PAGE_SIZE, parsePage, parseBoolean } from "@/lib/admin/list-query";
import { formatDateTime } from "@/lib/formatDate";

const TYPE_ICONS: Record<string, string> = {
  new_booking: "🧳",
  payment_confirmed: "💳",
  tour_reminder: "📅",
  follow_up: "💬",
  admin_alert: "⚠️",
};

const READ_FILTERS = [
  { value: undefined, label: "All" },
  { value: "false", label: "Unread" },
  { value: "true", label: "Read" },
] as const;

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePage(params);
  const isRead = parseBoolean(params, "read");

  const [{ items: notifications, total }, hasUnread] = await Promise.all([
    getNotificationsPaginated({ page, pageSize: ADMIN_LIST_PAGE_SIZE, isRead }),
    getUnreadNotificationCount().then((count) => count > 0),
  ]);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Booking alerts and follow-up reminders."
        action={
          hasUnread ? (
            <form action={markAllNotificationsRead}>
              <button type="submit" className="btn-outline text-sm">Mark all read</button>
            </form>
          ) : undefined
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {READ_FILTERS.map((f) => {
          const active = (isRead === undefined ? undefined : String(isRead)) === f.value;
          const href = f.value ? `/admin/notifications?read=${f.value}` : "/admin/notifications";
          return (
            <Link
              key={f.label}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`card flex items-start gap-3 p-4 ${!n.isRead ? "border-l-4 border-primary" : ""}`}
          >
            <span className="text-xl">{TYPE_ICONS[n.type]}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground">{n.message}</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-xs text-foreground/50">{formatDateTime(n.createdAt)}</p>
                {n.href && <NotificationOpenLink id={n.id} href={n.href} />}
              </div>
            </div>
            <form action={markNotificationRead.bind(null, n.id, !n.isRead)}>
              <button type="submit" className="text-xs font-medium text-primary hover:underline">
                {n.isRead ? "Mark unread" : "Mark read"}
              </button>
            </form>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-sm text-foreground/50">No notifications.</p>
        )}
      </div>

      <Pagination
        basePath="/admin/notifications"
        currentParams={{ read: isRead === undefined ? undefined : String(isRead) }}
        page={page}
        pageSize={ADMIN_LIST_PAGE_SIZE}
        total={total}
      />
    </div>
  );
}
