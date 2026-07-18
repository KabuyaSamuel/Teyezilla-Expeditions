import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedNotifications, type AdminNotification } from "./notifications.seed";

export type { AdminNotification };

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
  if (!supabase) return seedNotifications;

  const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[notifications] Supabase query failed, using seed data:", error?.message);
    return seedNotifications;
  }

  return data.map(mapRow);
}
