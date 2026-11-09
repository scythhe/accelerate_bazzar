"use client";

import { cn } from "./cn";

export interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string; // accessible name — this control has no visible text of its own
  disabled?: boolean;
}

// Availability toggle. --ok when on (available), --line-strong track when off.
// The knob travels left to right to turn on, 2px inside the track at both ends.
// The one place in the app a fully-round shape is right: it's a universal
// switch affordance, not decoration.
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        checked ? "bg-ok" : "bg-line-strong",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
