import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapTripPlannerRequestRow,
  type TripPlannerRequest,
} from "@/lib/admin/data/trip-planner-requests";
import type { Tables } from "@/types/database";

// supabase-js can't tell tour_id/journey_id/trip_planner_request_id are
// to-one FKs without a Database-parameterized client (deliberately not
// used here, see lib/supabase/server.ts), so cast to the real single-object
// runtime shape rather than the array it would otherwise infer.
type InquiryRow = Tables<"inquiries"> & {
  tour: Pick<Tables<"tours">, "title"> | null;
  journey: Pick<Tables<"journeys">, "title"> | null;
  tripPlannerRequest: Tables<"trip_planner_requests"> | null;
};

export type InquirySource = "website" | "whatsapp" | "contact_form" | "ai_trip_planner";
export type InquiryStatus = "new" | "in_progress" | "quoted" | "converted" | "closed";

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  source: InquirySource;
  tourTitle?: string;
  journeyTitle?: string;
  message: string;
  assignedStaffId?: string;
  status: InquiryStatus;
  staffReply?: string;
  repliedAt?: string;
  createdAt: string;
  /** Set when this inquiry was mirrored from a booking enquiry (app/booking/actions.ts). */
  bookingId?: string;
  // Structured trip parameters for source = 'ai_trip_planner', joined via
  // inquiries.trip_planner_request_id (set once, at insert time -- see
  // app/(public)/trip-planner/actions.ts).
  tripPlanner?: TripPlannerRequest;
}

function mapRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    customerName: row.customer_name ?? "",
    customerEmail: row.customer_email ?? "",
    customerPhone: row.customer_phone ?? "",
    source: row.source as InquirySource,
    tourTitle: row.tour?.title,
    journeyTitle: row.journey?.title,
    message: row.message ?? "",
    // No formal FK to `staff` yet, so this can't be embedded via Postgrest;
    // resolve the display name by cross-referencing getStaffMembers() at the call site.
    assignedStaffId: row.assigned_staff_id ?? undefined,
    status: row.status as InquiryStatus,
    staffReply: row.staff_reply ?? undefined,
    repliedAt: row.replied_at ?? undefined,
    createdAt: row.created_at ?? "",
    bookingId: row.booking_id ?? undefined,
    tripPlanner: row.tripPlannerRequest ? mapTripPlannerRequestRow(row.tripPlannerRequest) : undefined,
  };
}

const INQUIRY_SELECT = "*, tour:tours(title), journey:journeys(title), tripPlannerRequest:trip_planner_requests(*)";

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[inquiries] Supabase not configured, returning no inquiries.");
    return [];
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select(INQUIRY_SELECT)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[inquiries] Supabase query failed:", error?.message);
    return [];
  }

  return (data as unknown as InquiryRow[]).map(mapRow);
}

export async function getInquiryById(id: string): Promise<Inquiry | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[inquiries] Supabase not configured, returning no inquiry.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select(INQUIRY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[inquiries] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data as unknown as InquiryRow);
}

export async function getInquiryByBookingId(bookingId: string): Promise<Inquiry | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("inquiries")
    .select("*, tour:tours(title), journey:journeys(title)")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[inquiries] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data as unknown as InquiryRow);
}
