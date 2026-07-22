import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminNotification {
  id: string;
  type: "new_booking" | "payment_confirmed" | "tour_reminder" | "follow_up" | "admin_alert";
  message: string;
  isRead: boolean;
  createdAt: string;
}

function mapRow(row: Record<string, any>): AdminNotification {
  return {
    id: row.id,
    type: row.type,
    message: row.message,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  };
}

export async function getNotifications(): Promise<AdminNotification[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[notifications] Supabase not configured, returning no notifications.");
    return [];
  }

  const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[notifications] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}
