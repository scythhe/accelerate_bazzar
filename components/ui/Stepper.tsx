"use client";

import { cn } from "./cn";

export interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Unit shown OUTSIDE the control, e.g. "თარო", "კგ". */
  unit?: string;
  /** Accessible name for the group. */
  label?: string;
}

// Single bordered enclosure, 36px tall. Value is tabular, centred, min 32px so
// it does not jump between 1 and 10. Minus is disabled (not hidden) at the
// minimum. Unit label sits outside in `micro` --ink-3 (DESIGN_SYSTEM.md §6).
export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  unit,
  label = "რაოდენობა",
}: StepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  const atMin = disabled || value <= min;
  const atMax = disabled || value >= max;

  // 36px tall (DESIGN_SYSTEM.md §6); 30px wide keeps the whole control inside a
  // narrow results-row action cell.
  const btn =
    "flex h-9 w-[30px] shrink-0 items-center justify-center text-ink transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-ink-3 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";

  return (
    <div className="inline-flex items-center gap-2">
      <div
        role="group"
        aria-label={label}
        className={cn(
          "inline-flex items-stretch overflow-hidden rounded border border-line-strong bg-paper",
          disabled && "opacity-50",
        )}
      >
        <button
          type="button"
          onClick={dec}
          disabled={atMin}
          aria-label="შემცირება"
          className={cn(btn, "border-r border-line-strong")}
        >
          <MinusIcon />
        </button>
        <div
          aria-live="polite"
          className="flex min-w-8 items-center justify-center px-2 text-strong tabular text-ink"
        >
          {value}
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={atMax}
          aria-label="მომატება"
          className={cn(btn, "border-l border-line-strong")}
        >
          <PlusIcon />
        </button>
      </div>
      {unit && <span className="text-micro text-ink-3">{unit}</span>}
    </div>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
