"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/lib/admin/actions/media";
import { maxBytesForFile, formatMB } from "@/lib/mediaLimits";
import { useToast } from "./Toast";

// Drops a compact "upload straight from here" form into a media picker
// modal, so setting e.g. a destination's hero image doesn't require a
// side trip to open /admin/media, upload there, then come back and browse
// for the file just uploaded. Uploads through the same uploadMedia action
// the Media Library page itself uses, so the file lands in the library too.
export default function InlineMediaUpload({
  accept,
  onUploaded,
}: {
  accept: string;
  onUploaded: (fileUrl: string) => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const acceptsVideo = accept.includes("video/");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return;

    const maxBytes = maxBytesForFile(file);
    if (file.size > maxBytes) {
      const kind = file.type.startsWith("video/") ? "Videos" : "This file type";
      toast.error(`${kind} must be ${formatMB(maxBytes)} or smaller (this file is ${formatMB(file.size)}).`);
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadMedia(formData);
      toast.success(`"${file.name}" uploaded.`);
      onUploaded(uploaded.fileUrl);
      formRef.current?.reset();
      // Refreshes this page's server data so the new file also shows up in
      // the picker's own grid if reopened, not just the field it was
      // uploaded for -- uploadMedia's own revalidatePath only covers
      // /admin/media, not whatever page this picker happens to be on.
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-secondary/40 p-3"
    >
      <div className="min-w-0 flex-1">
        <label className="text-xs font-medium text-foreground/60">Upload new <span className="text-error">*</span></label>
        <p className="mt-0.5 text-[11px] text-foreground/40">
          Images up to {formatMB(maxBytesForFile({ type: "image/png" }))}
          {acceptsVideo && <> · Video up to {formatMB(maxBytesForFile({ type: "video/mp4" }))}</>}
        </p>
        <input
          name="file"
          type="file"
          required
          accept={accept}
          className="mt-1 block w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-secondary/15 file:px-3 file:py-1.5 file:text-xs file:font-medium"
        />
      </div>
      <button type="submit" disabled={uploading} className="btn-primary shrink-0 px-3 py-1.5 text-xs disabled:opacity-50">
        {uploading ? "Uploading…" : "Upload & Use"}
      </button>
    </form>
  );
}
