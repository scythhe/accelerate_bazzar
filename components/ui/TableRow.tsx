import { cn } from "./cn";

export interface TableRowProps {
  /** Optional leading thumbnail (image or fallback tile). */
  thumb?: React.ReactNode;
  /** Primary line — product name. */
  title: React.ReactNode;
  /** Meta line 1 — the supplier. */
  meta1?: React.ReactNode;
  /** Meta line 2 — delivery · minimum. */
  meta2?: React.ReactNode;
  /** Price the buyer pays, e.g. "12.00 ₾". */
  price?: React.ReactNode;
  /** What the price is for, e.g. "1 ცალი". */
  perUnit?: React.ReactNode;
  /** Trailing control — the add button. */
  action?: React.ReactNode;
  /** Full-width line under the row — the quantity stepper once it's in the
   *  cart, so the title and price columns keep their width. */
  footer?: React.ReactNode;
  /** Out of stock — dims the row, shows the tag, mutes the price. */
  unavailable?: boolean;
  /** Cheapest available result in this list. */
  bestPrice?: boolean;
  /** Hover affordance; pair with onClick. */
  interactive?: boolean;
  onClick?: () => void;
}

// The product card: the core of the app, so everything else is built to match
// it. Name and price share the top line, then supplier and delivery run the full
// width below, because those are what a buyer in a hurry needs to read whole. The
// name gets two lines for the same reason, and prices keep a fixed width so they
// line up down a column.
export function TableRow({
  thumb,
  title,
  meta1,
  meta2,
  price,
  perUnit,
  action,
  footer,
  unavailable = false,
  bestPrice = false,
  interactive = false,
  onClick,
}: TableRowProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={cn(
        "card grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-x-2 gap-y-1 p-3 text-left transition-shadow hover:shadow-lift",
        (interactive || onClick) &&
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
      )}
    >
      {thumb ? (
        <span
          className={cn(
            "relative row-span-2 mr-1 self-center",
            unavailable && "opacity-55",
          )}
        >
          {thumb}
          {bestPrice && (
            <span className="absolute inset-x-0 bottom-0 rounded-b bg-saffron py-px text-center text-[11px] font-semibold leading-4 text-ink">
              იაფი
            </span>
          )}
        </span>
      ) : (
        <span className="row-span-2" />
      )}

      <div className="min-w-0">
        <p
          className={cn(
            "line-clamp-2 text-strong leading-[20px] sm:text-title sm:leading-[22px]",
            unavailable ? "text-ink-3" : "text-ink",
          )}
        >
          {title}
        </p>
        {unavailable && (
          <span className="mt-1 inline-block rounded-full bg-surface-hover px-2 py-px text-micro text-ink-3">
            ამოიწურა
          </span>
        )}
      </div>

      <div className="flex flex-col items-end">
        {price && (
          <p
            className={cn(
              "min-w-[64px] text-right text-price leading-[22px] tabular",
              unavailable ? "text-ink-3" : bestPrice ? "text-ok" : "text-ink",
            )}
          >
            {price}
          </p>
        )}
        {perUnit && (
          <p className="text-right text-small leading-4 tabular text-ink-3">
            {perUnit}
          </p>
        )}
      </div>

      <div className="flex justify-end">{action}</div>

      {(meta1 || meta2) && (
        <div className="col-start-2 col-end-5 min-w-0 space-y-0.5 text-small leading-5 text-ink-2">
          {meta1 && <p className="truncate">{meta1}</p>}
          {meta2 && <p className="truncate">{meta2}</p>}
        </div>
      )}

      {footer && (
        <div className="col-span-full mt-1.5 border-t border-line pt-2.5">
          {footer}
        </div>
      )}
    </Wrapper>
  );
}
