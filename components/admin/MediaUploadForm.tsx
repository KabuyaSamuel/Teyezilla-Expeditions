"use client";

import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/admin/actions/media";

export default function MediaUploadForm() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await uploadMedia(new FormData(e.currentTarget));
      formRef.current?.reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
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
          <label htmlFor="file" className="text-xs font-medium text-foreground/60">File</label>
          <input id="file" name="file" type="file" required accept="image/png,image/jpeg,image/webp,image/gif,application/pdf" className="mt-1 block text-sm" />
        </div>
        <div>
          <label htmlFor="altText" className="text-xs font-medium text-foreground/60">Alt Text</label>
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
