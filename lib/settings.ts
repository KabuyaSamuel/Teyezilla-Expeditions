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

// Merges saved site_settings values over a defaults object for a set of
// keys. A key with no saved row (null) falls back to its default, same as
// before. The difference from a plain `value || default` merge is that an
// explicitly-saved empty string is treated as "staff cleared this on
// purpose" and renders blank -- letting an admin remove a word entirely
// instead of being forced to type a placeholder character to survive a
// truthy check. Structural fields (image URLs, link hrefs) are excluded
// from that behavior since an empty src/href breaks rendering outright, so
// those keep falling back to their default even when saved as "".
export function resolveSiteText<T extends Record<string, string>>(
  defaults: T,
  keys: (keyof T)[],
  values: (string | null)[]
): T {
  return Object.fromEntries(
    keys.map((key, i) => {
      const isStructural = /image|href/i.test(String(key));
      const value = values[i];
      return [key, isStructural ? value || defaults[key] : value ?? defaults[key]];
    })
  ) as T;
}
