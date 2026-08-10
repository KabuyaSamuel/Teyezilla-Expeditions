"use client";

import { useState } from "react";
import type { AdminExperienceTypeDetail } from "@/lib/admin/data/experience-types";
import { createExperienceType, updateExperienceType, deleteExperienceType } from "@/lib/admin/actions/experience-types";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function ExperienceTypeForm({
  existingExperienceType,
}: {
  existingExperienceType?: AdminExperienceTypeDetail;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      name: String(formData.get("name") ?? ""),
      slug: existingExperienceType?.slug ?? "",
      description: String(formData.get("description") ?? ""),
    };

    try {
      if (existingExperienceType) {
        await updateExperienceType(existingExperienceType.id, input);
      } else {
        await createExperienceType(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save experience type.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingExperienceType) return;
    if (
      !confirm(
        `Delete "${existingExperienceType.name}"? Any tours or journeys tagged with it will lose that tag. This can't be undone.`
      )
    )
      return;
    setSaving(true);
    try {
      await deleteExperienceType(existingExperienceType.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete experience type.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
      <p className="text-xs text-foreground/50">Fields marked with <span className="text-error">*</span> are required.</p>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Basic Details</h2>
        <div className="mt-4">
          <label htmlFor="name" className="text-xs font-medium text-foreground/60">Category Name <span className="text-error">*</span></label>
          <input
            id="name"
            name="name"
            required
            defaultValue={existingExperienceType?.name}
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="text-xs font-medium text-foreground/60">
            Description
          </label>
          <p className="mt-1 text-xs text-foreground/50">
            Shown on the public /experiences/{existingExperienceType?.slug ?? "[category]"} page. Aim for a real
            paragraph, not a one-liner -- this is the main on-page content for that category.
          </p>
          <textarea
            id="description"
            name="description"
            defaultValue={existingExperienceType?.description}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-end gap-3 p-6">
        {existingExperienceType && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Experience Type"}
        </button>
      </section>
    </form>
  );
}
