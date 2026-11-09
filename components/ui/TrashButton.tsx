"use client";

import { Trash } from "@phosphor-icons/react";

export interface TrashButtonProps {
  label: string; // accessible name — says what gets deleted
  onClick: () => void;
}

// Sits beside the stepper, so it matches its 40px height.
export function TrashButton({ label, onClick }: TrashButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line-strong bg-paper text-ink-2 transition-colors hover:border-danger/40 hover:bg-danger/5 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
    >
      <Trash weight="duotone" aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
