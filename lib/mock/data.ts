import type {
  CanonicalItem,
  Order,
  Supplier,
  SupplierProduct,
  Organization,
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

export const supplierById = (id: string) =>
  SUPPLIERS.find((s) => s.id === id) ??
  ({
    // fallback so a stale id never crashes the demo
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
// Canonical catalogue
// ---------------------------------------------------------------------------

export const CANONICAL_ITEMS: CanonicalItem[] = [
  {
    id: "can-eggs",
    category: "eggs",
    categoryLabel: "კვერცხი",
    nameKa: "ქათმის კვერცხი",
    baseUnit: "ცალი",
    searchTerms: [
      "კვერცხი",
      "კვერცხის",
      "კვერცხები",
      "კვ",
      "kvercxi",
      "kvertskhi",
      "kvercxi",
      "яйца",
      "яйцо",
      "egg",
      "eggs",
    ],
  },
  {
    id: "can-onion",
    category: "veg",
    categoryLabel: "ბოსტნეული",
    nameKa: "ხახვი",
    baseUnit: "კგ",
    searchTerms: [
      "ხახვი",
      "ხახვის",
      "khakhvi",
      "xaxvi",
      "лук",
      "onion",
      "onions",
    ],
  },
  {
    id: "can-potato",
    category: "veg",
    categoryLabel: "ბოსტნეული",
    nameKa: "კარტოფილი",
    baseUnit: "კგ",
    searchTerms: [
      "კარტოფილი",
      "კარტოფილის",
      "kartopili",
      "картофель",
      "potato",
      "potatoes",
    ],
  },
  {
    id: "can-pickle",
    category: "pickle",
    categoryLabel: "მწნილი",
    nameKa: "კიტრი მწნილი",
    baseUnit: "კგ",
    searchTerms: [
      "მწნილი",
      "მწნილის",
      "კიტრი მწნილი",
      "მარილწყალი",
      "mtsnili",
      "mwnili",
      "соленья",
      "огурцы",
      "pickle",
      "pickles",
      "pickled",
    ],
  },
  {
    id: "can-oil",
    category: "oil",
    categoryLabel: "ზეთი",
    nameKa: "მზესუმზირის ზეთი",
    baseUnit: "ლ",
    searchTerms: [
      "ზეთი",
      "ზეთის",
      "მზესუმზირის ზეთი",
      "მცენარეული ზეთი",
      "zeti",
      "zethi",
      "масло",
      "подсолнечное",
      "oil",
      "sunflower oil",
    ],
  },
  {
    id: "can-sulguni",
    category: "dairy",
    categoryLabel: "რძის ნაწარმი",
    nameKa: "სულგუნი",
    baseUnit: "კგ",
    searchTerms: [
      "სულგუნი",
      "სულგუნის",
      "ყველი",
      "sulguni",
      "сулугуни",
      "сыр",
      "cheese",
    ],
  },
];

export const canonicalById = (id: string) =>
  CANONICAL_ITEMS.find((c) => c.id === id);

// ---------------------------------------------------------------------------
// Supplier products
// ---------------------------------------------------------------------------

type EggSeed = {
  supplierId: string;
  nameKa: string;
  pricePerPack: number;
  available?: boolean;
};

const EGG_SEED: EggSeed[] = [
  { supplierId: "sup-agro", nameKa: "კვერცხი C1, თეთრი", pricePerPack: 12.0 },
  { supplierId: "sup-food", nameKa: "ქათმის კვერცხი C1", pricePerPack: 12.6 },
  { supplierId: "sup-gemo", nameKa: "კვერცხი C1", pricePerPack: 11.8 },
  { supplierId: "sup-natura", nameKa: "კვერცხი C0, შინაური", pricePerPack: 13.2 },
  { supplierId: "sup-lider", nameKa: "კვერცხი C1, ყავისფერი", pricePerPack: 12.4 },
  { supplierId: "sup-bio", nameKa: "კვერცხი C2", pricePerPack: 11.5 },
  {
    supplierId: "sup-fresh",
    nameKa: "კვერცხი C0, პრემიუმ",
    pricePerPack: 13.8,
    available: false,
  },
  { supplierId: "sup-kakhuri", nameKa: "ქათმის კვერცხი C1", pricePerPack: 12.1 },
];

const eggProducts: SupplierProduct[] = EGG_SEED.map((e, i) => ({
  id: `p-egg-${i + 1}`,
  supplierId: e.supplierId,
  canonicalItemId: "can-eggs",
  nameKa: e.nameKa,
  baseUnit: "ცალი",
  packLabel: "თარო (30 ცალი)",
  packQuantity: 30,
  pricePerPack: e.pricePerPack,
  isAvailable: e.available ?? true,
}));

const onionProducts: SupplierProduct[] = [
  ["sup-agro", "ხახვი, ყვითელი", 30.0],
  ["sup-gemo", "ხახვი", 27.5],
  ["sup-bio", "ხახვი, ადგილობრივი", 33.0],
  ["sup-kakhuri", "ხახვი, ყვითელი", 29.0],
].map(([supplierId, nameKa, price], i) => ({
  id: `p-onion-${i + 1}`,
  supplierId: supplierId as string,
  canonicalItemId: "can-onion",
  nameKa: nameKa as string,
  baseUnit: "კგ",
  packLabel: "ტომარა 25 კგ",
  packQuantity: 25,
  pricePerPack: price as number,
  isAvailable: true,
}));

const potatoProducts: SupplierProduct[] = [
  ["sup-agro", "კარტოფილი", 42.5],
  ["sup-natura", "კარტოფილი, ახალი", 46.0],
  ["sup-kakhuri", "კარტოფილი", 40.0],
].map(([supplierId, nameKa, price], i) => ({
  id: `p-potato-${i + 1}`,
  supplierId: supplierId as string,
  canonicalItemId: "can-potato",
  nameKa: nameKa as string,
  baseUnit: "კგ",
  packLabel: "ტომარა 25 კგ",
  packQuantity: 25,
  pricePerPack: price as number,
  isAvailable: true,
}));

const pickleProducts: SupplierProduct[] = [
  ["sup-gemo", "კიტრი მწნილი", 45.0],
  ["sup-kakhuri", "კიტრი მწნილი, კახური", 52.0],
  ["sup-food", "ჯონჯოლი და კიტრი, ასორტი", 48.0],
].map(([supplierId, nameKa, price], i) => ({
  id: `p-pickle-${i + 1}`,
  supplierId: supplierId as string,
  canonicalItemId: "can-pickle",
  nameKa: nameKa as string,
  baseUnit: "კგ",
  packLabel: "ვედრო 10 კგ",
  packQuantity: 10,
  pricePerPack: price as number,
  isAvailable: true,
}));

const oilProducts: SupplierProduct[] = [
  ["sup-food", "მზესუმზირის ზეთი", 38.0],
  ["sup-lider", "მზესუმზირის ზეთი, რაფინირებული", 40.5],
  ["sup-natura", "მზესუმზირის ზეთი", 36.0],
  ["sup-agro", "მზესუმზირის ზეთი", 41.0],
].map(([supplierId, nameKa, price], i) => ({
  id: `p-oil-${i + 1}`,
  supplierId: supplierId as string,
  canonicalItemId: "can-oil",
  nameKa: nameKa as string,
  baseUnit: "ლ",
  packLabel: "ბიდონი 5 ლ",
  packQuantity: 5,
  pricePerPack: price as number,
  isAvailable: true,
}));

const sulguniProducts: SupplierProduct[] = [
  ["sup-natura", "სულგუნი, საღორის რძის", 34.0],
  ["sup-bio", "სულგუნი, სოფლის", 38.0],
  ["sup-kakhuri", "სულგუნი", 32.5],
].map(([supplierId, nameKa, price], i) => ({
  id: `p-sulguni-${i + 1}`,
  supplierId: supplierId as string,
  canonicalItemId: "can-sulguni",
  nameKa: nameKa as string,
  baseUnit: "კგ",
  packLabel: "ბლოკი ~2 კგ",
  packQuantity: 2,
  pricePerPack: price as number,
  isAvailable: true,
}));

export const SUPPLIER_PRODUCTS: SupplierProduct[] = [
  ...eggProducts,
  ...onionProducts,
  ...potatoProducts,
  ...pickleProducts,
  ...oilProducts,
  ...sulguniProducts,
];

export const productById = (id: string) =>
  SUPPLIER_PRODUCTS.find((p) => p.id === id);

// ---------------------------------------------------------------------------
// Seed orders
// ---------------------------------------------------------------------------

const line = (
  productId: string,
  packs: number,
): Order["items"][number] => {
  const p = productById(productId)!;
  return {
    productId,
    nameKa: p.nameKa,
    packLabel: p.packLabel,
    baseUnit: p.baseUnit,
    packQuantity: p.packQuantity,
    pricePerPack: p.pricePerPack,
    packs,
    lineTotal: Math.round(p.pricePerPack * packs * 100) / 100,
  };
};

const sum = (items: Order["items"]) =>
  Math.round(items.reduce((t, i) => t + i.lineTotal, 0) * 100) / 100;

/** Fresh copy every call — resetDemo() relies on this not being mutated. */
export function seedOrders(): Order[] {
  const buyerRecent: Order[] = [
    (() => {
      const items = [line("p-potato-2", 4), line("p-onion-3", 1)];
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
      const items = [line("p-oil-2", 3), line("p-sulguni-1", 4)];
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
      const items = [line("p-egg-1", 15)];
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
      const items = [line("p-egg-1", 20), line("p-onion-1", 3)];
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
          {
            at: "1 სექ., 14:44",
            label: "დაადასტურე",
            status: "CONFIRMED",
          },
        ],
        createdAt: 700,
      };
    })(),
    (() => {
      const items = [line("p-egg-1", 12)];
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
          {
            at: "27 აგვ., 09:40",
            label: "დაადასტურე",
            status: "CONFIRMED",
          },
          { at: "28 აგვ., 11:20", label: "მიწოდებულია", status: "DELIVERED" },
        ],
        createdAt: 600,
      };
    })(),
  ];

  return [...buyerRecent, ...supplierInbox];
}

/** Category strip on the buyer home → the query each chip runs. */
export const HOME_CATEGORIES: { label: string; query: string }[] = [
  { label: "კვერცხი", query: "კვერცხი" },
  { label: "ბოსტნეული", query: "ხახვი" },
  { label: "ზეთი", query: "ზეთი" },
  { label: "რძის ნაწარმი", query: "სულგუნი" },
  { label: "მწნილი", query: "მწნილი" },
  { label: "ხორცი", query: "ქათმის ხორცი" },
];
