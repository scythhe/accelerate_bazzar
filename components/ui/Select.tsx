import { forwardRef, useId } from "react";
import { cn } from "./cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

// Matches Input: 44px, --line-strong, radius 6, --ink border + accent ring on
// focus (DESIGN_SYSTEM.md §6).
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, hint, error, options, placeholder, className, id, disabled, ...props },
    ref,
  ) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    const describedBy = error
      ? `${selectId}-error`
      : hint
        ? `${selectId}-hint`
        : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={selectId} className="text-strong text-ink">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex h-11 items-center rounded border bg-paper transition-colors",
            error
              ? "border-danger focus-within:shadow-[0_0_0_3px_var(--accent-ring)]"
              : "border-line-strong focus-within:border-ink focus-within:shadow-[0_0_0_3px_var(--accent-ring)]",
            disabled && "cursor-not-allowed bg-surface opacity-60",
          )}
        >
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "h-full w-full appearance-none bg-transparent px-3 pr-9 text-body text-ink outline-none disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 h-4 w-4 text-ink-3"
            viewBox="0 0 16 16"
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
        </div>
        {error ? (
          <p id={`${selectId}-error`} className="text-small text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${selectId}-hint`} className="text-small text-ink-3">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";
