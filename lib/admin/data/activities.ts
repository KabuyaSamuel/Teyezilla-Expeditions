import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface AdminActivity {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
}

function mapRow(row: Tables<"activities">): AdminActivity {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    icon: row.icon ?? "",
    displayOrder: Number(row.display_order ?? 0),
  };
}

export async function getAdminActivities(): Promise<AdminActivity[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/activities] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase.from("activities").select("*").order("display_order");

  if (error || !data) {
    console.warn("[admin/activities] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAdminActivityBySlug(slug: string): Promise<AdminActivity | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/activities] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase.from("activities").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/activities] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
