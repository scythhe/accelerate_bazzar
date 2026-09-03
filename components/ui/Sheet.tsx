"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Action row pinned to the bottom of the panel. */
  footer?: React.ReactNode;
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      restoreRef.current?.focus?.();
    };
  }, [open, handleClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center">
      <button
        aria-hidden="true"
        tabIndex={-1}
        onClick={handleClose}
        className="absolute inset-0 bg-ink/30 motion-safe:animate-[fade_150ms_ease-out]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative z-10 flex max-h-[90dvh] w-full flex-col bg-surface shadow-sheet outline-none",
          // bottom sheet on mobile …
          "mt-auto rounded-t-lg motion-safe:animate-[slideUp_180ms_ease-out]",
          // … centered card from sm up
          "sm:m-auto sm:max-w-md sm:rounded-lg sm:shadow-modal sm:motion-safe:animate-[pop_150ms_ease-out]",
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="დახურვა"
            className="-mr-2 -mt-1 flex h-tap w-tap shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-paper focus-visible:outline-none"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="m4 4 8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 text-base text-ink">
          {children}
        </div>

        {footer && (
          <footer className="flex items-center justify-end gap-3 border-t border-line px-5 py-4">
            {footer}
          </footer>
        )}
      </div>

      <style>{`
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes pop { from { opacity: 0; transform: scale(0.97) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>,
    document.body,
  );
}
