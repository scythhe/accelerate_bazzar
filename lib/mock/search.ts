import {
  CANONICAL_ITEMS,
  SUPPLIER_PRODUCTS,
  canonicalById,
  supplierById,
} from "./data";
import type { SearchHit, SupplierProduct } from "./types";

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

function scored(a: string, b: string): { dice: number; shared: number } {
  if (!a || !b || a === b) return { dice: a === b ? 1 : 0, shared: 99 };
  const ta = trigrams(a);
  const tb = trigrams(b);
  let shared = 0;
  for (const g of ta) if (tb.has(g)) shared++;
  return { dice: (2 * shared) / (ta.size + tb.size), shared };
}

function similarity(a: string, b: string): number {
  return scored(a, b).dice;
}

// Search terms are curated (Georgian + inflections + transliterations + ru + en),
// so an exact or substring hit is enough. Trigram similarity is deliberately NOT
// used for term matching — short Georgian words share prefixes too readily
// ("ხახვი"/"ხაჭო", "მწნილი"/"მწვანილი") and it produced false results.
function matchesTerm(query: string, term: string): boolean {
  const t = normalise(term);
  if (!t) return false;
  if (t === query) return true;
  return t.length >= 4 && (t.includes(query) || query.includes(t));
}

export function searchProducts(
  rawQuery: string,
  // Products added live this session (a supplier's own "add product" form)
  // on top of the seed catalogue — unmapped (canonicalItemId "") until an
  // admin would map them, so they surface via the name fallback only, same
  // as a real freshly-added product (V1_BUILD_PROMPT.md §3).
  extraProducts: SupplierProduct[] = [],
): SearchHit[] {
  const query = normalise(rawQuery);
  if (!query) return [];

  // A seed product edited this session arrives here under its own id, so the
  // edited copy has to replace the original rather than sit beside it.
  const pool = extraProducts.length
    ? [
        ...SUPPLIER_PRODUCTS.filter(
          (p) => !extraProducts.some((e) => e.id === p.id),
        ),
        ...extraProducts,
      ]
    : SUPPLIER_PRODUCTS;

  // 1–2. canonical items whose search_terms match
  const matchedCanonicalIds = new Set(
    CANONICAL_ITEMS.filter((c) =>
      c.searchTerms.some((term) => matchesTerm(query, term)),
    ).map((c) => c.id),
  );

  // 3. supplier products for those canonical items
  const primary = pool.filter((p) => matchedCanonicalIds.has(p.canonicalItemId));

  // 4. fallback: direct match on the supplier's own product name, ranked below
  const seen = new Set(primary.map((p) => p.id));
  const fallback = pool.filter((p) => {
    if (seen.has(p.id)) return false;
    return (
      normalise(p.nameKa).includes(query) ||
      normalise(p.categoryLabel ?? "") === query
    );
  });

  const toHit = (p: (typeof pool)[number]): SearchHit => ({
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

export interface SearchSuggestion {
  nameKa: string;
  imageUrl?: string;
  supplierCount: number;
  cheapestPerUnit: number;
  baseUnit: SupplierProduct["baseUnit"];
}

/** Typeahead for the search box — finishes the word after a letter or two, so
 *  nobody has to type "კვერცხი" in full with wet hands. */
export function searchSuggestions(rawQuery: string, limit = 5): SearchSuggestion[] {
  const query = normalise(rawQuery);
  if (!query) return [];

  return CANONICAL_ITEMS.filter(
    (c) =>
      normalise(c.nameKa).includes(query) ||
      c.searchTerms.some((t) => normalise(t).startsWith(query)),
  )
    .map((c) => {
      const products = SUPPLIER_PRODUCTS.filter(
        (p) => p.canonicalItemId === c.id && p.isAvailable,
      );
      return {
        nameKa: c.nameKa,
        imageUrl: products[0]?.imageUrl,
        supplierCount: new Set(products.map((p) => p.supplierId)).size,
        cheapestPerUnit: Math.min(
          ...products.map((p) => p.pricePerPack / p.packQuantity),
        ),
        baseUnit: c.baseUnit,
      };
    })
    .filter((s) => s.supplierCount > 0)
    .slice(0, limit);
}

/** Nearest categories to offer on an empty result. */
export function suggestedCategories(rawQuery: string): string[] {
  const query = normalise(rawQuery);
  const ranked = CANONICAL_ITEMS.map((c) => ({
    label: c.categoryLabel,
    score: Math.max(
      ...c.searchTerms.map((t) => similarity(query, normalise(t))),
      0,
    ),
  }));
  const labels = ranked
    .sort((a, b) => b.score - a.score)
    .map((s) => s.label);
  return [...new Set(labels)].slice(0, 3);
}

export { canonicalById };
