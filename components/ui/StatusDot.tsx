import { cn } from "./cn";

/** Order lifecycle. Matches `orders.status` in V1_BUILD_PROMPT.md §3. */
export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "DELIVERED"
  | "REJECTED"
  | "CANCELLED";

interface StatusMeta {
  label: string;
  /** token colour */
  color: string;
  /** filled dot vs hollow ring */
  fill: boolean;
}

const STATUS: Record<OrderStatus, StatusMeta> = {
  PLACED: { label: "განთავსებულია", color: "var(--warn)", fill: false },
  CONFIRMED: { label: "დადასტურებულია", color: "var(--ok)", fill: false },
  DELIVERED: { label: "მიწოდებულია", color: "var(--ok)", fill: true },
  REJECTED: { label: "უარყოფილია", color: "var(--danger)", fill: true },
  CANCELLED: { label: "გაუქმებულია", color: "var(--ink-muted)", fill: false },
};

export interface StatusDotProps {
  status: OrderStatus;
  /** Hide the text label, show only the dot (with an accessible name). */
  dotOnly?: boolean;
  className?: string;
}

export function StatusDot({ status, dotOnly = false, className }: StatusDotProps) {
  const meta = STATUS[status];
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-sm text-ink", className)}
      title={dotOnly ? meta.label : undefined}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full border"
        style={{
          borderColor: meta.color,
          backgroundColor: meta.fill ? meta.color : "transparent",
        }}
      />
      {dotOnly ? (
        <span className="sr-only">{meta.label}</span>
      ) : (
        <span>{meta.label}</span>
      )}
    </span>
  );
}
