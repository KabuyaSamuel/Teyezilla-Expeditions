import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface InquiryReply {
  id: string;
  message: string;
  sentViaEmail: boolean;
  createdAt: string;
}

function mapRow(row: Tables<"inquiry_replies">): InquiryReply {
  return {
    id: row.id,
    message: row.message,
    sentViaEmail: Boolean(row.sent_via_email),
    createdAt: row.created_at ?? "",
  };
}

export async function getInquiryReplies(inquiryId: string): Promise<InquiryReply[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[inquiry-replies] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("inquiry_replies")
    .select("*")
    .eq("inquiry_id", inquiryId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.warn("[inquiry-replies] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}
