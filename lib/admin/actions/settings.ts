"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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
  revalidatePath("/");
}

export async function updateSiteSettings(formData: FormData): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const now = new Date().toISOString();
  const rows = Array.from(formData.entries())
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(([key, value]) => ({ key, value: value.trim(), updated_at: now }));

  const { error } = await supabase.from("site_settings").upsert(rows);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
