import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminAccommodation {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  tier: string;
  status: string;
  displayOrder: number;
}

function mapRow(row: Record<string, any>): AdminAccommodation {
  return {
    id: row.id,
    destinationId: row.destination_id,
    destinationName: row.destinations?.country_name ?? "-",
    name: row.name,
    slug: row.slug ?? "",
    description: row.description ?? "",
    heroImage: row.hero_image ?? "",
    tier: row.tier ?? "",
    status: row.status ?? "draft",
    displayOrder: Number(row.display_order ?? 0),
  };
}

const SELECT = `*, destinations(country_name)`;

export async function getAdminAccommodations(): Promise<AdminAccommodation[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/accommodations] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase.from("accommodations").select(SELECT).order("display_order");

  if (error || !data) {
    console.warn("[admin/accommodations] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAdminAccommodationById(id: string): Promise<AdminAccommodation | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/accommodations] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase.from("accommodations").select(SELECT).eq("id", id).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/accommodations] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
