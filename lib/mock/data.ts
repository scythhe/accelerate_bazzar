import type {
  BaseUnit,
  CanonicalItem,
  CatalogueNews,
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
  id: "buy-alazani",
  type: "BUYER",
  legalName: "შპს ალაზანი",
  displayName: "რესტორანი ალაზანი",
  taxId: "205123456",
};

export const BUYER_ADDRESS = "ვაკე, ირ. აბაშიძის ქ. 24";

/** Saved delivery points. Each starts with its district, which is what search
 *  filters suppliers by. */
export const BUYER_ADDRESSES = [
  BUYER_ADDRESS,
  "ისანი, ქინძმარაულის ქ. 3 (საწყობი)",
];

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
  min?: number; // smallest order in base units; see minQtyFor
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
    min: 30,
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
    cat: "grains",
    catLabel: "ბურღულეული",
    nameKa: "ბრინჯი",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 78,
    spread: 3,
    terms: ["ბრინჯი", "brinji", "rice", "рис", "ბურღული"],
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
  // alcohol
  {
    slug: "wine-red",
    cat: "alcohol",
    catLabel: "ალკოჰოლი",
    nameKa: "ღვინო საფერავი, 0.75 ლ",
    unit: "ცალი",
    pack: P("ყუთი 6 ბოთლი", 6),
    base: 75,
    spread: 5,
    terms: ["ღვინო", "საფერავი", "ღვინო წითელი", "gvino", "wine", "вино"],
  },
  {
    slug: "wine-white",
    cat: "alcohol",
    catLabel: "ალკოჰოლი",
    nameKa: "ღვინო რქაწითელი, 0.75 ლ",
    unit: "ცალი",
    pack: P("ყუთი 6 ბოთლი", 6),
    base: 66,
    spread: 5,
    terms: ["ღვინო", "რქაწითელი", "ღვინო თეთრი", "gvino", "wine", "вино"],
  },
  {
    slug: "beer",
    cat: "alcohol",
    catLabel: "ალკოჰოლი",
    nameKa: "ლუდი ღია, 0.5 ლ",
    unit: "ცალი",
    pack: P("ყუთი 20 ბოთლი", 20),
    base: 56,
    spread: 6,
    terms: ["ლუდი", "ludi", "beer", "пиво"],
  },
  {
    slug: "vodka",
    cat: "alcohol",
    catLabel: "ალკოჰოლი",
    nameKa: "არაყი, 0.5 ლ",
    unit: "ცალი",
    pack: P("ყუთი 12 ბოთლი", 12),
    base: 160,
    spread: 4,
    terms: ["არაყი", "araki", "vodka", "водка"],
  },
  {
    slug: "chacha",
    cat: "alcohol",
    catLabel: "ალკოჰოლი",
    nameKa: "ჭაჭა, 0.5 ლ",
    unit: "ცალი",
    pack: P("ყუთი 6 ბოთლი", 6),
    base: 120,
    spread: 3,
    terms: ["ჭაჭა", "chacha", "чача"],
  },
  {
    slug: "cognac",
    cat: "alcohol",
    catLabel: "ალკოჰოლი",
    nameKa: "კონიაკი, 0.5 ლ",
    unit: "ცალი",
    pack: P("ყუთი 6 ბოთლი", 6),
    base: 186,
    spread: 3,
    terms: ["კონიაკი", "konyak", "cognac", "brandy", "коньяк"],
  },
  // hygiene
  {
    slug: "napkins",
    cat: "hygiene",
    catLabel: "ჰიგიენა",
    nameKa: "ქაღალდის ხელსახოცი, 100 ც.",
    unit: "ცალი",
    pack: P("ყუთი 30 შეკვრა", 30),
    base: 66,
    spread: 5,
    terms: ["ხელსახოცი", "სალფეთქი", "napkin", "tissue", "салфетки"],
  },
  {
    slug: "toilet-paper",
    cat: "hygiene",
    catLabel: "ჰიგიენა",
    nameKa: "ტუალეტის ქაღალდი",
    unit: "ცალი",
    pack: P("შეკვრა 48 რულონი", 48),
    base: 62,
    spread: 5,
    terms: ["ტუალეტის ქაღალდი", "ქაღალდი", "toilet paper", "туалетная бумага"],
  },
  {
    slug: "paper-towels",
    cat: "hygiene",
    catLabel: "ჰიგიენა",
    nameKa: "ქაღალდის პირსახოცი",
    unit: "ცალი",
    pack: P("შეკვრა 12 რულონი", 12),
    base: 48,
    spread: 4,
    terms: ["პირსახოცი", "ქაღალდი", "paper towel", "tissue", "бумажные полотенца"],
  },
  {
    slug: "wet-wipes",
    cat: "hygiene",
    catLabel: "ჰიგიენა",
    nameKa: "სველი ხელსახოცი, 72 ც.",
    unit: "ცალი",
    pack: P("ყუთი 24 შეკვრა", 24),
    base: 84,
    spread: 3,
    terms: ["სველი ხელსახოცი", "ხელსახოცი", "wet wipes", "tissue", "влажные салфетки"],
  },
  {
    slug: "liquid-soap",
    cat: "hygiene",
    catLabel: "ჰიგიენა",
    nameKa: "თხევადი საპონი",
    unit: "ლ",
    pack: P("ბიდონი 5 ლ", 5),
    base: 22,
    spread: 4,
    terms: ["საპონი", "sapnis", "soap", "мыло"],
  },
  {
    slug: "dish-soap",
    cat: "hygiene",
    catLabel: "ჰიგიენა",
    nameKa: "ჭურჭლის სარეცხი საშუალება",
    unit: "ლ",
    pack: P("ბიდონი 5 ლ", 5),
    base: 26,
    spread: 4,
    terms: ["ჭურჭლის სარეცხი", "სარეცხი", "dish soap", "detergent", "моющее средство"],
  },
  {
    slug: "gloves",
    cat: "hygiene",
    catLabel: "ჰიგიენა",
    nameKa: "ერთჯერადი ხელთათმანი, 100 ც.",
    unit: "ცალი",
    pack: P("ყუთი 10 კოლოფი", 10),
    base: 150,
    spread: 3,
    terms: ["ხელთათმანი", "gloves", "перчатки"],
  },
  // grains
  {
    slug: "buckwheat",
    cat: "grains",
    catLabel: "ბურღულეული",
    nameKa: "წიწიბურა",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 125,
    spread: 5,
    terms: ["წიწიბურა", "წიწიბურის", "buckwheat", "гречка"],
  },
  {
    slug: "lentils",
    cat: "grains",
    catLabel: "ბურღულეული",
    nameKa: "ოსპი",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 115,
    spread: 4,
    terms: ["ოსპი", "ospi", "lentils", "чечевица"],
  },
  {
    slug: "beans",
    cat: "grains",
    catLabel: "ბურღულეული",
    nameKa: "ლობიო, მშრალი",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 180,
    spread: 5,
    terms: ["ლობიო", "lobio", "beans", "фасоль"],
  },
  {
    slug: "ghomi",
    cat: "grains",
    catLabel: "ბურღულეული",
    nameKa: "ღომი",
    unit: "კგ",
    pack: P("ტომარა 10 კგ", 10),
    base: 42,
    spread: 3,
    terms: ["ღომი", "ghomi", "gomi", "millet", "гоми"],
  },
  {
    slug: "oats",
    cat: "grains",
    catLabel: "ბურღულეული",
    nameKa: "შვრიის ფანტელი",
    unit: "კგ",
    pack: P("ტომარა 10 კგ", 10),
    base: 38,
    spread: 3,
    terms: ["შვრია", "ფანტელი", "oats", "овсянка"],
  },
  {
    slug: "semolina",
    cat: "grains",
    catLabel: "ბურღულეული",
    nameKa: "მანანა",
    unit: "კგ",
    pack: P("ტომარა 25 კგ", 25),
    base: 72,
    spread: 3,
    terms: ["მანანა", "semolina", "манка"],
  },
  // sauces
  {
    slug: "tkemali",
    cat: "sauces",
    catLabel: "სოუსები",
    nameKa: "ტყემალი, 0.5 ლ",
    unit: "ცალი",
    pack: P("ყუთი 12 ბოთლი", 12),
    base: 60,
    spread: 5,
    terms: ["ტყემალი", "tkemali", "соус ткемали", "სოუსი"],
  },
  {
    slug: "adjika",
    cat: "sauces",
    catLabel: "სოუსები",
    nameKa: "აჯიკა, 0.25 ლ",
    unit: "ცალი",
    pack: P("ყუთი 12 ქილა", 12),
    base: 72,
    spread: 4,
    terms: ["აჯიკა", "ajika", "adjika", "аджика", "სოუსი"],
  },
  {
    slug: "ketchup",
    cat: "sauces",
    catLabel: "სოუსები",
    nameKa: "კეტჩუპი",
    unit: "კგ",
    pack: P("ვედრო 5 კგ", 5),
    base: 30,
    spread: 5,
    terms: ["კეტჩუპი", "ketchup", "кетчуп", "სოუსი"],
  },
  {
    slug: "mayonnaise",
    cat: "sauces",
    catLabel: "სოუსები",
    nameKa: "მაიონეზი",
    unit: "კგ",
    pack: P("ვედრო 5 კგ", 5),
    base: 36,
    spread: 5,
    terms: ["მაიონეზი", "mayonnaise", "майонез", "სოუსი"],
  },
  {
    slug: "mustard",
    cat: "sauces",
    catLabel: "სოუსები",
    nameKa: "მდოგვი, 0.5 კგ",
    unit: "ცალი",
    pack: P("ყუთი 12 ქილა", 12),
    base: 54,
    spread: 3,
    terms: ["მდოგვი", "mustard", "горчица", "სოუსი"],
  },
  {
    slug: "soy-sauce",
    cat: "sauces",
    catLabel: "სოუსები",
    nameKa: "სოიოს სოუსი",
    unit: "ლ",
    pack: P("ბიდონი 5 ლ", 5),
    base: 60,
    spread: 3,
    terms: ["სოიო", "სოიოს სოუსი", "soy sauce", "соевый соус", "სოუსი"],
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
  imageUrl: `/products/${s.slug}.jpg`,
}));

export const canonicalById = (id: string) =>
  CANONICAL_ITEMS.find((c) => c.id === id);

/** Enough to be worth a delivery without forcing a whole sack or case on a
 *  kitchen that has run out mid-service. */
function minQtyFor(s: Seed): number {
  return s.min ?? Math.min(s.pack.qty, s.unit === "ცალი" ? 6 : 5);
}

const built: SupplierProduct[] = [];
for (const s of SEEDS) {
  carriers(s).forEach((supIdx, k) => {
    const id = `p-${s.slug}-${supIdx}`;
    const name =
      s.variants && s.variants.length
        ? s.variants[k % s.variants.length]
        : s.nameKa;
    const imageUrl = `/products/${s.slug}.jpg`;
    built.push({
      id,
      supplierId: SUPPLIERS[supIdx].id,
      canonicalItemId: `can-${s.slug}`,
      nameKa: name,
      baseUnit: s.unit,
      // Listed and counted by the single piece, kg or litre, never the batch
      // it ships in: the seed's wholesale pack only sets the price.
      packLabel: `1 ${s.unit}`,
      packQuantity: 1,
      pricePerPack: Math.round((priceFor(s, supIdx) / s.pack.qty) * 100) / 100,
      minQty: minQtyFor(s),
      isAvailable: hash(`${id}:avail`) % 11 !== 0,
      imageUrl,
    });
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
// News feed — every supplier's recent catalogue changes.
// ---------------------------------------------------------------------------

const NEWS_LABELS = [
  "დღეს, 09:40",
  "დღეს, 08:15",
  "გუშინ, 17:30",
  "გუშინ, 11:05",
  "2 დღის წინ",
];

/** Fresh copy every call. createdAt stays below any real timestamp, so anything
 *  a supplier does live lands on top and counts as unread. */
export function seedNews(): CatalogueNews[] {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const out: CatalogueNews[] = [];
  const perRound = SUPPLIERS.length;

  for (let round = 0; round < 3; round++) {
    SUPPLIERS.forEach((s, i) => {
      const items = SUPPLIER_PRODUCTS.filter(
        (p) => p.supplierId === s.id && p.isAvailable,
      );
      if (items.length === 0) return;
      const p = items[(i * 5 + round * 7) % items.length];
      const label = Math.min(
        Math.floor((out.length / (perRound * 3)) * NEWS_LABELS.length),
        NEWS_LABELS.length - 1,
      );
      out.push({
        id: `n-seed-${s.id}-${round}`,
        supplierId: s.id,
        productId: p.id,
        kind: round === 0 ? "NEW_PRODUCT" : "PRICE_CHANGE",
        price: p.pricePerPack,
        oldPrice:
          round === 0
            ? undefined
            : round2(p.pricePerPack * (round === 1 ? 1.08 : 0.94)),
        at: NEWS_LABELS[label],
        createdAt: 500 - out.length,
      });
    });
  }
  return out;
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
  // Seed orders read as "4 sacks"; the line itself is counted in base units.
  const count = packs * (SEEDS.find((s) => s.slug === slug)?.pack.qty ?? 1);
  return {
    productId: p.id,
    nameKa: p.nameKa,
    packLabel: p.packLabel,
    baseUnit: p.baseUnit,
    packQuantity: p.packQuantity,
    pricePerPack: p.pricePerPack,
    packs: count,
    lineTotal: Math.round(p.pricePerPack * count * 100) / 100,
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
        line("orange", 2, "sup-natura"),
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

/** Category tiles on the buyer home — tile → the query it runs. */
export const HOME_CATEGORIES: {
  label: string;
  slug: string;
  query: string;
  image: string;
}[] = [
  { label: "ბოსტნეული", slug: "veg", query: "ბოსტნეული", image: "/products/onion.jpg" },
  { label: "ხილი", slug: "fruit", query: "ხილი", image: "/brand/cat-fruit.jpg" },
  { label: "კვერცხი", slug: "eggs", query: "კვერცხი", image: "/products/eggs.jpg" },
  { label: "რძის ნაწარმი", slug: "dairy", query: "რძის ნაწარმი", image: "/products/sulguni.jpg" },
  { label: "ხორცი", slug: "meat", query: "ხორცი", image: "/products/pork.jpg" },
  { label: "საცხობი", slug: "bakery", query: "საცხობი", image: "/brand/cat-bakery.jpg" },
  { label: "ბურღულეული", slug: "grains", query: "ბურღულეული", image: "/products/lentils.jpg" },
  { label: "ზეთი", slug: "oil", query: "ზეთი", image: "/products/oil-sunflower.jpg" },
  { label: "მწნილი", slug: "pickle", query: "მწნილი", image: "/products/pickle-cucumber.jpg" },
  { label: "სოუსები", slug: "sauces", query: "სოუსები", image: "/products/adjika.jpg" },
  { label: "ალკოჰოლი", slug: "alcohol", query: "ალკოჰოლი", image: "/products/wine-red.jpg" },
  { label: "ჰიგიენა", slug: "hygiene", query: "ჰიგიენა", image: "/products/paper-towels.jpg" },
];

// ---------------------------------------------------------------------------
// Subscription — CLAUDE.md §5: free for buyers always; suppliers free for the
// first months, then a flat monthly fee (not per-SKU, no commission ever),
// invoiced manually by bank transfer. No card data, no self-serve payment.
// ---------------------------------------------------------------------------

export const SUPPLIER_PLAN = {
  name: "საწყისი",
  monthlyPriceGel: 83,
  trialDays: 90,
  trialDaysLeft: 47,
  trialStartedLabel: "2 ივნისი",
};
