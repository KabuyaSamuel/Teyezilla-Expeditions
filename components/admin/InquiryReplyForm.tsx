"use client";

import { useState } from "react";
import { sendInquiryReply } from "@/lib/admin/actions/inquiries";
import type { InquiryReply } from "@/lib/admin/data/inquiry-replies";
import { formatDateTime } from "@/lib/formatDate";
import { useToast } from "./Toast";

export default function InquiryReplyForm({
  id,
  status,
  replies,
  customerEmail,
  customerPhone,
  source,
}: {
  id: string;
  status: string;
  replies: InquiryReply[];
  customerEmail: string;
  customerPhone: string;
  source: string;
}) {
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [emailFailed, setEmailFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setConfirmation(null);

    // Checked here, before calling the server action, rather than relying
    // on the action's own validation error to reach the user -- Next.js
    // redacts thrown Server Action errors in production, so a message like
    // "Write a reply before sending." would show up as an opaque generic
    // error instead. See sendInquiryReply's own comment for the full story.
    if (!reply.trim()) {
      setError("Write a reply before sending.");
      return;
    }

    setSaving(true);
    const result = await sendInquiryReply(id, status, new FormData(e.currentTarget));
    setSaving(false);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }
    setEmailFailed(!result.emailSent);
    const message = result.emailSent
      ? "Reply sent to the customer by email."
      : `Reply saved, but the email failed: ${result.emailFailureReason ?? "unknown error"}.`;
    setConfirmation(message);
    if (result.emailSent) toast.success(message);
    else toast.error(message);
    setReply("");
  }

  const canSendViaWhatsapp = source === "whatsapp" && !!customerPhone;
  const whatsappHref = canSendViaWhatsapp
    ? `https://wa.me/${customerPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(reply)}`
    : undefined;

  return (
    <div className="space-y-4">
      {replies.length > 0 && (
        <div className="space-y-2">
          {replies.map((r) => (
            <div key={r.id} className="rounded-2xl border border-secondary/30 bg-secondary/5 p-3">
              <p className="whitespace-pre-line text-sm text-foreground/80">{r.message}</p>
              <p className="mt-1.5 text-xs text-foreground/50">
                {formatDateTime(r.createdAt)}
                {r.sentViaEmail ? " · Sent by email" : " · Not emailed"}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-error">{error}</p>}
        {confirmation && (
          <p className={`text-sm ${emailFailed ? "text-error" : "text-success"}`}>{confirmation}</p>
        )}
        <textarea
          name="reply"
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
            setError(null);
          }}
          rows={5}
          placeholder="Write your reply..."
          className="w-full rounded-2xl border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
            {saving ? "Sending…" : "Send Reply"}
          </button>
          {canSendViaWhatsapp && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
              Open in WhatsApp
            </a>
          )}
        </div>
        {source === "whatsapp" && !customerPhone && (
          <p className="text-xs text-foreground/50">
            No phone number on file for this inquiry -- &ldquo;Send Reply&rdquo; will email {customerEmail || "the customer"} instead.
          </p>
        )}
      </form>
    </div>
  );
}
