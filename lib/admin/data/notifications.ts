import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface AdminNotification {
  id: string;
  type: "new_booking" | "payment_confirmed" | "tour_reminder" | "follow_up" | "admin_alert";
  message: string;
  isRead: boolean;
  createdAt: string;
  /** Where "Open" should navigate, when this notification is about a specific booking/inquiry. */
  href?: string;
}

function hrefFor(relatedType: string | null, relatedId: string | null): string | undefined {
  if (!relatedType || !relatedId) return undefined;
  if (relatedType === "booking") return `/admin/bookings/${relatedId}`;
  if (relatedType === "inquiry") return `/admin/inquiries/${relatedId}`;
  return undefined;
}

function mapRow(row: Tables<"notifications">): AdminNotification {
  return {
    id: row.id,
    type: row.type as AdminNotification["type"],
    message: row.message,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at ?? "",
    href: hrefFor(row.related_type, row.related_id),
  };
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) {
    console.warn("[notifications] unread count query failed:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getNotificationsPaginated(query: {
  page: number;
  pageSize: number;
  isRead?: boolean;
}): Promise<{ items: AdminNotification[]; total: number }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[notifications] Supabase not configured, returning no notifications.");
    return { items: [], total: 0 };
  }

  let q = supabase.from("notifications").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (query.isRead !== undefined) q = q.eq("is_read", query.isRead);

  const from = (query.page - 1) * query.pageSize;
  const { data, error, count } = await q.range(from, from + query.pageSize - 1);

  if (error || !data) {
    console.warn("[notifications] Supabase query failed:", error?.message);
    return { items: [], total: 0 };
  }

  return { items: data.map(mapRow), total: count ?? 0 };
}
