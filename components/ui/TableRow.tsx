import { cn } from "./cn";

export interface TableRowProps {
  /** Optional 44px leading thumbnail (image or fallback tile). */
  thumb?: React.ReactNode;
  /** Primary line — product name. 17/500, --ink. */
  title: React.ReactNode;
  /** Meta line 1 — supplier · pack. 13/400, --ink-2. */
  meta1?: React.ReactNode;
  /** Meta line 2 — delivery · minimum. 11/500, --ink-3. */
  meta2?: React.ReactNode;
  /** Pack price the buyer pays, e.g. "12.00 ₾". 17/700, tabular, right-aligned. */
  price?: React.ReactNode;
  /** Comparison figure, e.g. "0.40 ₾/ცალი". 13/500, --ink-3, tabular. */
  perUnit?: React.ReactNode;
  /** Trailing control — stepper or add button. */
  action?: React.ReactNode;
  /** Out of stock — dims the row, shows the tag, mutes the price. */
  unavailable?: boolean;
  /** Hover affordance; pair with onClick. */
  interactive?: boolean;
  onClick?: () => void;
}

// Search result row (DESIGN_SYSTEM.md §5). Vertical padding 14px, horizontal
// 16px, 1px --line divider, no gap, no card, no radius. 84px tall on mobile with
// the thumbnail, 12px between thumb and title. Still a dense list — the price
// column stays right-aligned with a fixed minimum width so decimals align.
export function TableRow({
  thumb,
  title,
  meta1,
  meta2,
  price,
  perUnit,
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
        "flex w-full items-center border-b border-line bg-paper px-4 py-row-y text-left",
        thumb ? "min-h-[84px] sm:min-h-[72px]" : "",
        (interactive || onClick) &&
          "transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
      )}
    >
      {thumb && (
        <span className={cn("mr-3 shrink-0", unavailable && "opacity-55")}>
          {thumb}
        </span>
      )}

      {/* Left column — grows, truncates. Tight line-boxes keep the row short. */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate text-title leading-[20px]",
              unavailable ? "text-ink-3" : "text-ink",
            )}
          >
            {title}
          </p>
          {unavailable && (
            <span className="shrink-0 rounded-sm border border-line-strong px-1.5 py-px text-micro text-ink-3">
              ამოიწურა
            </span>
          )}
        </div>
        {meta1 && (
          <p className="truncate text-small leading-4 text-ink-2">{meta1}</p>
        )}
        {meta2 && (
          <p className="truncate text-micro leading-[14px] text-ink-3">{meta2}</p>
        )}
      </div>

      {/* Price block — right-aligned, tabular, fixed minimum width. */}
      {(price || perUnit) && (
        <div className="ml-1.5 flex shrink-0 flex-col items-end">
          {price && (
            <p
              className={cn(
                "min-w-[64px] text-right text-price leading-[20px] tabular",
                unavailable ? "text-ink-3" : "text-ink",
              )}
            >
              {price}
            </p>
          )}
          {perUnit && (
            <p className="text-right text-small font-medium leading-4 tabular text-ink-3">
              {perUnit}
            </p>
          )}
        </div>
      )}

      {/* Action — fixed-width cell so the price column never shifts between the
          add button, a stepper and the sold-out state. */}
      {(action || price) && (
        <div className="ml-1.5 flex min-w-[36px] shrink-0 justify-end">
          {action}
        </div>
      )}
    </Wrapper>
  );
}
