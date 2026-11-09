"use client";

import { Plus } from "@phosphor-icons/react";
import { Button, Stepper, TrashButton, gel } from "@/components/ui";
import { useDemo } from "@/lib/store/DemoContext";
import type { SupplierProduct } from "@/lib/mock/types";

/** A meta line on a product card: one icon, one fact. */
export function MetaLine({
  icon: Icon,
  children,
}: {
  icon: (props: { className?: string }) => React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Icon className="h-4 w-4 text-ink-3" />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

/** The row's add button — one tap, no sheet or product page in between. */
export function AddButton({ product }: { product: SupplierProduct }) {
  const { addOnePack } = useDemo();
  return (
    <Button
      aria-label={`დამატება — ${product.nameKa}`}
      onClick={() => addOnePack(product.id)}
      className="h-10 w-10 !px-0"
    >
      <Plus weight="bold" aria-hidden="true" className="h-4 w-4" />
    </Button>
  );
}

/** Second line of a row once it's in the cart: the count and running total
 *  beside the stepper, with the trash right next to its plus. */
export function LineQty({ product }: { product: SupplierProduct }) {
  const { getPacks, setPacks, removeLine } = useDemo();
  const count = getPacks(product.id);
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="min-w-0 truncate tabular text-small text-ink-2">
        {count} {product.baseUnit} ·{" "}
        <span className="font-medium text-ink">
          {gel(product.pricePerPack * count)}
        </span>
      </span>
      <div className="flex shrink-0 items-center gap-1.5">
        <Stepper
          value={count}
          onChange={(v) => setPacks(product.id, v)}
          min={0}
          minQty={product.minQty}
          label={`რაოდენობა — ${product.nameKa}`}
        />
        <TrashButton
          label={`წაშლა — ${product.nameKa}`}
          onClick={() => removeLine(product.id)}
        />
      </div>
    </div>
  );
}

/** Under a row's price: what it's priced by, then the smallest order. Stacked so
 *  the price column doesn't eat into the product name. */
export function unitLabel(product: SupplierProduct) {
  return (
    <>
      1 {product.baseUnit}
      {product.minQty > 1 && (
        <span className="block">მინ. {product.minQty}</span>
      )}
    </>
  );
}
