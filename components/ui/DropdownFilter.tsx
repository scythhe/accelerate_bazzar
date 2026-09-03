"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "./cn";

export interface FilterOption {
  value: string;
  label: string;
}

export interface DropdownFilterProps {
  /** Label shown when nothing is selected, e.g. "კატეგორია". */
  label: string;
  options: FilterOption[];
  /** Selected values. Single-select still uses an array of length 0 or 1. */
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  /** Prefix kept even when a value is chosen, e.g. "მიწოდება". */
  activePrefix?: string;
}

// Filter chip: 32px tall, radius 6 (not a pill), 1px --line-strong, 12px pad.
// Active = --accent-soft background, --accent border and text. Chevron only
// because it opens a menu (DESIGN_SYSTEM.md §6).
export function DropdownFilter({
  label,
  options,
  value,
  onChange,
  multiple = false,
  activePrefix,
}: DropdownFilterProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const active = value.length > 0;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (v: string) => {
    if (multiple) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange(value.includes(v) ? [] : [v]);
      setOpen(false);
    }
  };

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  const triggerText = !active
    ? label
    : activePrefix
      ? `${activePrefix}: ${selectedLabels.join(", ")}`
      : selectedLabels.join(", ");

  return (
    <div ref={rootRef} className="relative inline-block shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded border px-3 text-small transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
          active
            ? "border-accent bg-accent-soft text-accent"
            : "border-line-strong bg-paper text-ink-2 hover:bg-surface-hover",
        )}
      >
        <span>{triggerText}</span>
        <ChevronIcon
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          className="absolute left-0 z-30 mt-1.5 min-w-56 rounded-lg border border-line bg-paper p-1 shadow-float"
        >
          {options.map((o) => {
            const checked = value.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(o.value)}
                className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-body text-ink transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                    checked
                      ? "border-accent bg-accent text-white"
                      : "border-line-strong",
                  )}
                >
                  {checked && <CheckIcon className="h-3 w-3" />}
                </span>
                <span>{o.label}</span>
              </button>
            );
          })}
          {multiple && active && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded px-2.5 py-2 text-left text-small text-ink-3 hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            >
              გასუფთავება
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("h-3.5 w-3.5", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("h-3.5 w-3.5", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3 8 3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
