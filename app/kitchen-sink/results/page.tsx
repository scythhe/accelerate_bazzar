"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  DropdownFilter,
  Stepper,
  TableRow,
  gel,
  gelPerUnit,
} from "@/components/ui";

/**
 * Density + price-column reference (DESIGN_SYSTEM.md §5). Twelve realistic rows
 * at varied prices — look down the price column: the decimal points must not
 * wander. Row: 14px vertical / 16px horizontal padding, 1px divider, no card.
 */

type Unit = "ცალი" | "კგ" | "ლ";

interface Result {
  id: string;
  name: string;
  supplier: string;
  pack: string;
  unit: Unit;
  pricePerPack: number;
  pricePerUnit: number;
  delivery: string;
  minOrder: number;
  unavailable?: boolean;
}

const RESULTS: Result[] = [
  {
    id: "eggs-c1",
    name: "კვერცხი C1",
    supplier: "აგრო ჯგუფი",
    pack: "თარო (30 ცალი)",
    unit: "ცალი",
    pricePerPack: 12.0,
    pricePerUnit: 0.4,
    delivery: "ხვალ 09:00-მდე",
    minOrder: 150,
  },
  {
    id: "eggs-c0",
    name: "კვერცხი C0, დიდი",
    supplier: "ფუდ ტრეიდი",
    pack: "თარო (30 ცალი)",
    unit: "ცალი",
    pricePerPack: 13.5,
    pricePerUnit: 0.45,
    delivery: "დღეს 14:00-მდე",
    minOrder: 200,
  },
  {
    id: "oil-5l",
    name: "მზესუმზირის ზეთი",
    supplier: "ოლიმპი დისტრიბუცია",
    pack: "ბიდონი 5 ლ",
    unit: "ლ",
    pricePerPack: 38.0,
    pricePerUnit: 7.6,
    delivery: "ხვალ 12:00-მდე",
    minOrder: 100,
  },
  {
    id: "oil-1l",
    name: "მზესუმზირის ზეთი",
    supplier: "გუდვილ",
    pack: "ბოთლი 1 ლ",
    unit: "ლ",
    pricePerPack: 8.2,
    pricePerUnit: 8.2,
    delivery: "ორშ 10:00-მდე",
    minOrder: 80,
  },
  {
    id: "onion",
    name: "ხახვი",
    supplier: "მწვანე ბაზარი",
    pack: "ტომარა 25 კგ",
    unit: "კგ",
    pricePerPack: 30.0,
    pricePerUnit: 1.2,
    delivery: "ხვალ 08:00-მდე",
    minOrder: 120,
  },
  {
    id: "potato",
    name: "კარტოფილი",
    supplier: "აგროფუდი",
    pack: "ტომარა 25 კგ",
    unit: "კგ",
    pricePerPack: 42.5,
    pricePerUnit: 1.7,
    delivery: "ხვალ 08:00-მდე",
    minOrder: 120,
  },
  {
    id: "cucumber-pickled",
    name: "კიტრი მწნილი",
    supplier: "კონსერვ ჰაუსი",
    pack: "ვედრო 10 კგ",
    unit: "კგ",
    pricePerPack: 45.0,
    pricePerUnit: 4.5,
    delivery: "ორშ 12:00-მდე",
    minOrder: 100,
  },
  {
    id: "sulguni",
    name: "სულგუნი",
    supplier: "ქართული ყველი",
    pack: "ბლოკი ~2 კგ",
    unit: "კგ",
    pricePerPack: 34.0,
    pricePerUnit: 17.0,
    delivery: "ხვალ 11:00-მდე",
    minOrder: 150,
  },
  {
    id: "butter",
    name: "კარაქი 82%",
    supplier: "მილკ ლაინი",
    pack: "ბლოკი 5 კგ",
    unit: "კგ",
    pricePerPack: 47.5,
    pricePerUnit: 9.5,
    delivery: "დღეს 15:00-მდე",
    minOrder: 180,
  },
  {
    id: "flour",
    name: "ფქვილი, უმაღლესი ხარისხი",
    supplier: "თბილისის წისქვილი",
    pack: "ტომარა 50 კგ",
    unit: "კგ",
    pricePerPack: 105.0,
    pricePerUnit: 2.1,
    delivery: "ხვალ 09:00-მდე",
    minOrder: 300,
  },
  {
    id: "sugar",
    name: "შაქარი",
    supplier: "იმპორტ ჯგუფი",
    pack: "ტომარა 50 კგ",
    unit: "კგ",
    pricePerPack: 130.0,
    pricePerUnit: 2.6,
    delivery: "ხვალ 09:00-მდე",
    minOrder: 300,
    unavailable: true,
  },
  {
    id: "chicken-fillet",
    name: "ქათმის ფილე",
    supplier: "პოულტრი პლიუსი",
    pack: "ყუთი 10 კგ",
    unit: "კგ",
    pricePerPack: 89.0,
    pricePerUnit: 8.9,
    delivery: "ხვალ 07:00-მდე",
    minOrder: 200,
  },
];

export default function ResultsPage() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<string[]>([]);
  const [district, setDistrict] = useState<string[]>(["vake"]);
  const [minOrder, setMinOrder] = useState<string[]>([]);

  const setRowQty = (id: string, n: number) =>
    setQty((prev) => ({ ...prev, [id]: n }));

  return (
    <main className="mx-auto max-w-[680px] px-4 pb-16 sm:px-8">
      <header className="flex items-baseline justify-between pt-4">
        <h1 className="text-h3 text-ink">ძებნის შედეგები</h1>
        <span className="text-small tabular text-ink-3">
          {RESULTS.length} შედეგი
        </span>
      </header>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
        {/* delivers-to-my-district filter defaults on (DESIGN_SYSTEM.md §5) */}
        <DropdownFilter
          label="კატეგორია"
          value={category}
          onChange={setCategory}
          options={[
            { value: "eggs", label: "კვერცხი" },
            { value: "veg", label: "ბოსტნეული" },
            { value: "dairy", label: "რძის ნაწარმი" },
            { value: "oil", label: "ზეთი" },
            { value: "bakery", label: "საცხობი" },
          ]}
        />
        <DropdownFilter
          label="მიწოდება"
          activePrefix="მიწოდება"
          value={district}
          onChange={setDistrict}
          options={[
            { value: "vake", label: "ვაკე" },
            { value: "saburtalo", label: "საბურთალო" },
            { value: "isani", label: "ისანი" },
            { value: "gldani", label: "გლდანი" },
          ]}
        />
        <DropdownFilter
          label="მინ. შეკვეთა"
          multiple
          value={minOrder}
          onChange={setMinOrder}
          options={[
            { value: "100", label: "100 ₾-მდე" },
            { value: "200", label: "200 ₾-მდე" },
            { value: "300", label: "300 ₾-მდე" },
          ]}
        />
      </div>

      <div className="mt-4 border-y border-line">
        {RESULTS.map((r) => {
          const n = qty[r.id] ?? 0;
          return (
            <TableRow
              key={r.id}
              title={r.name}
              meta1={`${r.supplier} · ${r.pack}`}
              meta2={`${r.delivery} · მინ. ${r.minOrder} ₾`}
              price={gel(r.pricePerPack)}
              perUnit={gelPerUnit(r.pricePerUnit, r.unit)}
              unavailable={r.unavailable}
              action={
                r.unavailable ? undefined : n === 0 ? (
                  <Button
                    variant="secondary"
                    onClick={() => setRowQty(r.id, 1)}
                    aria-label={`დამატება — ${r.name}`}
                    className="h-9 w-11 px-0 text-[18px] leading-none"
                  >
                    +
                  </Button>
                ) : (
                  <Stepper
                    value={n}
                    onChange={(v) => setRowQty(r.id, v)}
                    min={0}
                  />
                )
              }
            />
          );
        })}
      </div>

      <Link
        href="/kitchen-sink"
        className="mt-6 inline-flex h-8 items-center rounded border border-line-strong px-3 text-small text-ink-2 transition-colors hover:bg-surface-hover"
      >
        ← კომპონენტების გვერდი
      </Link>
    </main>
  );
}
