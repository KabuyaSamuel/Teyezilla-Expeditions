"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { StatusCategory, StatusTone } from "@/lib/admin/data/status-options";

const TONES: StatusTone[] = ["success", "error", "pending", "info", "neutral"];

function slugifyKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function revalidate() {
  revalidatePath("/admin/statuses");
  revalidatePath("/admin/bookings");
}

export async function createStatusOption(
  category: StatusCategory,
  label: string,
  tone: StatusTone
): Promise<void> {
  const trimmedLabel = label.trim();
  if (!trimmedLabel) throw new Error("Enter a label for the status.");
  const key = slugifyKey(trimmedLabel);
  if (!key) throw new Error("That label doesn't produce a usable status key.");
  if (!TONES.includes(tone)) throw new Error("Invalid tone.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data: existing } = await supabase
    .from("status_options")
    .select("display_order")
    .eq("category", category)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (existing?.display_order ?? -1) + 1;

  const { error } = await supabase
    .from("status_options")
    .insert({ category, key, label: trimmedLabel, tone, display_order: nextOrder });

  if (error) {
    if (error.code === "23505") throw new Error(`A status with the key "${key}" already exists in this list.`);
    throw new Error(error.message);
  }

  revalidate();
}

export async function updateStatusOption(
  id: string,
  updates: { label?: string; tone?: StatusTone }
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const patch: Record<string, string> = {};
  if (updates.label !== undefined) {
    const trimmedLabel = updates.label.trim();
    if (!trimmedLabel) throw new Error("Label can't be empty.");
    patch.label = trimmedLabel;
  }
  if (updates.tone !== undefined) {
    if (!TONES.includes(updates.tone)) throw new Error("Invalid tone.");
    patch.tone = updates.tone;
  }
  if (Object.keys(patch).length === 0) return;

  const { error } = await supabase.from("status_options").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  revalidate();
}

export async function reorderStatusOptions(category: StatusCategory, orderedIds: string[]): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("status_options")
      .update({ display_order: i })
      .eq("id", orderedIds[i])
      .eq("category", category);
    if (error) throw new Error(error.message);
  }

  revalidate();
}

export async function deleteStatusOption(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data: option, error: fetchError } = await supabase
    .from("status_options")
    .select("category, key, label")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);
  if (!option) throw new Error("Status option not found.");

  const column = option.category === "booking_status" ? "booking_status" : "payment_status";
  const { count, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq(column, option.key);
  if (countError) throw new Error(countError.message);

  if (count && count > 0) {
    throw new Error(
      `"${option.label}" is still used by ${count} booking${count === 1 ? "" : "s"} — reassign them first.`
    );
  }

  const { error } = await supabase.from("status_options").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidate();
}
