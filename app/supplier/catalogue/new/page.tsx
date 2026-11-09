"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Select,
  Switch,
  Thumb,
  cn,
  gel,
} from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { useDemo, type NewProductInput } from "@/lib/store/DemoContext";
import {
  CANONICAL_ITEMS,
  HOME_CATEGORIES,
  SUPPLIER_PERSONA_ID,
  SUPPLIER_PRODUCTS,
} from "@/lib/mock/data";
import type { BaseUnit, CanonicalItem } from "@/lib/mock/types";

const UNITS: BaseUnit[] = ["ცალი", "კგ", "ლ"];
const OTHER_CATEGORY = "სხვა";

const norm = (s: string) => s.trim().toLowerCase();

function matchesItem(item: CanonicalItem, q: string): boolean {
  return (
    norm(item.nameKa).includes(q) ||
    item.searchTerms.some((t) => norm(t).startsWith(q))
  );
}

// How a distributor actually works: they start from what they stock, not from a
// blank form, and they add a whole list in one sitting. So a product is found in
// the shared catalogue (which supplies the name, unit and photo and makes it
// comparable in search at once), priced, and the form resets for the next one.
// Their full price list goes in through the Excel tab instead. Nothing here shows
// another supplier's prices (CLAUDE.md §8).
export default function NewProductPage() {
  const router = useRouter();
  const { persona, customProducts, removedProductIds } = useDemo();
  const [tab, setTab] = useState<"single" | "list">("single");

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  const ownedItemIds = useMemo(
    () =>
      new Set(
        [...SUPPLIER_PRODUCTS, ...customProducts]
          .filter(
            (p) =>
              p.supplierId === SUPPLIER_PERSONA_ID &&
              !removedProductIds.includes(p.id),
          )
          .map((p) => p.canonicalItemId),
      ),
    [customProducts, removedProductIds],
  );

  if (persona !== "supplier") return null;

  return (
    <Screen narrow>
      <BackLink href="/supplier/catalogue" children="კატალოგი" />
      <h1 className="text-h2 text-ink">პროდუქტის დამატება</h1>

      <div className="mt-3 grid grid-cols-2 gap-1 rounded border border-line-strong bg-paper p-1">
        {(
          [
            ["single", "ერთი პროდუქტი"],
            ["list", "ფასების სია (Excel)"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "h-10 rounded-sm px-2 text-small font-medium transition-colors",
              tab === value
                ? "bg-brand text-white"
                : "text-ink-2 hover:bg-surface-hover",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "single" ? (
        <SingleProduct ownedItemIds={ownedItemIds} />
      ) : (
        <PriceList ownedItemIds={ownedItemIds} />
      )}
    </Screen>
  );
}

type Picked = { item: CanonicalItem } | { newName: string };

function SingleProduct({ ownedItemIds }: { ownedItemIds: Set<string> }) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [addedCount, setAddedCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!picked) searchRef.current?.focus();
  }, [picked]);

  const q = norm(query);
  const matches = q
    ? CANONICAL_ITEMS.filter((c) => matchesItem(c, q)).slice(0, 8)
    : [];

  if (picked) {
    return (
      <ProductForm
        key={"item" in picked ? picked.item.id : picked.newName}
        picked={picked}
        onCancel={() => setPicked(null)}
        onSaved={() => {
          setAddedCount((n) => n + 1);
          setQuery("");
          setPicked(null);
        }}
      />
    );
  }

  return (
    <div className="mt-5">
      <Input
        ref={searchRef}
        label="რას ამატებთ?"
        placeholder="დაიწყეთ აკრეფა — მაგ. საფერავი, ხახვი"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        hint={
          addedCount > 0
            ? `ამ სესიაში დაემატა ${addedCount} პროდუქტი`
            : "იპოვეთ საერთო კატალოგში — სახელი, ერთეული და ფოტო შეივსება თავად."
        }
      />

      {q && (
        <div className="mt-3 divide-y divide-line overflow-hidden card">
          {matches.map((item) => {
            const owned = ownedItemIds.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={owned}
                onClick={() => setPicked({ item })}
                className="flex min-h-[80px] w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-hover disabled:hover:bg-transparent"
              >
                <span className={owned ? "opacity-55" : ""}>
                  <Thumb src={item.imageUrl} name={item.nameKa} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-strong",
                      owned ? "text-ink-3" : "text-ink",
                    )}
                  >
                    {item.nameKa}
                  </span>
                  <span className="block truncate text-small text-ink-2">
                    {item.categoryLabel} · {item.baseUnit}
                  </span>
                </span>
                {owned && (
                  <span className="shrink-0 text-small text-ink-3">
                    უკვე გაქვთ
                  </span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setPicked({ newName: query.trim() })}
            className="flex min-h-12 w-full items-center gap-2 px-3 py-2 text-left text-strong text-accent transition-colors hover:bg-surface-hover"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <span className="truncate">ახალი პროდუქტი — „{query.trim()}“</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  picked,
  onCancel,
  onSaved,
}: {
  picked: Picked;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const { addProducts } = useDemo();
  const item = "item" in picked ? picked.item : null;

  const [nameKa, setNameKa] = useState(
    item ? item.nameKa : (picked as { newName: string }).newName,
  );
  const [category, setCategory] = useState(HOME_CATEGORIES[0].label);
  const [unit, setUnit] = useState<BaseUnit>(item?.baseUnit ?? "ცალი");
  const [price, setPrice] = useState("");
  const [minQty, setMinQty] = useState("1");
  const [sku, setSku] = useState("");
  const [inStock, setInStock] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const priceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    priceRef.current?.focus();
  }, []);

  const priceValue = parseFloat(price.replace(",", "."));
  const priceOk = priceValue > 0;
  const minValue = parseInt(minQty, 10);
  const minOk = minValue >= 1;
  const valid = nameKa.trim() && priceOk && minOk;

  const save = (): boolean => {
    setSubmitted(true);
    if (!valid) return false;
    addProducts([
      {
        nameKa: nameKa.trim(),
        baseUnit: unit,
        pricePerUnit: Math.round(priceValue * 100) / 100,
        minQty: minValue,
        categoryLabel: item?.categoryLabel ?? category,
        sku: sku.trim() || undefined,
        canonicalItemId: item?.id,
        imageUrl: item?.imageUrl,
        inStock,
      },
    ]);
    return true;
  };

  return (
    <form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (save()) onSaved();
      }}
    >
      <div className="flex items-center gap-3 card px-3 py-2.5">
        <Thumb src={item?.imageUrl} name={nameKa || "?"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-strong text-ink">
            {item ? item.nameKa : "ახალი პროდუქტი"}
          </p>
          <p className="truncate text-small text-ink-2">
            {item
              ? `${item.categoryLabel} · ${item.baseUnit}`
              : "გადაიხედება და დაუკავშირდება საერთო კატალოგს"}
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          შეცვლა
        </Button>
      </div>

      <div className="mt-5 space-y-5">
        <Input
          label="დასახელება თქვენს სიაში"
          value={nameKa}
          onChange={(e) => setNameKa(e.target.value)}
          error={submitted && !nameKa.trim() ? "სახელი აუცილებელია" : undefined}
        />

        {!item && (
          <>
            <Select
              label="კატეგორია"
              options={[...HOME_CATEGORIES.map((c) => c.label), OTHER_CATEGORY].map(
                (c) => ({ value: c, label: c }),
              )}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <fieldset>
              <legend className="mb-2 text-strong text-ink">
                როგორ იყიდება
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {UNITS.map((u) => (
                  <button
                    key={u}
                    type="button"
                    aria-pressed={unit === u}
                    onClick={() => setUnit(u)}
                    className={cn(
                      "h-11 rounded border text-strong transition-colors",
                      unit === u
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line-strong bg-paper text-ink hover:bg-surface-hover",
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            ref={priceRef}
            label={`ფასი 1 ${unit}`}
            leading="₾"
            placeholder="0.00"
            numeric
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={submitted && !priceOk ? "მიუთითეთ ფასი" : undefined}
          />
          <Input
            label={`მინ. რაოდენობა (${unit})`}
            numeric
            inputMode="numeric"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value.replace(/\D/g, ""))}
            error={submitted && !minOk ? "მინიმუმ 1" : undefined}
          />
        </div>

        <Input
          label="თქვენი კოდი"
          placeholder="არასავალდებულო"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <div className="flex items-center justify-between gap-3 card px-3 py-3">
          <div>
            <p className="text-strong text-ink">მარაგშია</p>
            <p className="text-small text-ink-2">
              {inStock ? "მყიდველები ხედავენ ძებნაში" : "ჯერ არ ჩანს ძებნაში"}
            </p>
          </div>
          <Switch checked={inStock} onChange={setInStock} label="მარაგშია" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Button type="submit" block size="lg">
          შენახვა და შემდეგი
        </Button>
        <Button
          type="button"
          variant="secondary"
          block
          size="lg"
          onClick={() => {
            if (save()) router.push("/supplier/catalogue");
          }}
        >
          შენახვა და დასრულება
        </Button>
      </div>
    </form>
  );
}

const SAMPLE = [
  "კოდი\tდასახელება\tერთეული\tფასი\tმინ. რაოდენობა",
  "A-101\tარაყი, 0.5 ლ\tცალი\t13.20\t6",
  "A-102\tსოიოს სოუსი\tლ\t11.50\t5",
  "A-103\tჩილის სოუსი\tცალი\t6.80\t12",
  "A-104\tმარილი, ზღვის\tკგ\t\t10",
].join("\n");

interface ParsedRow {
  line: number;
  sku?: string;
  nameKa: string;
  unit?: BaseUnit;
  price: number;
  minQty: number;
  item?: CanonicalItem;
  error?: string;
  skipped?: string;
}

function parseUnit(raw: string): BaseUnit | undefined {
  const u = norm(raw).replace(/\.$/, "");
  if (["ცალი", "ც", "ცლ", "შტ", "ბოთლი", "ქილა"].includes(u)) return "ცალი";
  if (["კგ", "კილო", "კილოგრამი", "kg"].includes(u)) return "კგ";
  if (["ლ", "ლიტრი", "l"].includes(u)) return "ლ";
  return undefined;
}

/** Excel pastes as tab-separated; a saved CSV uses , or ;. Columns are either
 *  code, name, unit, price, with an optional minimum after it, or just name,
 *  unit, price. */
function parsePriceList(text: string, ownedItemIds: Set<string>): ParsedRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const sep = lines.some((l) => l.includes("\t"))
    ? "\t"
    : lines.some((l) => l.includes(";"))
      ? ";"
      : ",";

  const rows: ParsedRow[] = [];
  lines.forEach((text, i) => {
    const cells = text.split(sep).map((c) => c.trim());
    const [sku, nameKa, rawUnit, rawPrice, rawMin] =
      cells.length >= 4 ? cells : ["", ...cells];
    const price = parseFloat((rawPrice ?? "").replace(",", "."));
    // A first row with no number in the price column is the header.
    if (i === 0 && !(price > 0) && /ფასი|price/i.test(rawPrice ?? "")) return;

    const unit = parseUnit(rawUnit ?? "");
    const item = CANONICAL_ITEMS.find(
      (c) =>
        norm(c.nameKa) === norm(nameKa ?? "") ||
        c.searchTerms.some((t) => norm(t) === norm(nameKa ?? "")),
    );
    const row: ParsedRow = {
      line: i + 1,
      sku: sku || undefined,
      nameKa: nameKa ?? "",
      unit,
      price,
      minQty: parseInt(rawMin ?? "", 10) || 1,
      item,
    };
    if (!row.nameKa) row.error = "სახელი აკლია";
    else if (!unit) row.error = "ერთეული გაურკვეველია";
    else if (!(price > 0)) row.error = "ფასი აკლია";
    else if (item && ownedItemIds.has(item.id)) row.skipped = "უკვე გაქვთ";
    rows.push(row);
  });
  return rows;
}

function PriceList({ ownedItemIds }: { ownedItemIds: Set<string> }) {
  const router = useRouter();
  const { addProducts } = useDemo();
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(
    () => parsePriceList(text, ownedItemIds),
    [text, ownedItemIds],
  );
  const ready = rows.filter((r) => !r.error && !r.skipped);

  const onFile = async (file: File | undefined) => {
    if (file) setText(await file.text());
  };

  const submit = () => {
    const inputs: NewProductInput[] = ready.map((r) => ({
      nameKa: r.nameKa,
      baseUnit: r.unit!,
      pricePerUnit: Math.round(r.price * 100) / 100,
      minQty: r.minQty,
      categoryLabel: r.item?.categoryLabel ?? OTHER_CATEGORY,
      sku: r.sku,
      canonicalItemId: r.item?.id,
      imageUrl: r.item?.imageUrl,
      inStock: true,
    }));
    addProducts(inputs);
    router.push("/supplier/catalogue");
  };

  return (
    <div className="mt-5">
      <p className="text-small text-ink-2">
        მონიშნეთ სვეტები Excel-ში, დააკოპირეთ და ჩასვით აქ. რიგი:{" "}
        <span className="font-medium text-ink">
          კოდი, დასახელება, ერთეული, ფასი, მინ. რაოდენობა
        </span>
        . ფასი 1 ცალზე, კგ-ზე ან ლიტრზე.
      </p>

      <textarea
        aria-label="ფასების სია"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"A-101\tარაყი, 0.5 ლ\tცალი\t13.20\t6"}
        className="mt-3 h-36 w-full rounded border border-line-strong bg-paper px-3 py-2.5 font-sans text-body text-ink outline-none placeholder:text-ink-3 focus:border-ink"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.tsv,.txt"
          className="sr-only"
          aria-label="CSV ფაილი"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileRef.current?.click()}
        >
          CSV ფაილი
        </Button>
        <Button type="button" variant="ghost" onClick={() => setText(SAMPLE)}>
          ნიმუშის ჩასმა
        </Button>
      </div>

      {rows.length > 0 && (
        <>
          <div className="mt-5 divide-y divide-line overflow-hidden card">
            {rows.map((r) => (
              <div key={r.line} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-strong text-ink">
                    {r.nameKa || `რიგი ${r.line}`}
                  </p>
                  <p
                    className={cn(
                      "truncate text-small",
                      r.error ? "text-danger" : "text-ink-2",
                    )}
                  >
                    {r.error ??
                      r.skipped ??
                      (r.item ? "კატალოგს დაემთხვა" : "ახალი პროდუქტი")}
                    {r.sku ? ` · ${r.sku}` : ""}
                  </p>
                </div>
                {!r.error && (
                  <span className="shrink-0 tabular text-small font-medium text-ink">
                    {gel(r.price)} / {r.unit}
                    {r.minQty > 1 ? ` · მინ. ${r.minQty}` : ""}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            block
            size="lg"
            className="mt-4"
            disabled={ready.length === 0}
            onClick={submit}
          >
            {ready.length === 1
              ? "1 პროდუქტის დამატება"
              : `${ready.length} პროდუქტის დამატება`}
          </Button>
          {rows.length > ready.length && (
            <p className="mt-2 text-center text-small text-ink-3">
              {rows.length - ready.length} რიგი გამოტოვებული იქნება
            </p>
          )}
        </>
      )}
    </div>
  );
}
