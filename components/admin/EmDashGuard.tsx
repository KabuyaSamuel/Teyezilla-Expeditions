"use client";

import { useEffect, useRef } from "react";
import { useToast } from "./Toast";

// U+2014 is the em dash character itself -- kept as a Unicode escape
// rather than a literal glyph so the one place this project needs to
// reference it isn't itself an instance of the thing it's blocking.
const EM_DASH = "\u2014";
const MESSAGE = "Em dashes aren't allowed here. Use a comma, colon, or period instead.";

// No em dash anywhere in Teyezilla content -- enforced here instead of in
// every individual field, via event delegation on the whole admin section
// plus the browser's own constraint validation (setCustomValidity), so no
// per-field changes are needed and it covers every text input/textarea
// under /admin, present and future, uniformly. A field carrying one blocks
// that form's submission (native browser behavior) until it's removed.
export default function EmDashGuard() {
  const { toast } = useToast();
  const flagged = useRef<WeakSet<EventTarget>>(new WeakSet());

  useEffect(() => {
    function isTextField(el: EventTarget | null): el is HTMLInputElement | HTMLTextAreaElement {
      if (el instanceof HTMLTextAreaElement) return true;
      if (el instanceof HTMLInputElement) {
        return el.type === "text" || el.type === "search" || el.type === "tel" || el.type === "";
      }
      return false;
    }

    function handleInput(e: Event) {
      const target = e.target;
      if (!isTextField(target)) return;

      const hasEmDash = target.value.includes(EM_DASH);
      const wasFlagged = flagged.current.has(target);

      if (hasEmDash && !wasFlagged) {
        flagged.current.add(target);
        target.setCustomValidity(MESSAGE);
        target.reportValidity();
        toast.error(MESSAGE);
      } else if (!hasEmDash && wasFlagged) {
        flagged.current.delete(target);
        target.setCustomValidity("");
      }
    }

    // Capture phase so this still runs for inputs inside nested components
    // that stop event propagation on their own onChange/onInput handlers.
    document.addEventListener("input", handleInput, true);
    return () => document.removeEventListener("input", handleInput, true);
  }, [toast]);

  return null;
}
