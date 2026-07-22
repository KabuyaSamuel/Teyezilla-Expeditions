"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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
