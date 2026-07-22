import { getSupabasePublicClient } from "@/lib/supabase/public";

export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("[settings] Supabase not configured, returning no setting.");
    return null;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[settings] Supabase query failed:", error.message);
    return null;
  }

  return data.value;
}
