import { cn } from "./cn";

/** Order lifecycle. Matches `orders.status` in V1_BUILD_PROMPT.md §3. */
export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "DELIVERED"
  | "REJECTED"
  | "CANCELLED";

const STATUS: Record<OrderStatus, { label: string; color: string; soft: string }> = {
  PLACED: { label: "განთავსებულია", color: "var(--warn)", soft: "var(--saffron-soft)" },
  CONFIRMED: { label: "დადასტურებულია", color: "var(--ok)", soft: "var(--herb-soft)" },
  DELIVERED: { label: "მიწოდებულია", color: "var(--ink-2)", soft: "var(--surface-hover)" },
  REJECTED: { label: "უარყოფილია", color: "var(--danger)", soft: "var(--accent-soft)" },
  CANCELLED: { label: "გაუქმებულია", color: "var(--ink-3)", soft: "var(--surface-hover)" },
};

export interface StatusDotProps {
  status: OrderStatus;
  /** Show only the dot, with an accessible name. */
  dotOnly?: boolean;
  className?: string;
}

// A soft pill in the status colour — readable at a glance on a busy list.
export function StatusDot({ status, dotOnly = false, className }: StatusDotProps) {
  const meta = STATUS[status];
  if (dotOnly) {
    return (
      <span className={cn("inline-flex", className)} title={meta.label}>
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
        <span className="sr-only">{meta.label}</span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-micro",
        className,
      )}
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}
