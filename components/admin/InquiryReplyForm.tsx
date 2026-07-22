"use client";

import { useState } from "react";
import { sendInquiryReply } from "@/lib/admin/actions/inquiries";

export default function InquiryReplyForm({
  id,
  status,
  existingReply,
  customerEmail,
  customerPhone,
  source,
}: {
  id: string;
  status: string;
  existingReply?: string;
  customerEmail: string;
  customerPhone: string;
  source: string;
}) {
  const [reply, setReply] = useState(existingReply ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      await sendInquiryReply(id, status, new FormData(e.currentTarget));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save reply.");
    } finally {
      setSaving(false);
    }
  }

  const canSendViaWhatsapp = source === "whatsapp" && !!customerPhone;
  const sendHref = canSendViaWhatsapp
    ? `https://wa.me/${customerPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(reply)}`
    : `mailto:${customerEmail}?subject=${encodeURIComponent("Re: your enquiry with Teyezilla Expeditions")}&body=${encodeURIComponent(reply)}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-error">{error}</p>}
      {saved && <p className="text-sm text-success">Reply saved.</p>}
      <textarea
        name="reply"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={5}
        placeholder="Write your reply..."
        className="w-full rounded-2xl border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? "Saving…" : "Save Reply"}
        </button>
        <a
          href={sendHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline text-sm"
        >
          {canSendViaWhatsapp ? "Send via WhatsApp" : "Send via Email"}
        </a>
      </div>
      {source === "whatsapp" && !customerPhone && (
        <p className="text-xs text-foreground/50">
          No phone number on file for this inquiry — falling back to email.
        </p>
      )}
    </form>
  );
}
