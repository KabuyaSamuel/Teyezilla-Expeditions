"use client";

import { useState } from "react";
import { deleteMedia, checkMediaUsage, type MediaUsageRef } from "@/lib/admin/actions/media";
import ConfirmDialog from "./ConfirmDialog";

export default function MediaDeleteButton({
  id,
  fileUrl,
  storagePath,
}: {
  id: string;
  fileUrl: string;
  storagePath: string | null;
}) {
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [usage, setUsage] = useState<MediaUsageRef[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function openDialog() {
    setChecking(true);
    setError(null);
    try {
      setUsage(await checkMediaUsage(fileUrl));
      setDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check where this file is used.");
    } finally {
      setChecking(false);
    }
  }

  async function handleConfirm() {
    setBusy(true);
    try {
      await deleteMedia(id, storagePath);
      setDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file.");
    } finally {
      setBusy(false);
    }
  }

  const inUse = usage.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        disabled={checking}
        className="text-xs font-medium text-error hover:underline disabled:opacity-50"
      >
        {checking ? "Checking…" : "Delete"}
      </button>

      <ConfirmDialog
        open={dialogOpen}
        title={inUse ? "This file is currently in use" : "Delete this file?"}
        description={
          inUse ? (
            <>
              <p>Deleting it will break the image in:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {usage.map((ref, i) => (
                  <li key={i}>
                    {ref.href ? (
                      <a href={ref.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {ref.label}
                      </a>
                    ) : (
                      ref.label
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3">Delete anyway?</p>
            </>
          ) : (
            "This can't be undone."
          )
        }
        confirmLabel={inUse ? "Delete anyway" : "Yes, delete"}
        cancelLabel="No"
        danger
        busy={busy}
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </>
  );
}
