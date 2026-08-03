"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export interface FaqInput {
  category: string;
  question: string;
  answer: string;
  status: string;
  displayOrder: number;
}

function toRow(input: FaqInput) {
  return {
    category: input.category || "safari-guide",
    question: input.question,
    answer: input.answer,
    status: input.status,
    display_order: input.displayOrder,
  };
}

export async function createFaq(input: FaqInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("faqs").insert(toRow(input));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/faqs");
  revalidatePublicSite();
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, input: FaqInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("faqs").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/faqs");
  revalidatePublicSite();
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/faqs");
  revalidatePublicSite();
  redirect("/admin/faqs");
}
