import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface AdminFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  status: string;
}

function mapRow(row: Tables<"faqs">): AdminFaq {
  return {
    id: row.id,
    category: row.category,
    question: row.question,
    answer: row.answer,
    displayOrder: Number(row.display_order ?? 0),
    status: row.status ?? "draft",
  };
}

export async function getAdminFaqs(): Promise<AdminFaq[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/faqs] Supabase not configured, returning none.");
    return [];
  }

  const { data, error } = await supabase.from("faqs").select("*").order("category").order("display_order");

  if (error || !data) {
    console.warn("[admin/faqs] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getAdminFaqById(id: string): Promise<AdminFaq | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/faqs] Supabase not configured, returning none.");
    return undefined;
  }

  const { data, error } = await supabase.from("faqs").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/faqs] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
