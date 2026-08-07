"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export interface HeroSlideInput {
  mediaUrl: string;
  altText: string;
}

// Same delete-then-reinsert pattern as the related-content join tables
// (see lib/admin/actions/journeys.ts's syncJourneyRelations): slides carry
// no meaningful id in form state, ordered purely by array position.
export async function updateHeroSlides(slides: HeroSlideInput[]): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error: deleteError } = await supabase.from("hero_slides").delete().not("id", "is", null);
  if (deleteError) throw new Error(deleteError.message);

  const rows = slides
    .filter((s) => s.mediaUrl.trim())
    .map((s, index) => ({ media_url: s.mediaUrl.trim(), alt_text: s.altText.trim(), display_order: index }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("hero_slides").insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath("/admin/settings");
  revalidatePublicSite();
}
