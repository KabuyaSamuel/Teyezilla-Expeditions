"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { createTrackedLink, deleteTrackedLink, updateTrackedLink } from "@/lib/admin/actions/link-generator";
import type { TrackedLinkListItem } from "@/lib/admin/data/link-generator";
import { useToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";

const PRESETS = [
  { label: "Google Ads", source: "google", medium: "cpc" },
  { label: "Meta Ads (Facebook/Instagram)", source: "meta", medium: "cpc" },
  { label: "Instagram Bio", source: "instagram", medium: "social" },
  { label: "TikTok Bio", source: "tiktok", medium: "social" },
  { label: "Facebook Page", source: "facebook", medium: "social" },
  { label: "Email Newsletter", source: "email", medium: "email" },
  { label: "WhatsApp", source: "whatsapp", medium: "social" },
];

export default function LinkGenerator({ links }: { links: TrackedLinkListItem[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [path, setPath] = useState("/");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [label, setLabel] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrackedLinkListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editPath, setEditPath] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editMedium, setEditMedium] = useState("");
  const [editCampaign, setEditCampaign] = useState("");
  const [saving, setSaving] = useState(false);

  const isKnownPreset = PRESETS.some((p) => p.source === source && p.medium === medium);

  async function handleCreate() {
    if (!source.trim()) return;
    setCreating(true);
    try {
      const { slug } = await createTrackedLink({
        label,
        destinationPath: path,
        utmSource: source,
        utmMedium: medium,
        utmCampaign: campaign,
        slug: customSlug,
      });
      await copyToClipboard(`${SITE_URL}/go/${slug}`, setCopiedSlug, slug);
      toast.success("Link created and copied to clipboard.");
      setLabel("");
      setCampaign("");
      setCustomSlug("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create link.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(link: TrackedLinkListItem) {
    setEditingId(link.id);
    setEditLabel(link.label ?? "");
    setEditPath(link.destinationPath);
    setEditSource(link.utmSource);
    setEditMedium(link.utmMedium ?? "");
    setEditCampaign(link.utmCampaign ?? "");
  }

  async function handleUpdate() {
    if (!editingId || !editSource.trim()) return;
    setSaving(true);
    try {
      await updateTrackedLink(editingId, {
        label: editLabel,
        destinationPath: editPath,
        utmSource: editSource,
        utmMedium: editMedium,
        utmCampaign: editCampaign,
      });
      toast.success("Link updated.");
      setEditingId(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update link.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTrackedLink(deleteTarget.id);
      toast.success("Link deleted.");
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete link.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Quick presets</h2>
        <p className="mt-1 text-xs text-foreground/50">Fills in source and medium for a common channel -- campaign name is still yours to fill in.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setSource(p.source);
                setMedium(p.medium);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                source === p.source && medium === p.medium
                  ? "bg-primary text-white"
                  : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setSource("");
              setMedium("");
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !isKnownPreset
                ? "bg-primary text-white"
                : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
            }`}
          >
            Custom
          </button>
        </div>
      </section>

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="label" className="text-xs font-medium text-foreground/60">Label</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">A name to recognize this link by later, e.g. &ldquo;August TikTok promo&rdquo;.</p>
          <input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="August TikTok promo" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="path" className="text-xs font-medium text-foreground/60">Page to link to</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">e.g. / for the homepage, /destinations/kenya, /tours/serengeti-safari</p>
          <input id="path" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="source" className="text-xs font-medium text-foreground/60">Source *</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">Where the click comes from, e.g. google, tiktok, instagram</p>
          <input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="tiktok" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="medium" className="text-xs font-medium text-foreground/60">Medium</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">The channel type, e.g. cpc, social, email</p>
          <input id="medium" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="social" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="campaign" className="text-xs font-medium text-foreground/60">Campaign name</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">e.g. august-safari-promo -- whatever helps you tell campaigns apart later</p>
          <input id="campaign" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="august-safari-promo" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="customSlug" className="text-xs font-medium text-foreground/60">Custom short link (optional)</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">Leave blank to generate one automatically.</p>
          <input id="customSlug" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} placeholder="tiktok-august" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="sm:col-span-2">
          <button type="button" onClick={handleCreate} disabled={creating || !source.trim()} className="btn-primary text-sm disabled:opacity-50">
            {creating ? "Creating…" : "Create Trackable Link"}
          </button>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Your links</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Every click through one of these is counted here, whether or not the visitor goes on to enquire --
          see Reports &amp; Analytics for enquiries specifically attributed to a source.
        </p>
        <div className="mt-4 space-y-3">
          {links.map((link) => {
            const url = `${SITE_URL}/go/${link.slug}`;
            if (editingId === link.id) {
              return (
                <div key={link.id} className="rounded-xl border border-primary/30 bg-secondary/10 p-4">
                  <p className="text-xs font-medium text-foreground/60">Editing {url} -- short link itself can&rsquo;t be changed.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-foreground/60">Label</label>
                      <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-foreground/60">Page to link to</label>
                      <input value={editPath} onChange={(e) => setEditPath(e.target.value)} placeholder="/" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground/60">Source *</label>
                      <input value={editSource} onChange={(e) => setEditSource(e.target.value)} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground/60">Medium</label>
                      <input value={editMedium} onChange={(e) => setEditMedium(e.target.value)} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-foreground/60">Campaign name</label>
                      <input value={editCampaign} onChange={(e) => setEditCampaign(e.target.value)} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button type="button" onClick={handleUpdate} disabled={saving || !editSource.trim()} className="btn-primary text-sm disabled:opacity-50">
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} disabled={saving} className="btn-outline text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }
            return (
              <div key={link.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/10 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {link.label || `${link.utmSource}${link.utmCampaign ? ` · ${link.utmCampaign}` : ""}`}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-foreground/60">{url} → {link.destinationPath}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right">
                    <p className="font-heading text-lg font-bold text-accent">{link.clickCount.toLocaleString()}</p>
                    <p className="text-[11px] text-foreground/50">click{link.clickCount === 1 ? "" : "s"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(url, setCopiedSlug, link.slug)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {copiedSlug === link.slug ? "Copied ✓" : "Copy"}
                  </button>
                  <button type="button" onClick={() => startEdit(link)} className="text-xs font-medium text-primary hover:underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(link)} className="text-xs font-medium text-error hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {links.length === 0 && <p className="text-sm text-foreground/50">No trackable links yet -- create one above.</p>}
        </div>
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this link?"
        description="Its click history will be deleted too. This can't be undone."
        confirmLabel="Yes, delete"
        cancelLabel="No"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

async function copyToClipboard(text: string, setCopied: (slug: string | null) => void, slug: string) {
  await navigator.clipboard.writeText(text);
  setCopied(slug);
  setTimeout(() => setCopied(null), 2000);
}
