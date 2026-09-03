// Demo mock types. Named after the V1 schema (V1_BUILD_PROMPT.md §3) but pared
// to what the nine demo screens need. The `/lib/mock` directory is the seam that
// a real backend replaces later.

export type BaseUnit = "ცალი" | "კგ" | "ლ";

export type District =
  | "ვაკე"
  | "საბურთალო"
  | "ისანი"
  | "გლდანი"
  | "დიდუბე"
  | "ვერა"
  | "მთაწმინდა";

export type OrgType = "SUPPLIER" | "BUYER";

export interface Organization {
  id: string;
  type: OrgType;
  legalName: string; // "შპს …"
  displayName: string; // short name shown in the UI
  taxId: string; // ს/კ
}

export interface SupplierDelivery {
  districts: District[];
  minOrderValue: number; // GEL
  cutoffLabel: string; // "16:00-მდე"
  leadLabel: string; // "ხვალ", "დღეს"
}

export interface Supplier extends Organization {
  type: "SUPPLIER";
  delivery: SupplierDelivery;
}

export interface CanonicalItem {
  id: string;
  category: string; // slug: "eggs", "veg", …
  categoryLabel: string; // "კვერცხი"
  nameKa: string;
  baseUnit: BaseUnit;
  searchTerms: string[]; // Georgian + translit + ru + en
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  canonicalItemId: string;
  nameKa: string; // supplier's own wording
  baseUnit: BaseUnit;
  packLabel: string; // "თარო (30 ცალი)"
  packQuantity: number; // base units per pack
  pricePerPack: number; // GEL, gross
  isAvailable: boolean;
  imageUrl?: string; // /products/{slug}.jpg — optional; UI falls back to a letter tile
}

/** A product joined to its supplier — the shape the search screen renders. */
export interface SearchHit {
  product: SupplierProduct;
  supplier: Supplier;
  pricePerBaseUnit: number; // pricePerPack / packQuantity
}

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "DELIVERED"
  | "REJECTED"
  | "CANCELLED";

export interface OrderItem {
  productId: string;
  nameKa: string;
  packLabel: string;
  baseUnit: BaseUnit;
  packQuantity: number;
  pricePerPack: number;
  packs: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface OrderEvent {
  at: string; // display label, e.g. "დღეს, 15:40" or "2 სექ. 09:12"
  label: string; // "შეკვეთა განთავსდა"
  status: OrderStatus;
}

export interface Order {
  id: string;
  number: string; // "2026-0431"
  buyerId: string;
  buyerName: string;
  buyerTaxId: string;
  supplierId: string;
  supplierName: string;
  deliveryAddress: string;
  requestedDate: string; // "ხვალ, 4 სექ."
  note?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  events: OrderEvent[];
  createdAt: number; // sort key
}

export interface CartLine {
  productId: string;
  packs: number;
}
