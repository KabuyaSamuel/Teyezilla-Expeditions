"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function updateSiteSetting(formData: FormData): Promise<void> {
  const key = formData.get("key");
  const value = formData.get("value");

  if (typeof key !== "string" || typeof value !== "string" || !key) {
    throw new Error("Missing setting key or value.");
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePublicSite();
}

export async function updateSiteSettings(formData: FormData): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const now = new Date().toISOString();
  const rows = Array.from(formData.entries())
    // Next.js injects its own "$ACTION_ID_..." field into every Server
    // Action form submission for dispatch -- without this filter it gets
    // saved as a bogus site_settings row alongside the real fields.
    .filter((entry): entry is [string, string] => typeof entry[1] === "string" && !entry[0].startsWith("$"))
    .map(([key, value]) => ({ key, value: value.trim(), updated_at: now }));

  const { error } = await supabase.from("site_settings").upsert(rows);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePublicSite();
}
