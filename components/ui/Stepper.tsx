"use client";

import { useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "./cn";

export interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Smallest real quantity: minus drops from here straight to `min`, and
   *  anything typed below it rounds up. */
  minQty?: number;
  step?: number;
  disabled?: boolean;
  /** Unit shown OUTSIDE the control, e.g. "თარო", "კგ". */
  unit?: string;
  /** Accessible name for the group. */
  label?: string;
}

// Single bordered enclosure, 40px tall — big enough for wet hands. The value is
// a real field: nobody should tap + twenty times for 20kg of cucumbers. Minus is
// disabled (not hidden) at the minimum. Unit label sits outside in `micro`
// --ink-3 (DESIGN_SYSTEM.md §6).
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 9999,
  minQty = 0,
  step = 1,
  disabled = false,
  unit,
  label = "რაოდენობა",
}: StepperProps) {
  // Non-null only while typing, so an emptied field can sit empty mid-edit
  // without dropping the line from the cart.
  const [draft, setDraft] = useState<string | null>(null);

  const type = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    setDraft(digits);
    if (!digits) return;
    const n = Number(digits);
    onChange(n === 0 ? min : Math.min(max, Math.max(min, minQty, n)));
  };

  const dec = () => {
    const next = value - step;
    onChange(next < minQty ? min : Math.max(min, next));
  };
  const inc = () => onChange(Math.min(max, value + step));
  const atMin = disabled || value <= min;
  const atMax = disabled || value >= max;

  const btn =
    "flex h-10 w-10 shrink-0 items-center justify-center text-ink transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-ink-3 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";

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
          <Minus weight="bold" aria-hidden="true" className="h-4 w-4" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          enterKeyHint="done"
          aria-label={label}
          disabled={disabled}
          value={draft ?? value}
          onChange={(e) => type(e.target.value)}
          onFocus={(e) => {
            setDraft(String(value));
            e.target.select();
          }}
          onBlur={() => setDraft(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-12 bg-transparent text-center text-strong tabular text-ink outline-none focus:bg-accent-soft"
        />
        <button
          type="button"
          onClick={inc}
          disabled={atMax}
          aria-label="მომატება"
          className={cn(btn, "border-l border-line-strong")}
        >
          <Plus weight="bold" aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      {unit && <span className="text-micro text-ink-3">{unit}</span>}
    </div>
  );
}
