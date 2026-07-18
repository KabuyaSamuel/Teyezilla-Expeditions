import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedMediaItems, type MediaItem } from "./media.seed";

export type { MediaItem };

function mapRow(row: Record<string, any>): MediaItem {
  return {
    id: row.id,
    fileUrl: row.file_url,
    fileType: row.file_type,
    altText: row.alt_text ?? "",
    tags: row.tags ?? [],
    uploadedAt: row.uploaded_at,
  };
}

export async function getMediaItems(): Promise<MediaItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedMediaItems;

  const { data, error } = await supabase.from("media").select("*").order("uploaded_at", { ascending: false });

  if (error || !data) {
    console.warn("[media] Supabase query failed, using seed data:", error?.message);
    return seedMediaItems;
  }

  return data.map(mapRow);
}
