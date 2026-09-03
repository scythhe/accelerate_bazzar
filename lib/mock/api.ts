import { productById, supplierById } from "./data";
import { searchProducts, suggestedCategories } from "./search";
import type { SearchHit } from "./types";

// Everything here is async and returns a Promise even though it resolves from
// memory — a small delay makes the loading states real. When a backend arrives,
// these bodies become fetches and nothing upstream changes.

const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));

export interface SearchResponse {
  query: string;
  hits: SearchHit[];
  suggestions: string[];
}

export async function apiSearch(query: string): Promise<SearchResponse> {
  await delay();
  const hits = searchProducts(query);
  return {
    query,
    hits,
    suggestions: hits.length === 0 ? suggestedCategories(query) : [],
  };
}

export async function apiGetProduct(id: string) {
  await delay(120);
  const product = productById(id);
  if (!product) return null;
  return { product, supplier: supplierById(product.supplierId) };
}
