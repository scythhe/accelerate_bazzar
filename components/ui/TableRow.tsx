import { cn } from "./cn";

export interface TableRowProps {
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
  /** Trailing control — stepper or add button. Fixed-width cell, centred. */
  action?: React.ReactNode;
  /** Out of stock — dims the row, shows the tag, mutes the price. */
  unavailable?: boolean;
  /** Hover affordance; pair with onClick. */
  interactive?: boolean;
  onClick?: () => void;
}

// Search result row (DESIGN_SYSTEM.md §5). Vertical padding 14px, horizontal
// 16px, 1px --line divider, no gap, no card, no radius. Target height 76–84px so
// nine to ten rows clear the fold on a 380×800 viewport.
//
// Note: the spec sketch stacks price / per-unit / stepper in one right column.
// At the 36px stepper height that pushes the row past 100px, so the action moves
// to its own fixed-width cell, vertically centred — price + per-unit keep their
// own right-aligned block with a fixed minimum width, so decimal points still
// align down the whole list.
export function TableRow({
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
        // 14px vertical on mobile (76–84px rows); tighter on desktop (68–72px).
        "flex w-full items-center gap-2 border-b border-line bg-paper px-4 py-row-y text-left sm:py-2",
        (interactive || onClick) &&
          "transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
      )}
    >
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
        <div className="flex shrink-0 flex-col items-end">
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

      {/* Action — right cell, sized to its content and right-aligned. The
          resting add control is one width for every row, so the price column
          stays aligned down the list; a row switched to a stepper widens only
          itself. */}
      {(action || price) && (
        <div className="flex min-w-[44px] shrink-0 justify-end">{action}</div>
      )}
    </Wrapper>
  );
}
