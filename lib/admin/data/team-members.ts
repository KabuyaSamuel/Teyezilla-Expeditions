import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface AdminTeamMember {
  id: string;
  fullName: string;
  roleTitle: string;
  bio: string;
  photo: string;
  displayOrder: number;
  status: string;
}

function mapRow(row: Tables<"team_members">): AdminTeamMember {
  return {
    id: row.id,
    fullName: row.full_name,
    roleTitle: row.role_title ?? "",
    bio: row.bio ?? "",
    photo: row.photo ?? "",
    displayOrder: Number(row.display_order ?? 0),
    status: row.status ?? "draft",
  };
}

export async function getAdminTeamMembers(): Promise<AdminTeamMember[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/team-members] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase.from("team_members").select("*").order("display_order");

  if (error || !data) {
    console.warn("[admin/team-members] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAdminTeamMemberById(id: string): Promise<AdminTeamMember | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/team-members] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/team-members] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
