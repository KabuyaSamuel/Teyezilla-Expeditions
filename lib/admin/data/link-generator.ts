import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface TrackedLinkListItem {
  id: string;
  slug: string;
  label: string | null;
  destinationPath: string;
  utmSource: string;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
  clickCount: number;
}

// link_clicks(count) is a PostgREST embedded aggregate over the
// tracked_links -> link_clicks foreign key -- one query gets every link's
// click count instead of N+1 separate counts.
const LIST_SELECT = "id, slug, label, destination_path, utm_source, utm_medium, utm_campaign, created_at, link_clicks(count)";

interface TrackedLinkRow {
  id: string;
  slug: string;
  label: string | null;
  destination_path: string;
  utm_source: string;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  link_clicks: { count: number }[] | null;
}

export async function getTrackedLinks(): Promise<TrackedLinkListItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/link-generator] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase.from("tracked_links").select(LIST_SELECT).order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[admin/link-generator] Supabase query failed:", error?.message);
    return [];
  }

  return (data as TrackedLinkRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    label: row.label,
    destinationPath: row.destination_path,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    createdAt: row.created_at,
    clickCount: row.link_clicks?.[0]?.count ?? 0,
  }));
}
