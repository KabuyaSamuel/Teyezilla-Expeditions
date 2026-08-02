import { getSupabasePublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

export interface SafariTheme {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export async function getSafariThemes(): Promise<SafariTheme[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[safari] Supabase not configured, returning no themes.");
    return [];
  }

  const { data, error } = await supabase
    .from("safari_themes")
    .select("id, name, slug, description")
    .order("display_order");

  if (error || !data) {
    console.warn("[safari] Supabase query failed:", error?.message);
    return [];
  }

  return (data as Pick<Tables<"safari_themes">, "id" | "name" | "slug" | "description">[]).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description ?? "",
  }));
}

export async function getSafariGuideFaqs(): Promise<Faq[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[safari] Supabase not configured, returning no FAQs.");
    return [];
  }

  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer")
    .eq("category", "safari-guide")
    .order("display_order");

  if (error || !data) {
    console.warn("[safari] Supabase query failed:", error?.message);
    return [];
  }

  return data;
}
