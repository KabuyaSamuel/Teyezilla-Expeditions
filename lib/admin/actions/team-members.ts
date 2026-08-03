"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export interface TeamMemberInput {
  fullName: string;
  roleTitle: string;
  bio: string;
  photo: string;
  status: string;
  displayOrder: number;
}

function toRow(input: TeamMemberInput) {
  return {
    full_name: input.fullName,
    role_title: input.roleTitle || null,
    bio: input.bio || null,
    photo: input.photo || null,
    status: input.status,
    display_order: input.displayOrder,
  };
}

export async function createTeamMember(input: TeamMemberInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("team_members").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/team-members");
  revalidatePublicSite();
  redirect("/admin/team-members");
}

export async function updateTeamMember(id: string, input: TeamMemberInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("team_members").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/team-members");
  revalidatePublicSite();
  redirect("/admin/team-members");
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/team-members");
  revalidatePublicSite();
  redirect("/admin/team-members");
}
