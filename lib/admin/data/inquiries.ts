import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  getTripPlannerRequests,
  type TripPlannerRequest,
} from "@/lib/admin/data/trip-planner-requests";

export type InquirySource = "website" | "whatsapp" | "contact_form" | "ai_trip_planner";
export type InquiryStatus = "new" | "in_progress" | "quoted" | "converted" | "closed";

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  source: InquirySource;
  tourTitle?: string;
  message: string;
  assignedStaffId?: string;
  status: InquiryStatus;
  staffReply?: string;
  repliedAt?: string;
  createdAt: string;
  // Structured trip parameters for source = 'ai_trip_planner', joined from
  // trip_planner_requests (matched by customer email, most recent first).
  tripPlanner?: TripPlannerRequest;
}

// There is no FK between inquiries and trip_planner_requests, so trip-planner
// inquiries are matched to their request by customer email (newest request wins).
function attachTripPlanner(inquiry: Inquiry, requests: TripPlannerRequest[]): Inquiry {
  if (inquiry.source !== "ai_trip_planner") return inquiry;
  const match = requests.find(
    (r) => r.customerEmail.toLowerCase() === inquiry.customerEmail?.toLowerCase()
  );
  return match ? { ...inquiry, tripPlanner: match } : inquiry;
}

function mapRow(row: Record<string, any>): Inquiry {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone ?? "",
    source: row.source,
    tourTitle: row.tour?.title,
    message: row.message ?? "",
    // No formal FK to `staff` yet, so this can't be embedded via Postgrest —
    // resolve the display name by cross-referencing getStaffMembers() at the call site.
    assignedStaffId: row.assigned_staff_id ?? undefined,
    status: row.status,
    staffReply: row.staff_reply ?? undefined,
    repliedAt: row.replied_at ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[inquiries] Supabase not configured, returning no inquiries.");
    return [];
  }

  const [{ data, error }, tripPlannerRequests] = await Promise.all([
    supabase
      .from("inquiries")
      .select("*, tour:tours(title)")
      .order("created_at", { ascending: false }),
    getTripPlannerRequests(),
  ]);

  if (error || !data) {
    console.warn("[inquiries] Supabase query failed:", error?.message);
    return [];
  }

  return data.map((row) => attachTripPlanner(mapRow(row), tripPlannerRequests));
}

export async function getInquiryById(id: string): Promise<Inquiry | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[inquiries] Supabase not configured, returning no inquiry.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select("*, tour:tours(title)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[inquiries] Supabase query failed:", error.message);
    return undefined;
  }

  const inquiry = mapRow(data);
  if (inquiry.source !== "ai_trip_planner") return inquiry;
  return attachTripPlanner(inquiry, await getTripPlannerRequests());
}
