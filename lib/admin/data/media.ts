import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface MediaItem {
  id: string;
  fileUrl: string;
  fileType: "image" | "video" | "pdf";
  altText: string;
  tags: string[];
  uploadedAt: string;
  storagePath: string | null;
}

function mapRow(row: Record<string, any>): MediaItem {
  return {
    id: row.id,
    fileUrl: row.file_url,
    fileType: row.file_type,
    altText: row.alt_text ?? "",
    tags: row.tags ?? [],
    uploadedAt: row.uploaded_at,
    storagePath: row.storage_path ?? null,
  };
}

export async function getMediaItems(): Promise<MediaItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[media] Supabase not configured, returning no media.");
    return [];
  }

  const { data, error } = await supabase.from("media").select("*").order("uploaded_at", { ascending: false });

  if (error || !data) {
    console.warn("[media] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}
