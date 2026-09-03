import {
  CANONICAL_ITEMS,
  SUPPLIER_PRODUCTS,
  canonicalById,
  supplierById,
} from "./data";
import type { SearchHit } from "./types";

// Search pipeline (UI_BUILD_PROMPT.md §5, adapted): normalise → match canonical
// items by search_terms → map to supplier products → fall back to product-name
// match → sort by price per base unit ascending. Georgian is unicameral, so
// there is no case folding of Georgian; Latin transliterations are lowercased.

function normalise(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trigrams(s: string): Set<string> {
  const padded = `  ${s} `;
  const out = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) out.add(padded.slice(i, i + 3));
  return out;
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const ta = trigrams(a);
  const tb = trigrams(b);
  let shared = 0;
  for (const g of ta) if (tb.has(g)) shared++;
  return (2 * shared) / (ta.size + tb.size);
}

const SIM_THRESHOLD = 0.34;

function matchesTerm(query: string, term: string): boolean {
  const t = normalise(term);
  if (!t) return false;
  if (t === query) return true;
  if (t.includes(query) || query.includes(t)) return true;
  return similarity(query, t) >= SIM_THRESHOLD;
}

export function searchProducts(rawQuery: string): SearchHit[] {
  const query = normalise(rawQuery);
  if (!query) return [];

  // 1–2. canonical items whose search_terms match
  const matchedCanonicalIds = new Set(
    CANONICAL_ITEMS.filter((c) =>
      c.searchTerms.some((term) => matchesTerm(query, term)),
    ).map((c) => c.id),
  );

  // 3. supplier products for those canonical items
  const primary = SUPPLIER_PRODUCTS.filter((p) =>
    matchedCanonicalIds.has(p.canonicalItemId),
  );

  // 4. fallback: direct product-name match, ranked below (only if it adds rows)
  const seen = new Set(primary.map((p) => p.id));
  const fallback = SUPPLIER_PRODUCTS.filter((p) => {
    if (seen.has(p.id)) return false;
    const name = normalise(p.nameKa);
    return name.includes(query) || similarity(query, name) >= SIM_THRESHOLD;
  });

  const toHit = (p: (typeof SUPPLIER_PRODUCTS)[number]): SearchHit => ({
    product: p,
    supplier: supplierById(p.supplierId),
    pricePerBaseUnit:
      Math.round((p.pricePerPack / p.packQuantity) * 100) / 100,
  });

  const rank = (list: typeof SUPPLIER_PRODUCTS) =>
    list
      .map(toHit)
      // available first, then cheapest per base unit
      .sort((a, b) => {
        if (a.product.isAvailable !== b.product.isAvailable)
          return a.product.isAvailable ? -1 : 1;
        return a.pricePerBaseUnit - b.pricePerBaseUnit;
      });

  return [...rank(primary), ...rank(fallback)];
}

/** Nearest categories to offer on an empty result. */
export function suggestedCategories(rawQuery: string): string[] {
  const query = normalise(rawQuery);
  const scored = CANONICAL_ITEMS.map((c) => ({
    label: c.categoryLabel,
    score: Math.max(
      ...c.searchTerms.map((t) => similarity(query, normalise(t))),
      0,
    ),
  }));
  const labels = scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.label);
  return [...new Set(labels)].slice(0, 3);
}

export { canonicalById };
