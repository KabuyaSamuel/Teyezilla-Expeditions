import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminExperienceTypeListItem {
  id: string;
  slug: string;
  name: string;
  tourCount: number;
  journeyCount: number;
}

export interface AdminExperienceTypeDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
}

const LIST_SELECT = `
  id, slug, name,
  tour_experience_types(tour_id),
  journey_experience_types(journey_id)
`;

interface ExperienceTypeListRow {
  id: string;
  slug: string;
  name: string;
  tour_experience_types: { tour_id: string }[] | null;
  journey_experience_types: { journey_id: string }[] | null;
}

export async function getAdminExperienceTypes(): Promise<AdminExperienceTypeListItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/experience-types] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase
    .from("experience_types")
    .select(LIST_SELECT)
    .order("display_order");

  if (error || !data) {
    console.warn("[admin/experience-types] Supabase query failed:", error?.message);
    return [];
  }

  return (data as ExperienceTypeListRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    tourCount: (row.tour_experience_types ?? []).length,
    journeyCount: (row.journey_experience_types ?? []).length,
  }));
}

export async function getAdminExperienceTypeBySlug(slug: string): Promise<AdminExperienceTypeDetail | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/experience-types] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("experience_types")
    .select("id, slug, name, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/experience-types] Supabase query failed:", error.message);
    return undefined;
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description ?? "",
  };
}
