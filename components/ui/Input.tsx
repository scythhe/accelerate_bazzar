import { forwardRef, useId } from "react";
import { cn } from "./cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Short leading adornment, e.g. "+995" or "₾". */
  leading?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leading, className, id, disabled, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex h-tap items-center gap-2 rounded-md border bg-surface px-3 transition-colors duration-150",
            "focus-within:shadow-[var(--focus-ring)]",
            error ? "border-danger" : "border-line",
            disabled && "cursor-not-allowed bg-paper opacity-60",
          )}
        >
          {leading && (
            <span className="shrink-0 text-base text-ink-muted tabular">
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
              "h-full w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-muted disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-sm text-ink-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
