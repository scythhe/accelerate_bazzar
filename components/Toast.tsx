"use client";

import { useEffect } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store/DemoContext";

// Feedback for a user action (DESIGN_SYSTEM.md §7) — confirms an add-to-cart
// tap actually registered, which matters most exactly when someone is
// demoing live and can't easily double-check the cart.
export function Toast() {
  const { toast, dismissToast } = useDemo();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 1800);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className="motion-safe:animate-[toast-in_180ms_ease-out] fixed bottom-44 left-1/2 z-50 lg:bottom-24 -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-strong text-white shadow-float">
        <CheckCircle weight="fill" aria-hidden="true" className="h-5 w-5 shrink-0 text-saffron" />
        <span className="max-w-[62vw] truncate">{toast.message}</span>
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
