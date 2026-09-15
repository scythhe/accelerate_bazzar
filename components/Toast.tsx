"use client";

import { useEffect } from "react";
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
      className="motion-safe:animate-[toast-in_180ms_ease-out] fixed left-1/2 top-4 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-strong text-white shadow-float">
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 text-ok"
          fill="none"
          aria-hidden
        >
          <path
            d="m3 8 3.5 3.5L13 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="max-w-[62vw] truncate">{toast.message}</span>
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
