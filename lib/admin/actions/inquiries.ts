"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirectWithSaved } from "./saved-redirect";
import { sendCustomerConfirmation } from "@/lib/email";
import { staffReplyEmail } from "@/lib/email-templates";

// inquiry_replies cascades on delete (see 20260803030000_add_inquiry_replies.sql);
// notifications.related_id has no FK constraint, so a stale reference there
// is the only trace left behind, same as any other notification whose
// target was later deleted.
export async function deleteInquiry(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
  redirectWithSaved("/admin/inquiries", "Inquiry deleted.");
}

export interface InquiryActionResult {
  error?: string;
}

// Returns a result instead of throwing, same reasoning as
// sendInquiryReply below: a thrown Server Action error gets redacted to a
// generic message in production, and these two don't redirect (they're
// inline dropdowns on the same page), so the caller needs an actual result
// to show a toast for.
export async function updateInquiryStatus(id: string, formData: FormData): Promise<InquiryActionResult> {
  const status = String(formData.get("status") ?? "");
  if (!status) return {};

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured." };

  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  return {};
}

export async function assignInquiry(id: string, formData: FormData): Promise<InquiryActionResult> {
  const staffId = String(formData.get("staffId") ?? "");

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured." };

  const { error } = await supabase
    .from("inquiries")
    .update({ assigned_staff_id: staffId || null })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  return {};
}

export interface SendInquiryReplyResult {
  error?: string;
  success?: boolean;
  emailSent?: boolean;
  emailFailureReason?: string;
}

// Returns a result instead of throwing: a thrown Error's message gets
// redacted by Next.js in production ("An error occurred in the Server
// Components render...", digest only, no actual text) since a Server
// Action's rejection is treated the same as an unexpected crash -- there's
// no way for a caller to show a useful message from that. Records the
// reply as a new row in inquiry_replies (a thread, not a single
// overwritten field), sends it to the customer via Resend when configured,
// and advances the inquiry to "quoted" if it's still "new"/"in_progress".
export async function sendInquiryReply(id: string, currentStatus: string, formData: FormData): Promise<SendInquiryReplyResult> {
  const reply = String(formData.get("reply") ?? "").trim();
  if (!reply) return { error: "Write a reply before sending." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured." };

  const { data: inquiry, error: inquiryError } = await supabase
    .from("inquiries")
    .select("customer_name, customer_email")
    .eq("id", id)
    .maybeSingle();
  if (inquiryError || !inquiry) return { error: inquiryError?.message ?? "Inquiry not found." };

  const { sent, reason } = await sendCustomerConfirmation({
    to: inquiry.customer_email,
    subject: "A reply from Teyezilla Expeditions",
    html: staffReplyEmail({ customerName: inquiry.customer_name ?? "", message: reply }),
  });

  const { error: replyError } = await supabase
    .from("inquiry_replies")
    .insert({ inquiry_id: id, message: reply, sent_via_email: sent });
  if (replyError) return { error: replyError.message };

  const nextStatus = currentStatus === "new" || currentStatus === "in_progress" ? "quoted" : currentStatus;
  const { error } = await supabase
    .from("inquiries")
    .update({ staff_reply: reply, replied_at: new Date().toISOString(), status: nextStatus })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/bookings");

  return { success: true, emailSent: sent, emailFailureReason: sent ? undefined : reason };
}
