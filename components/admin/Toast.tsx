"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Errors stay up longer than successes -- a success is a quick "good,
// noted," an error is something the staff member needs time to actually
// read and decide what to do about.
const DURATION_MS = { success: 4000, error: 8000 };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (type: ToastItem["type"], message: string) => {
      const id = nextId.current++;
      setItems((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => dismiss(id), DURATION_MS[type]);
    },
    [dismiss]
  );

  const toast = {
    success: (message: string) => push("success", message),
    error: (message: string) => push("error", message),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role={item.type === "error" ? "alert" : "status"}
            className={`animate-toastIn pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-cardHover ${
              item.type === "success"
                ? "border-success/20 bg-white text-foreground"
                : "border-error/20 bg-white text-foreground"
            }`}
          >
            {item.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
            )}
            <p className="flex-1 text-sm">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss"
              className="shrink-0 text-foreground/40 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
