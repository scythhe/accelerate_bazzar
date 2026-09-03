import type {
  BaseUnit,
  CanonicalItem,
  Order,
  Organization,
  Supplier,
  SupplierProduct,
} from "./types";

// ---------------------------------------------------------------------------
// Organisations
// ---------------------------------------------------------------------------

/** The buyer persona. */
export const BUYER: Organization & { type: "BUYER" } = {
  id: "buy-octopus",
  type: "BUYER",
  legalName: "შპს ოქტოპუსი",
  displayName: "რესტორანი ოქტოპუსი",
  taxId: "205123456",
};

export const BUYER_ADDRESS = "ვაკე, ირ. აბაშიძის ქ. 24";

/** The supplier persona — orders placed in the demo land in this inbox. */
export const SUPPLIER_PERSONA_ID = "sup-agro";

export const SUPPLIERS: Supplier[] = [
  {
    id: "sup-agro",
    type: "SUPPLIER",
    legalName: "შპს აგრო ჯგუფი",
    displayName: "აგრო ჯგუფი",
    taxId: "404511072",
    delivery: {
      districts: ["ვაკე", "საბურთალო", "მთაწმინდა"],
      minOrderValue: 130,
      cutoffLabel: "16:00-მდე",
      leadLabel: "ხვალ",
    },
  },
  {
    id: "sup-food",
    type: "SUPPLIER",
    legalName: "შპს ფუდ ტრეიდი",
    displayName: "ფუდ ტრეიდი",
    taxId: "405288311",
    delivery: {
      districts: ["ვაკე", "ისანი", "დიდუბე"],
      minOrderValue: 100,
      cutoffLabel: "14:00-მდე",
      leadLabel: "ხვალ",
    },
  },
  {
    id: "sup-gemo",
    type: "SUPPLIER",
    legalName: "შპს გემო დისტრიბუცია",
    displayName: "გემო დისტრიბუცია",
    taxId: "412609548",
    delivery: {
      districts: ["ვაკე", "გლდანი", "დიდუბე"],
      minOrderValue: 90,
      cutoffLabel: "18:00-მდე",
      leadLabel: "ხვალ",
    },
  },
  {
    id: "sup-natura",
    type: "SUPPLIER",
    legalName: "შპს ნატურა პროდუქტი",
    displayName: "ნატურა პროდუქტი",
    taxId: "400199234",
    delivery: {
      districts: ["საბურთალო", "ვაკე", "ვერა"],
      minOrderValue: 150,
      cutoffLabel: "15:00-მდე",
      leadLabel: "ხვალ",
    },
  },
  {
    id: "sup-lider",
    type: "SUPPLIER",
    legalName: "შპს ლიდერ ფუდი",
    displayName: "ლიდერ ფუდი",
    taxId: "406122780",
    delivery: {
      districts: ["ვაკე", "ისანი"],
      minOrderValue: 120,
      cutoffLabel: "17:00-მდე",
      leadLabel: "ხვალ",
    },
  },
  {
    id: "sup-bio",
    type: "SUPPLIER",
    legalName: "შპს ბიო მარკეტი",
    displayName: "ბიო მარკეტი",
    taxId: "404877195",
    delivery: {
      districts: ["ვაკე", "ვერა", "მთაწმინდა"],
      minOrderValue: 80,
      cutoffLabel: "13:00-მდე",
      leadLabel: "ხვალ",
    },
  },
  {
    id: "sup-fresh",
    type: "SUPPLIER",
    legalName: "შპს თბილისი ფრეში",
    displayName: "თბილისი ფრეში",
    taxId: "401255609",
    delivery: {
      districts: ["ვაკე", "დიდუბე", "გლდანი"],
      minOrderValue: 200,
      cutoffLabel: "12:00-მდე",
      leadLabel: "ხვალ",
    },
  },
  {
    id: "sup-kakhuri",
    type: "SUPPLIER",
    legalName: "შპს კახური სურსათი",
    displayName: "კახური სურსათი",
    taxId: "434128866",
    delivery: {
      districts: ["ვაკე", "ისანი", "საბურთალო"],
      minOrderValue: 110,
      cutoffLabel: "16:00-მდე",
      leadLabel: "ხვალ",
    },
  },
];

export const supplierById = (id: string): Supplier =>
  SUPPLIERS.find((s) => s.id === id) ??
  ({
    id,
    type: "SUPPLIER",
    legalName: id,
    displayName: id,
    taxId: "—",
    delivery: {
      districts: ["ვაკე"],
      minOrderValue: 0,
      cutoffLabel: "—",
      leadLabel: "ხვალ",
    },
  } as Supplier);

// ---------------------------------------------------------------------------
// Catalogue seed — one line per canonical item. The builder below fans each out
// to `spread` suppliers with deterministic, genuinely different prices.
// ---------------------------------------------------------------------------

interface Pack {
  label: string;
  qty: number;
}
const P = (label: string, qty: number): Pack => ({ label, qty });

interface Seed {
  slug: string;
  cat: string;
  catLabel: string;
  nameKa: string;
  unit: BaseUnit;
  pack: Pack;
  base: number; // reference price per pack, GEL
  spread: number; // how many suppliers carry it
  terms: string[]; // extra search terms
  variants?: string[]; // supplier naming variants
  prices?: Record<number, number>; // pin specific supplier-index prices
}

const SEEDS: Seed[] = [
  // eggs — every supplier carries eggs; the demo pins the first three prices
  {
    slug: "eggs",
    cat: "eggs",
    catLabel: "კვერცხი",
    nameKa: "ქათმის კვერცხი C1",
    unit: "ცალი",
    pack: P("თარო (30 ცალი)", 30),
    base: 12,
    spread: 8,
    terms: ["კვერცხი", "კვერცხის", "kvercxi", "kvertskhi", "яйца", "egg", "eggs"],
    variants: [
      "კვერცხი C1, თეთრი",
      "ქათმის კვერცხი C1",
      "კვერცხი C1",
      "კვერცხი C0, შინაური",
      "კვერცხი C2, მსხვილი",
      "კვერცხი C1, ყავისფერი",
    ],
    prices: { 0: 12.0, 1: 12.6, 2: 11.8 },
  },

  // ბოსტნეული
  {
    slug: "onion",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "ხახვი",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 30,
    spread: 7,
    terms: ["ხახვი", "ხახვის", "onion", "лук"],
    variants: ["ხახვი, ყვითელი", "ხახვი", "ხახვი, ადგილობრივი", "ხახვი, წითელი"],
  },
  {
    slug: "potato",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "კარტოფილი",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 42,
    spread: 7,
    terms: ["კარტოფილი", "kartopili", "potato", "картофель"],
    variants: [
      "კარტოფილი",
      "კარტოფილი, ახალი",
      "კარტოფილი, სამარხვო",
      "კარტოფილი, მსხვილი",
    ],
  },
  {
    slug: "carrot",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "სტაფილო",
    unit: "კგ",
    pack: P("ტომარა 20 კგ", 20),
    base: 26,
    spread: 3,
    terms: ["სტაფილო", "stapilo", "carrot", "морковь"],
  },
  {
    slug: "cabbage",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "კომბოსტო",
    unit: "კგ",
    pack: P("ბადე 12 კგ", 12),
    base: 15,
    spread: 2,
    terms: ["კომბოსტო", "kombosto", "cabbage", "капуста"],
  },
  {
    slug: "tomato",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "პომიდორი",
    unit: "კგ",
    pack: P("ყუთი 10 კგ", 10),
    base: 34,
    spread: 3,
    terms: ["პომიდორი", "pomidori", "tomato", "помидоры"],
  },
  {
    slug: "cucumber",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "კიტრი",
    unit: "კგ",
    pack: P("ყუთი 10 კგ", 10),
    base: 30,
    spread: 2,
    terms: ["კიტრი", "kitri", "cucumber", "огурцы"],
  },
  {
    slug: "garlic",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "ნიორი",
    unit: "კგ",
    pack: P("ბადე 5 კგ", 5),
    base: 45,
    spread: 2,
    terms: ["ნიორი", "niori", "garlic", "чеснок"],
  },
  {
    slug: "greens",
    cat: "veg",
    catLabel: "ბოსტნეული",
    nameKa: "მწვანილი",
    unit: "კგ",
    pack: P("ყუთი 3 კგ", 3),
    base: 24,
    spread: 2,
    terms: ["მწვანილი", "mtsvanili", "greens", "herbs", "зелень"],
    variants: ["ოხრახუში და ქინძი", "მწვანილის ასორტი"],
  },

  // ხილი
  {
    slug: "apple",
    cat: "fruit",
    catLabel: "ხილი",
    nameKa: "ვაშლი",
    unit: "კგ",
    pack: P("ყუთი 13 კგ", 13),
    base: 33,
    spread: 3,
    terms: ["ვაშლი", "vashli", "apple", "яблоки"],
  },
  {
    slug: "lemon",
    cat: "fruit",
    catLabel: "ხილი",
    nameKa: "ლიმონი",
    unit: "კგ",
    pack: P("ყუთი 10 კგ", 10),
    base: 42,
    spread: 2,
    terms: ["ლიმონი", "limoni", "lemon", "лимоны"],
  },
  {
    slug: "banana",
    cat: "fruit",
    catLabel: "ხილი",
    nameKa: "ბანანი",
    unit: "კგ",
    pack: P("ყუთი 18 კგ", 18),
    base: 45,
    spread: 2,
    terms: ["ბანანი", "banani", "banana", "бананы"],
  },
  {
    slug: "orange",
    cat: "fruit",
    catLabel: "ხილი",
    nameKa: "ფორთოხალი",
    unit: "კგ",
    pack: P("ბადე 15 კგ", 15),
    base: 38,
    spread: 2,
    terms: ["ფორთოხალი", "portoxali", "orange", "апельсины"],
  },

  // რძის ნაწარმი
  {
    slug: "sulguni",
    cat: "dairy",
    catLabel: "რძის ნაწარმი",
    nameKa: "სულგუნი",
    unit: "კგ",
    pack: P("ბლოკი ~2 კგ", 2),
    base: 34,
    spread: 7,
    terms: ["სულგუნი", "ყველი", "sulguni", "сыр", "cheese"],
    variants: [
      "სულგუნი",
      "სულგუნი, საღორის რძის",
      "სულგუნი, სოფლის",
      "სულგუნი, შებოლილი",
    ],
  },
  {
    slug: "imeruli",
    cat: "dairy",
    catLabel: "რძის ნაწარმი",
    nameKa: "იმერული ყველი",
    unit: "კგ",
    pack: P("თავი ~1.5 კგ", 1.5),
    base: 26,
    spread: 3,
    terms: ["იმერული", "ყველი", "imeruli", "cheese"],
    variants: ["იმერული ყველი", "ყველი იმერული, ახალი"],
  },
  {
    slug: "butter",
    cat: "dairy",
    catLabel: "რძის ნაწარმი",
    nameKa: "კარაქი",
    unit: "კგ",
    pack: P("ბლოკი 1 კგ", 1),
    base: 22,
    spread: 3,
    terms: ["კარაქი", "karaqi", "butter", "масло"],
    variants: ["კარაქი 82%", "კარაქი, ფერმის"],
  },
  {
    slug: "matsoni",
    cat: "dairy",
    catLabel: "რძის ნაწარმი",
    nameKa: "მაწონი",
    unit: "ცალი",
    pack: P("ლანგარი (12 ცალი)", 12),
    base: 24,
    spread: 3,
    terms: ["მაწონი", "matsoni", "yogurt", "мацони"],
  },
  {
    slug: "smetana",
    cat: "dairy",
    catLabel: "რძის ნაწარმი",
    nameKa: "არაჟანი",
    unit: "კგ",
    pack: P("ვედრო 5 კგ", 5),
    base: 30,
    spread: 2,
    terms: ["არაჟანი", "arajani", "sour cream", "сметана"],
  },
  {
    slug: "xacho",
    cat: "dairy",
    catLabel: "რძის ნაწარმი",
    nameKa: "ხაჭო",
    unit: "კგ",
    pack: P("ვედრო 5 კგ", 5),
    base: 28,
    spread: 2,
    terms: ["ხაჭო", "xacho", "cottage", "творог"],
  },
  {
    slug: "milk",
    cat: "dairy",
    catLabel: "რძის ნაწარმი",
    nameKa: "რძე",
    unit: "ლ",
    pack: P("ყუთი (12 × 1 ლ)", 12),
    base: 30,
    spread: 3,
    terms: ["რძე", "rdze", "milk", "молоко"],
  },

  // ხორცი
  {
    slug: "chicken",
    cat: "meat",
    catLabel: "ხორცი",
    nameKa: "ქათმის ხორცი",
    unit: "კგ",
    pack: P("ყუთი 10 კგ", 10),
    base: 85,
    spread: 3,
    terms: ["ქათამი", "ქათმის ხორცი", "katami", "chicken", "курица"],
    variants: ["ქათმის ხორცი, მთლიანი", "ქათმის ბარკალი"],
  },
  {
    slug: "chicken-fillet",
    cat: "meat",
    catLabel: "ხორცი",
    nameKa: "ქათმის ფილე",
    unit: "კგ",
    pack: P("ყუთი 10 კგ", 10),
    base: 105,
    spread: 3,
    terms: ["ფილე", "ქათმის ფილე", "file", "fillet", "филе"],
  },
  {
    slug: "pork",
    cat: "meat",
    catLabel: "ხორცი",
    nameKa: "ღორის ხორცი",
    unit: "კგ",
    pack: P("ყუთი 15 კგ", 15),
    base: 130,
    spread: 3,
    terms: ["ღორის ხორცი", "ღორი", "gori", "pork", "свинина"],
  },
  {
    slug: "beef",
    cat: "meat",
    catLabel: "ხორცი",
    nameKa: "საქონლის ხორცი",
    unit: "კგ",
    pack: P("ყუთი 15 კგ", 15),
    base: 170,
    spread: 2,
    terms: ["საქონლის ხორცი", "saqonli", "beef", "говядина"],
  },

  // საცხობი / ბაზისი
  {
    slug: "flour",
    cat: "bakery",
    catLabel: "საცხობი",
    nameKa: "ფქვილი",
    unit: "კგ",
    pack: P("ტომარა 50 კგ", 50),
    base: 105,
    spread: 4,
    terms: ["ფქვილი", "ფქვილის", "pqvili", "flour", "мука"],
    variants: ["ფქვილი, უმაღლესი ხარისხი", "ფქვილი, პურის"],
  },
  {
    slug: "sugar",
    cat: "bakery",
    catLabel: "საცხობი",
    nameKa: "შაქარი",
    unit: "კგ",
    pack: P("ტომარა 50 კგ", 50),
    base: 130,
    spread: 3,
    terms: ["შაქარი", "shaqari", "sugar", "сахар"],
  },
  {
    slug: "salt",
    cat: "bakery",
    catLabel: "საცხობი",
    nameKa: "მარილი",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 20,
    spread: 3,
    terms: ["მარილი", "marili", "salt", "соль"],
  },
  {
    slug: "rice",
    cat: "bakery",
    catLabel: "საცხობი",
    nameKa: "ბრინჯი",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 78,
    spread: 3,
    terms: ["ბრინჯი", "brinji", "rice", "рис"],
  },
  {
    slug: "pasta",
    cat: "bakery",
    catLabel: "საცხობი",
    nameKa: "მაკარონი",
    unit: "კგ",
    pack: P("ყუთი 10 კგ", 10),
    base: 32,
    spread: 3,
    terms: ["მაკარონი", "makaroni", "pasta", "макароны"],
  },
  {
    slug: "yeast",
    cat: "bakery",
    catLabel: "საცხობი",
    nameKa: "საფუარი",
    unit: "კგ",
    pack: P("ყუთი 5 კგ", 5),
    base: 45,
    spread: 2,
    terms: ["საფუარი", "sapuari", "yeast", "дрожжи"],
  },

  // ზეთი / სოუსი
  {
    slug: "oil-sunflower",
    cat: "oil",
    catLabel: "ზეთი",
    nameKa: "მზესუმზირის ზეთი",
    unit: "ლ",
    pack: P("ბიდონი 5 ლ", 5),
    base: 38,
    spread: 7,
    terms: ["ზეთი", "ზეთის", "მზესუმზირის ზეთი", "zeti", "oil", "масло"],
    variants: ["მზესუმზირის ზეთი", "მზესუმზირის ზეთი, რაფინირებული"],
  },
  {
    slug: "oil-olive",
    cat: "oil",
    catLabel: "ზეთი",
    nameKa: "ზეითუნის ზეთი",
    unit: "ლ",
    pack: P("ბოთლი 1 ლ", 1),
    base: 28,
    spread: 3,
    terms: ["ზეითუნის ზეთი", "ზეთი", "olive oil", "оливковое"],
  },

  // მწნილი
  {
    slug: "pickle-cucumber",
    cat: "pickle",
    catLabel: "მწნილი",
    nameKa: "კიტრი მწნილი",
    unit: "კგ",
    pack: P("ვედრო 10 კგ", 10),
    base: 45,
    spread: 3,
    terms: ["მწნილი", "კიტრი მწნილი", "mtsnili", "pickle", "соленья"],
    variants: ["კიტრი მწნილი", "კიტრი მწნილი, კახური"],
  },
  {
    slug: "jonjoli",
    cat: "pickle",
    catLabel: "მწნილი",
    nameKa: "ჯონჯოლი",
    unit: "კგ",
    pack: P("ვედრო 5 კგ", 5),
    base: 42,
    spread: 3,
    terms: ["ჯონჯოლი", "მწნილი", "jonjoli", "pickle"],
  },
  {
    slug: "pickled-cabbage",
    cat: "pickle",
    catLabel: "მწნილი",
    nameKa: "კომბოსტო მწნილი",
    unit: "კგ",
    pack: P("ვედრო 10 კგ", 10),
    base: 30,
    spread: 2,
    terms: ["კომბოსტო მწნილი", "მწნილი", "pickled cabbage"],
  },
];

// ---------------------------------------------------------------------------
// Builder — deterministic so server and client render identically.
// ---------------------------------------------------------------------------

/** per-supplier price multiplier, aligned to SUPPLIERS index */
const FACTOR = [1.0, 1.05, 0.95, 1.09, 1.02, 0.92, 1.12, 0.985];

function hash(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}

function priceFor(seed: Seed, supIdx: number): number {
  const pinned = seed.prices?.[supIdx];
  if (pinned != null) return pinned;
  const jitter = ((hash(`${seed.slug}:${supIdx}`) % 13) - 6) / 100; // ±6%
  const raw = seed.base * FACTOR[supIdx] * (1 + jitter);
  if (seed.base < 10) return Math.round(raw * 10) / 10;
  if (seed.base < 30) return Math.round(raw * 2) / 2;
  if (seed.base < 100) return Math.round(raw);
  return Math.round(raw / 5) * 5;
}

function carriers(seed: Seed): number[] {
  const start = hash(seed.slug) % SUPPLIERS.length;
  const n = Math.min(seed.spread, SUPPLIERS.length);
  return Array.from({ length: n }, (_, k) => (start + k) % SUPPLIERS.length);
}

export const CANONICAL_ITEMS: CanonicalItem[] = SEEDS.map((s) => ({
  id: `can-${s.slug}`,
  category: s.cat,
  categoryLabel: s.catLabel,
  nameKa: s.nameKa,
  baseUnit: s.unit,
  searchTerms: Array.from(new Set([s.nameKa, s.catLabel, s.cat, ...s.terms])),
}));

export const canonicalById = (id: string) =>
  CANONICAL_ITEMS.find((c) => c.id === id);

const built: SupplierProduct[] = [];
let _gi = 0;
for (const s of SEEDS) {
  carriers(s).forEach((supIdx, k) => {
    const id = `p-${s.slug}-${supIdx}`;
    const name =
      s.variants && s.variants.length
        ? s.variants[k % s.variants.length]
        : s.nameKa;
    // ~1 in 3 products carries no image_url at all → letter-tile fallback.
    const imageUrl = _gi % 3 === 0 ? undefined : `/products/${s.slug}.jpg`;
    built.push({
      id,
      supplierId: SUPPLIERS[supIdx].id,
      canonicalItemId: `can-${s.slug}`,
      nameKa: name,
      baseUnit: s.unit,
      packLabel: s.pack.label,
      packQuantity: s.pack.qty,
      pricePerPack: priceFor(s, supIdx),
      isAvailable: hash(`${id}:avail`) % 11 !== 0,
      imageUrl,
    });
    _gi++;
  });
}

export const SUPPLIER_PRODUCTS: SupplierProduct[] = built;

export const productById = (id: string) =>
  SUPPLIER_PRODUCTS.find((p) => p.id === id);

/** First product for a canonical slug, optionally from a specific supplier. */
function pickProduct(slug: string, supplierId?: string): SupplierProduct {
  const pool = SUPPLIER_PRODUCTS.filter(
    (p) => p.canonicalItemId === `can-${slug}`,
  );
  return (supplierId && pool.find((p) => p.supplierId === supplierId)) || pool[0];
}

// ---------------------------------------------------------------------------
// Seed orders
// ---------------------------------------------------------------------------

const line = (
  slug: string,
  packs: number,
  supplierId?: string,
): Order["items"][number] => {
  const p = pickProduct(slug, supplierId);
  return {
    productId: p.id,
    nameKa: p.nameKa,
    packLabel: p.packLabel,
    baseUnit: p.baseUnit,
    packQuantity: p.packQuantity,
    pricePerPack: p.pricePerPack,
    packs,
    lineTotal: Math.round(p.pricePerPack * packs * 100) / 100,
    imageUrl: p.imageUrl,
  };
};

const sum = (items: Order["items"]) =>
  Math.round(items.reduce((t, i) => t + i.lineTotal, 0) * 100) / 100;

/** Fresh copy every call — resetDemo() relies on this not being mutated. */
export function seedOrders(): Order[] {
  const buyerRecent: Order[] = [
    (() => {
      const items = [
        line("potato", 4, "sup-natura"),
        line("apple", 2, "sup-natura"),
      ];
      return {
        id: "o-seed-b1",
        number: "2026-0418",
        buyerId: BUYER.id,
        buyerName: BUYER.displayName,
        buyerTaxId: BUYER.taxId,
        supplierId: "sup-natura",
        supplierName: supplierById("sup-natura").displayName,
        deliveryAddress: BUYER_ADDRESS,
        requestedDate: "2 სექ., სამშ.",
        status: "CONFIRMED",
        items,
        subtotal: sum(items),
        events: [
          { at: "1 სექ., 16:24", label: "შეკვეთა განთავსდა", status: "PLACED" },
          {
            at: "1 სექ., 17:02",
            label: "მომწოდებელმა დაადასტურა",
            status: "CONFIRMED",
          },
        ],
        createdAt: 1_000,
      };
    })(),
    (() => {
      const items = [
        line("oil-sunflower", 3, "sup-lider"),
        line("sulguni", 4, "sup-lider"),
      ];
      return {
        id: "o-seed-b2",
        number: "2026-0412",
        buyerId: BUYER.id,
        buyerName: BUYER.displayName,
        buyerTaxId: BUYER.taxId,
        supplierId: "sup-lider",
        supplierName: supplierById("sup-lider").displayName,
        deliveryAddress: BUYER_ADDRESS,
        requestedDate: "29 აგვ., პარ.",
        status: "DELIVERED",
        items,
        subtotal: sum(items),
        events: [
          { at: "28 აგვ., 18:40", label: "შეკვეთა განთავსდა", status: "PLACED" },
          {
            at: "28 აგვ., 19:15",
            label: "მომწოდებელმა დაადასტურა",
            status: "CONFIRMED",
          },
          { at: "29 აგვ., 10:05", label: "მიწოდებულია", status: "DELIVERED" },
        ],
        createdAt: 900,
      };
    })(),
  ];

  const supplierInbox: Order[] = [
    (() => {
      const items = [line("eggs", 15, SUPPLIER_PERSONA_ID)];
      return {
        id: "o-seed-s1",
        number: "2026-0421",
        buyerId: "buy-litera",
        buyerName: "კაფე ლიტერა",
        buyerTaxId: "404123789",
        supplierId: SUPPLIER_PERSONA_ID,
        supplierName: supplierById(SUPPLIER_PERSONA_ID).displayName,
        deliveryAddress: "მთაწმინდა, ბესიკის ქ. 4",
        requestedDate: "ხვალ, 4 სექ.",
        status: "PLACED",
        items,
        subtotal: sum(items),
        events: [
          { at: "დღეს, 08:30", label: "შეკვეთა განთავსდა", status: "PLACED" },
        ],
        createdAt: 800,
      };
    })(),
    (() => {
      const items = [
        line("eggs", 20, SUPPLIER_PERSONA_ID),
        line("onion", 3, SUPPLIER_PERSONA_ID),
      ];
      return {
        id: "o-seed-s2",
        number: "2026-0417",
        buyerId: "buy-vera",
        buyerName: "სასტუმრო ვერა",
        buyerTaxId: "405990122",
        supplierId: SUPPLIER_PERSONA_ID,
        supplierName: supplierById(SUPPLIER_PERSONA_ID).displayName,
        deliveryAddress: "ვერა, კიაჩელის ქ. 8",
        requestedDate: "2 სექ., სამშ.",
        status: "CONFIRMED",
        items,
        subtotal: sum(items),
        events: [
          { at: "1 სექ., 14:10", label: "შეკვეთა განთავსდა", status: "PLACED" },
          { at: "1 სექ., 14:44", label: "დაადასტურე", status: "CONFIRMED" },
        ],
        createdAt: 700,
      };
    })(),
    (() => {
      const items = [line("eggs", 12, SUPPLIER_PERSONA_ID)];
      return {
        id: "o-seed-s3",
        number: "2026-0403",
        buyerId: "buy-mdinare",
        buyerName: "რესტორანი მდინარე",
        buyerTaxId: "402556301",
        supplierId: SUPPLIER_PERSONA_ID,
        supplierName: supplierById(SUPPLIER_PERSONA_ID).displayName,
        deliveryAddress: "საბურთალო, ყიფშიძის ქ. 15",
        requestedDate: "28 აგვ., ხუთ.",
        status: "DELIVERED",
        items,
        subtotal: sum(items),
        events: [
          { at: "27 აგვ., 09:12", label: "შეკვეთა განთავსდა", status: "PLACED" },
          { at: "27 აგვ., 09:40", label: "დაადასტურე", status: "CONFIRMED" },
          { at: "28 აგვ., 11:20", label: "მიწოდებულია", status: "DELIVERED" },
        ],
        createdAt: 600,
      };
    })(),
  ];

  return [...buyerRecent, ...supplierInbox];
}

/** Category strip on the buyer home — chip → the query it runs. */
export const HOME_CATEGORIES: { label: string; slug: string; query: string }[] = [
  { label: "კვერცხი", slug: "eggs", query: "კვერცხი" },
  { label: "ბოსტნეული", slug: "veg", query: "ბოსტნეული" },
  { label: "ხილი", slug: "fruit", query: "ხილი" },
  { label: "რძის ნაწარმი", slug: "dairy", query: "რძის ნაწარმი" },
  { label: "ხორცი", slug: "meat", query: "ხორცი" },
  { label: "მწნილი", slug: "pickle", query: "მწნილი" },
  { label: "ზეთი", slug: "oil", query: "ზეთი" },
  { label: "საცხობი", slug: "bakery", query: "საცხობი" },
];
