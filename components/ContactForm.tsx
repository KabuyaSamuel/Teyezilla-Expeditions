"use client";

import { useActionState, useState } from "react";
import { submitContactMessage } from "@/app/contact/actions";
import { whatsappLink, type EnquiryFormState } from "@/lib/enquiry-shared";

const inputClass =
  "w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 px-2 text-xs text-red-600">{message}</p>;
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<EnquiryFormState, FormData>(
    submitContactMessage,
    {}
  );
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <div className="mt-8 rounded-2xl bg-primary/5 p-8 text-center">
        <p className="font-heading text-xl font-semibold text-primary">Message sent, thank you!</p>
        <p className="mt-2 text-sm text-foreground/70">
          Our team will reply within 24 hours. Prefer a faster answer?
        </p>
        <a
          href={whatsappLink("Hi! I just sent a message via your contact form.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-4 text-sm"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} onReset={(e) => e.preventDefault()} className="mt-8 space-y-4" noValidate>
      <div>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Full name"
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          className={inputClass}
        />
        <FieldError message={errors.name} />
      </div>
      <div>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={fields.email}
          onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
        />
        <FieldError message={errors.email} />
      </div>
      <div>
        <textarea
          id="message"
          name="message"
          placeholder="Message"
          rows={5}
          value={fields.message}
          onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
          className="w-full rounded-2xl border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <FieldError message={errors.message} />
      </div>
      {state.formError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.formError}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
