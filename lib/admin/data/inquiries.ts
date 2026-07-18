import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedInquiries, type Inquiry, type InquirySource, type InquiryStatus } from "./inquiries.seed";

export type { Inquiry, InquirySource, InquiryStatus };

function mapRow(row: Record<string, any>): Inquiry {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    source: row.source,
    tourTitle: row.tour?.title,
    message: row.message ?? "",
    assignedStaff: row.assigned_staff_id, // NOTE: join to staff for a display name once that FK is added
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedInquiries;

  const { data, error } = await supabase
    .from("inquiries")
    .select("*, tour:tours(title)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[inquiries] Supabase query failed, using seed data:", error?.message);
    return seedInquiries;
  }

  return data.map(mapRow);
}
