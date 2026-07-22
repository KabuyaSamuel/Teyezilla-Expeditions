"use client";

import { useState } from "react";
import { deleteMedia } from "@/lib/admin/actions/media";

export default function MediaDeleteButton({ id, storagePath }: { id: string; storagePath: string | null }) {
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this file? This can't be undone.")) return;
    setBusy(true);
    try {
      await deleteMedia(id, storagePath);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete file.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="text-xs font-medium text-error hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
