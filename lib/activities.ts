import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export async function getActivities(): Promise<Activity[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[activities] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("activities")
    .select("id, name, slug, description, icon")
    .order("display_order");

  if (error || !data) {
    console.warn("[activities] Supabase query failed:", error?.message);
    return [];
  }

  return data.map((a: any) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    description: a.description ?? "",
    icon: a.icon ?? "",
  }));
}
