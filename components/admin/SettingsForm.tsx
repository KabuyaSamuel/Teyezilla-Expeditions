"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { updateSiteSettings, type UpdateSiteSettingsState } from "@/lib/admin/actions/settings";
import { useToast } from "./Toast";

const initialState: UpdateSiteSettingsState = {};

// Wraps the raw Server Action in useActionState so this form -- previously
// a plain <form action={updateSiteSettings}> with zero feedback of any
// kind -- gets a real pending state and a result to toast, matching every
// other save flow in the dashboard.
export default function SettingsForm({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(updateSiteSettings, initialState);
  const lastHandled = useRef<UpdateSiteSettingsState | null>(null);

  useEffect(() => {
    if (state === lastHandled.current) return;
    lastHandled.current = state;
    if (state.success) toast.success("Settings saved.");
    else if (state.error) toast.error(state.error);
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      {children}
      <button type="submit" disabled={isPending} className="btn-primary sticky bottom-4 text-sm shadow-cardHover disabled:opacity-60">
        {isPending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
