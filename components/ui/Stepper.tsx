"use client";

import { cn } from "./cn";

export interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Unit shown after the number, e.g. "თარო". */
  unit?: string;
  /** Accessible name for the whole control. */
  label?: string;
  size?: "sm" | "md";
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  unit,
  label = "რაოდენობა",
  size = "md",
}: StepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  const atMin = disabled || value <= min;
  const atMax = disabled || value >= max;

  const btn =
    "flex shrink-0 items-center justify-center text-ink transition-colors duration-150 hover:bg-[#f2f1ec] active:bg-[#e9e7e1] disabled:cursor-not-allowed disabled:text-ink-muted disabled:hover:bg-transparent focus-visible:outline-none";
  const dims = size === "sm" ? "h-9 w-9" : "h-tap w-tap";

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-md border border-line bg-surface",
        disabled && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={dec}
        disabled={atMin}
        aria-label="შემცირება"
        className={cn(btn, dims, "border-r border-line")}
      >
        <MinusIcon />
      </button>
      <div
        aria-live="polite"
        className={cn(
          "flex min-w-12 items-center justify-center gap-1 px-3 text-base font-medium tabular text-ink",
          size === "sm" && "min-w-10 text-sm",
        )}
      >
        <span>{value}</span>
        {unit && <span className="font-normal text-ink-muted">{unit}</span>}
      </div>
      <button
        type="button"
        onClick={inc}
        disabled={atMax}
        aria-label="მომატება"
        className={cn(btn, dims, "border-l border-line")}
      >
        <PlusIcon />
      </button>
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
