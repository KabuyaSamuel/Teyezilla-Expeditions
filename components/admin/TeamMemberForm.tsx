"use client";

import { useState } from "react";
import type { AdminTeamMember } from "@/lib/admin/data/team-members";
import type { MediaItem } from "@/lib/admin/data/media";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/admin/actions/team-members";
import MediaPickerField from "./MediaPickerField";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function TeamMemberForm({
  existingTeamMember,
  mediaItems,
}: {
  existingTeamMember?: AdminTeamMember;
  mediaItems: MediaItem[];
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState(existingTeamMember?.photo ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      fullName: String(formData.get("fullName") ?? ""),
      roleTitle: String(formData.get("roleTitle") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      photo,
      status: String(formData.get("status") ?? "draft"),
      displayOrder: Number(formData.get("displayOrder") ?? 0),
    };

    try {
      if (existingTeamMember) {
        await updateTeamMember(existingTeamMember.id, input);
      } else {
        await createTeamMember(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save team member.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingTeamMember) return;
    if (!confirm(`Delete "${existingTeamMember.fullName}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteTeamMember(existingTeamMember.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete team member.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Team Member Details</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Not shown on the public site yet -- the About page&apos;s team section needs a developer to
          build before entries here become visible anywhere.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="text-xs font-medium text-foreground/60">Full Name</label>
            <input id="fullName" name="fullName" required defaultValue={existingTeamMember?.fullName} placeholder="Paul Teye" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="roleTitle" className="text-xs font-medium text-foreground/60">Role / Title</label>
            <input id="roleTitle" name="roleTitle" defaultValue={existingTeamMember?.roleTitle} placeholder="Founder & Head Guide" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <MediaPickerField id="photo" name="photo" label="Photo" value={photo} onChange={setPhoto} mediaItems={mediaItems} />
          </div>
          <div>
            <label htmlFor="displayOrder" className="text-xs font-medium text-foreground/60">Display Order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={existingTeamMember?.displayOrder ?? 0} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="bio" className="text-xs font-medium text-foreground/60">Bio</label>
          <textarea id="bio" name="bio" defaultValue={existingTeamMember?.bio} rows={4} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <select id="status" name="status" defaultValue={existingTeamMember?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="flex flex-wrap gap-3">
          {existingTeamMember && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save Team Member"}
          </button>
        </div>
      </section>
    </form>
  );
}
