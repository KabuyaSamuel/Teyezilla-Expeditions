"use client";

import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/admin/actions/media";
import { maxBytesForFile, formatMB } from "@/lib/mediaLimits";
import { useToast } from "./Toast";

export default function MediaUploadForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const files = Array.from(fileInput.files ?? []);
    if (files.length === 0) {
      setError("Choose at least one file.");
      return;
    }

    const sharedFormData = new FormData(form);
    setSaving(true);

    // Uploaded in parallel and reported as a batch (rather than aborting on
    // the first failure) so one bad file in a bulk selection doesn't lose
    // the rest of an otherwise-successful upload.
    const results = await Promise.allSettled(
      files.map((file) => {
        // Checked here too (not just server-side in uploadMedia) so an
        // oversized file in a bulk selection fails instantly instead of
        // waiting on a network round trip that was always going to be
        // rejected.
        const maxBytes = maxBytesForFile(file);
        if (file.size > maxBytes) {
          const kind = file.type.startsWith("video/") ? "Videos" : "This file type";
          return Promise.reject(
            new Error(`"${file.name}": ${kind} must be ${formatMB(maxBytes)} or smaller (this file is ${formatMB(file.size)}).`)
          );
        }

        const fd = new FormData();
        fd.set("file", file);
        // A shared alt text only makes sense for a single file; for a bulk
        // selection each file keeps its own filename as alt text instead
        // (uploadMedia already falls back to that when altText is blank).
        fd.set("altText", files.length === 1 ? String(sharedFormData.get("altText") ?? "") : "");
        fd.set("tags", String(sharedFormData.get("tags") ?? ""));
        return uploadMedia(fd);
      })
    );

    const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    const succeeded = results.length - failed.length;

    if (succeeded > 0) toast.success(`${succeeded} file${succeeded === 1 ? "" : "s"} uploaded.`);
    if (failed.length > 0) {
      const message = `${failed.length} file${failed.length === 1 ? "" : "s"} failed: ${
        failed[0].reason instanceof Error ? failed[0].reason.message : "unknown error"
      }`;
      setError(message);
      toast.error(message);
    }

    if (failed.length === 0) {
      formRef.current?.reset();
      setOpen(false);
    }
    setSaving(false);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-primary text-sm">
        + Upload
      </button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-secondary/30 bg-white p-4 shadow-card sm:w-auto">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        {error && <p className="w-full text-sm text-error">{error}</p>}
        <div>
          <label htmlFor="file" className="text-xs font-medium text-foreground/60">File(s)</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">Images/PDFs up to 10MB &middot; video up to 20MB</p>
          <input
            id="file"
            name="file"
            type="file"
            multiple
            required
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,video/mp4,video/webm,video/quicktime"
            className="mt-1 block text-sm"
          />
        </div>
        <div>
          <label htmlFor="altText" className="text-xs font-medium text-foreground/60">Alt Text</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">Only applies when uploading a single file.</p>
          <input id="altText" name="altText" className="mt-1 w-40 rounded-full border border-secondary/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="tags" className="text-xs font-medium text-foreground/60">Tags (comma-separated)</label>
          <input id="tags" name="tags" className="mt-1 w-40 rounded-full border border-secondary/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? "Uploading…" : "Upload"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-foreground/60 hover:underline">
          Cancel
        </button>
      </form>
    </div>
  );
}
