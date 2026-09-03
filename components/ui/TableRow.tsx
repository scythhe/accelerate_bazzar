import { cn } from "./cn";

export interface TableRowProps {
  /** Primary line, left-aligned. */
  title: React.ReactNode;
  /** Secondary lines under the title — supplier, pack, delivery, minimum. */
  lines?: React.ReactNode[];
  /** Pack price the buyer pays, e.g. "12.00 ₾". Right-aligned, tabular. */
  price?: React.ReactNode;
  /** Comparison figure directly beneath the price, e.g. "0.40 ₾/ცალი". */
  subPrice?: React.ReactNode;
  /** Trailing control — stepper, add button, chevron. */
  action?: React.ReactNode;
  /** Out of stock: dims the row and shows the tag. */
  unavailable?: boolean;
  /** Adds hover affordance; use with onClick. */
  interactive?: boolean;
  onClick?: () => void;
}

export function TableRow({
  title,
  lines = [],
  price,
  subPrice,
  action,
  unavailable = false,
  interactive = false,
  onClick,
}: TableRowProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={cn(
        "flex w-full items-start gap-3 border-b border-line bg-surface px-4 py-3 text-left last:border-b-0",
        (interactive || onClick) &&
          "transition-colors duration-150 hover:bg-paper focus-visible:outline-none",
        unavailable && "opacity-55",
      )}
    >
      {/* Left column — left-aligned, grows. */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-medium text-ink">{title}</p>
          {unavailable && (
            <span className="shrink-0 rounded-sm border border-line px-1.5 py-0.5 text-xs text-ink-muted">
              ამოიწურა
            </span>
          )}
        </div>
        {lines.map((line, i) => (
          <p key={i} className="mt-0.5 text-sm text-ink-muted">
            {line}
          </p>
        ))}
      </div>

      {/* Price column — right-aligned, tabular, fixed alignment. */}
      {(price || subPrice) && (
        <div className="shrink-0 pt-0.5 text-right">
          {price && (
            <p className="tabular text-base font-bold text-ink">{price}</p>
          )}
          {subPrice && (
            <p className="tabular mt-0.5 text-sm text-ink-muted">{subPrice}</p>
          )}
        </div>
      )}

      {/* Trailing action. */}
      {action && <div className="shrink-0 pl-1">{action}</div>}
    </Wrapper>
  );
}
