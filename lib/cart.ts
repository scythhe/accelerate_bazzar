import { productById, supplierById } from "@/lib/mock/data";
import type { CartLine, Supplier, SupplierProduct } from "@/lib/mock/types";

export interface CartGroupLine {
  product: SupplierProduct;
  packs: number;
  lineTotal: number;
}

export interface CartGroup {
  supplier: Supplier;
  lines: CartGroupLine[];
  subtotal: number;
  minOrderValue: number;
  /** amount still needed to reach the supplier's minimum, 0 if met */
  shortfall: number;
  meetsMinimum: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Group cart lines by supplier and evaluate each group against its minimum. */
export function groupCart(cart: CartLine[]): CartGroup[] {
  const bySupplier = new Map<string, CartGroupLine[]>();

  for (const l of cart) {
    const product = productById(l.productId);
    if (!product || l.packs <= 0) continue;
    const arr = bySupplier.get(product.supplierId) ?? [];
    arr.push({
      product,
      packs: l.packs,
      lineTotal: round2(product.pricePerPack * l.packs),
    });
    bySupplier.set(product.supplierId, arr);
  }

  const groups: CartGroup[] = [];
  for (const [supplierId, lines] of bySupplier) {
    const supplier = supplierById(supplierId);
    const subtotal = round2(lines.reduce((t, i) => t + i.lineTotal, 0));
    const minOrderValue = supplier.delivery.minOrderValue;
    const shortfall = subtotal >= minOrderValue ? 0 : round2(minOrderValue - subtotal);
    groups.push({
      supplier,
      lines,
      subtotal,
      minOrderValue,
      shortfall,
      meetsMinimum: shortfall === 0,
    });
  }

  // stable-ish: cheapest supplier name order doesn't matter; keep insertion order
  return groups;
}

export function cartAllGroupsMeetMinimum(cart: CartLine[]): boolean {
  const groups = groupCart(cart);
  return groups.length > 0 && groups.every((g) => g.meetsMinimum);
}
