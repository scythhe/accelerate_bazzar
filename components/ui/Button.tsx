import { forwardRef } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Fill the available width. */
  block?: boolean;
}

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  // --accent used here — one of only three places it appears.
  primary: "bg-accent text-accent-ink hover:bg-[#6a1a25] active:bg-[#5c161f]",
  secondary:
    "border border-line bg-surface text-ink hover:bg-paper active:bg-[#f2f1ec]",
  ghost: "bg-transparent text-ink hover:bg-[#f2f1ec] active:bg-[#e9e7e1]",
  danger:
    "border border-danger/25 bg-surface text-danger hover:bg-danger/5 active:bg-danger/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-tap px-5 text-base",
  lg: "h-12 px-6 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      block = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
