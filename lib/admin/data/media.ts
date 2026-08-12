import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export interface MediaItem {
  id: string;
  fileUrl: string;
  fileType: "image" | "video" | "pdf";
  altText: string;
  tags: string[];
  uploadedAt: string;
  storagePath: string | null;
}

function mapRow(row: Tables<"media">): MediaItem {
  return {
    id: row.id,
    fileUrl: row.file_url,
    fileType: row.file_type as MediaItem["fileType"],
    altText: row.alt_text ?? "",
    tags: row.tags ?? [],
    uploadedAt: row.uploaded_at ?? "",
    storagePath: row.storage_path ?? null,
  };
}

export async function getMediaItemsPaginated(query: {
  page: number;
  pageSize: number;
  fileType?: MediaItem["fileType"];
}): Promise<{ items: MediaItem[]; total: number }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[media] Supabase not configured, returning no media.");
    return { items: [], total: 0 };
  }

  let q = supabase.from("media").select("*", { count: "exact" }).order("uploaded_at", { ascending: false });
  if (query.fileType) q = q.eq("file_type", query.fileType);

  const from = (query.page - 1) * query.pageSize;
  const { data, error, count } = await q.range(from, from + query.pageSize - 1);

  if (error || !data) {
    console.warn("[media] Supabase query failed:", error?.message);
    return { items: [], total: 0 };
  }

  return { items: data.map(mapRow), total: count ?? 0 };
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
