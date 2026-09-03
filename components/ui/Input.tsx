import { forwardRef, useId } from "react";
import { cn } from "./cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Short leading adornment, e.g. "+995" or "₾". */
  leading?: React.ReactNode;
  /** Tabular figures — set for any numeric field. */
  numeric?: boolean;
}

// 44px height, 1px --line-strong, radius 6, 12px horizontal padding.
// Focus: 1px --ink border + 3px --accent ring at 20% (DESIGN_SYSTEM.md §6).
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, leading, numeric, className, id, disabled, ...props },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-strong text-ink">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex h-11 items-center gap-2 rounded border bg-paper px-3 transition-colors",
            error
              ? "border-danger focus-within:shadow-[0_0_0_3px_var(--accent-ring)]"
              : "border-line-strong focus-within:border-ink focus-within:shadow-[0_0_0_3px_var(--accent-ring)]",
            disabled && "cursor-not-allowed bg-surface opacity-60",
          )}
        >
          {leading && (
            <span className="shrink-0 text-body text-ink-3 tabular">
              {leading}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "h-full w-full bg-transparent text-body text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed",
              numeric && "tabular",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-small text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-small text-ink-3">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
