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
