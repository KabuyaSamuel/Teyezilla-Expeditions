"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function updateInquiryStatus(id: string, formData: FormData): Promise<void> {
  const status = String(formData.get("status") ?? "");
  if (!status) return;

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function assignInquiry(id: string, formData: FormData): Promise<void> {
  const staffId = String(formData.get("staffId") ?? "");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase
    .from("inquiries")
    .update({ assigned_staff_id: staffId || null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}

// Records the reply and advances the inquiry to "quoted" if it's still
// "new"/"in_progress"; no email/WhatsApp API is wired up yet (Phase 4), so
// this is the record of what was sent; the actual send happens via the
// mailto:/wa.me link the reply page opens alongside it.
export async function sendInquiryReply(id: string, currentStatus: string, formData: FormData): Promise<void> {
  const reply = String(formData.get("reply") ?? "").trim();
  if (!reply) throw new Error("Write a reply before sending.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const nextStatus = currentStatus === "new" || currentStatus === "in_progress" ? "quoted" : currentStatus;

  const { error } = await supabase
    .from("inquiries")
    .update({ staff_reply: reply, replied_at: new Date().toISOString(), status: nextStatus })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}
