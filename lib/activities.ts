import { getSupabasePublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

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

  return (data as Pick<Tables<"activities">, "id" | "name" | "slug" | "description" | "icon">[]).map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    description: a.description ?? "",
    icon: a.icon ?? "",
  }));
}
