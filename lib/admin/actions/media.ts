"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function uploadMedia(formData: FormData): Promise<void> {
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const fileType = file.type === "application/pdf" ? "pdf" : file.type.startsWith("video/") ? "video" : "image";

  const { error: insertError } = await supabase.from("media").insert({
    file_url: publicUrl,
    file_type: fileType,
    alt_text: altText || file.name,
    tags,
    storage_path: path,
  });
  if (insertError) {
    // Roll back the upload so we don't leave an orphaned file if the DB
    // insert failed (e.g. RLS rejection, bad column).
    await supabase.storage.from("media").remove([path]);
    throw new Error(insertError.message);
  }

  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string, storagePath: string | null): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  if (storagePath) {
    const { error: storageError } = await supabase.storage.from("media").remove([storagePath]);
    if (storageError) throw new Error(storageError.message);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/media");
}
