"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/server";
import type { AdminNotification } from "@/lib/admin/data/notifications";

// Shared insert point for every notification the admin dashboard shows, so
// the "which events create a notification" answer lives in one place instead
// of being scattered across every form action that might want to alert
// staff. Uses the service-role client directly rather than a new anon RLS
// policy: every caller of this function (public enquiry actions, admin
// status-change actions) already writes its own row via a service-role or
// staff-authenticated client, so no new public write surface is needed.
// Fails soft like the email layer -- a notification insert must never block
// or error the action that triggered it (an enquiry reaching the database,
// or a staff status update landing, is the critical path).
export async function createNotification(input: {
  type: AdminNotification["type"];
  message: string;
}): Promise<void> {
  try {
    const supabase = getSupabaseServiceClient();
    if (!supabase) return;
    const { error } = await supabase
      .from("notifications")
      .insert({ type: input.type, message: input.message, is_read: false });
    if (error) console.warn("[notifications] insert failed:", error.message);
  } catch (err) {
    console.warn("[notifications] insert threw:", err instanceof Error ? err.message : err);
  }
}

export async function markNotificationRead(id: string, isRead: boolean): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("notifications").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/notifications");
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/notifications");
}
