import { cn } from "./cn";

/** Order lifecycle. Matches `orders.status` in V1_BUILD_PROMPT.md §3. */
export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "DELIVERED"
  | "REJECTED"
  | "CANCELLED";

const STATUS: Record<OrderStatus, { label: string; color: string }> = {
  PLACED: { label: "განთავსებულია", color: "var(--warn)" },
  CONFIRMED: { label: "დადასტურებულია", color: "var(--accent)" },
  DELIVERED: { label: "მიწოდებულია", color: "var(--ok)" },
  REJECTED: { label: "უარყოფილია", color: "var(--danger)" },
  CANCELLED: { label: "გაუქმებულია", color: "var(--ink-3)" },
};

export interface StatusDotProps {
  status: OrderStatus;
  /** Show only the dot, with an accessible name. */
  dotOnly?: boolean;
  className?: string;
}

// 6px dot in the status colour + 6px gap + label at `small` in --ink-2.
// Never a filled badge (DESIGN_SYSTEM.md §3, §6).
export function StatusDot({ status, dotOnly = false, className }: StatusDotProps) {
  const meta = STATUS[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-small text-ink-2", className)}
      title={dotOnly ? meta.label : undefined}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {dotOnly ? <span className="sr-only">{meta.label}</span> : <span>{meta.label}</span>}
    </span>
  );
}
