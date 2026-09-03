"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  DropdownFilter,
  Stepper,
  TableRow,
  gel,
  gelPerUnit,
} from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { apiSearch, type SearchResponse } from "@/lib/mock/api";
import { useDemo } from "@/lib/store/DemoContext";

export default function SearchPage() {
  return (
    <Suspense fallback={<Screen><LoadingRows /></Screen>}>
      <SearchInner />
    </Suspense>
  );
}

function SearchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  const { persona, getPacks, addOnePack, setPacks } = useDemo();
  const [res, setRes] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Persona guard — a supplier should never be on a buyer screen mid-demo.
  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  const [category, setCategory] = useState<string[]>([]);
  const [district, setDistrict] = useState<string[]>(["vake"]);
  const [minFilter, setMinFilter] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    apiSearch(query).then((r) => {
      if (alive) {
        setRes(r);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [query]);

  return (
    <Screen>
      <BackLink href="/" children="მთავარი" />

      <div className="flex items-baseline justify-between">
        <h1 className="text-h3 text-ink">
          {query ? `„${query}“` : "ძებნა"}
        </h1>
        <span className="tabular text-small text-ink-3">
          {loading ? "…" : `${res?.hits.length ?? 0} შედეგი`}
        </span>
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
        <DropdownFilter
          label="კატეგორია"
          value={category}
          onChange={setCategory}
          options={[
            { value: "eggs", label: "კვერცხი" },
            { value: "veg", label: "ბოსტნეული" },
            { value: "dairy", label: "რძის ნაწარმი" },
            { value: "oil", label: "ზეთი" },
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
          ]}
        />
        <DropdownFilter
          label="მინ. შეკვეთა"
          multiple
          value={minFilter}
          onChange={setMinFilter}
          options={[
            { value: "100", label: "100 ₾-მდე" },
            { value: "150", label: "150 ₾-მდე" },
            { value: "200", label: "200 ₾-მდე" },
          ]}
        />
      </div>

      <div className="mt-3 border-y border-line">
        {loading && <LoadingRows />}

        {!loading && res && res.hits.length === 0 && (
          <EmptyState query={query} suggestions={res.suggestions} />
        )}

        {!loading &&
          res?.hits.map(({ product, supplier, pricePerBaseUnit }) => {
            const packs = getPacks(product.id);
            return (
              <TableRow
                key={product.id}
                title={product.nameKa}
                meta1={`${supplier.displayName} · ${product.packLabel}`}
                meta2={`${supplier.delivery.leadLabel} ${supplier.delivery.cutoffLabel} · მინ. ${supplier.delivery.minOrderValue} ₾`}
                price={gel(product.pricePerPack)}
                perUnit={gelPerUnit(pricePerBaseUnit, product.baseUnit)}
                unavailable={!product.isAvailable}
                action={
                  !product.isAvailable ? undefined : packs === 0 ? (
                    <Button
                      variant="secondary"
                      aria-label={`დამატება — ${product.nameKa}`}
                      onClick={() => addOnePack(product.id)}
                      className="h-9 w-11 px-0 text-[18px] leading-none"
                    >
                      +
                    </Button>
                  ) : (
                    <Stepper
                      value={packs}
                      onChange={(v) => setPacks(product.id, v)}
                      min={0}
                    />
                  )
                }
              />
            );
          })}
      </div>
    </Screen>
  );
}

function LoadingRows() {
  return (
    <div aria-busy="true" aria-label="იტვირთება">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-line px-4 py-row-y last:border-b-0"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3.5 w-2/5 rounded-sm bg-surface-hover" />
            <div className="h-3 w-3/5 rounded-sm bg-surface-hover" />
            <div className="h-2.5 w-2/5 rounded-sm bg-surface-hover" />
          </div>
          <div className="h-4 w-14 rounded-sm bg-surface-hover" />
          <div className="h-9 w-11 rounded bg-surface-hover" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  query,
  suggestions,
}: {
  query: string;
  suggestions: string[];
}) {
  return (
    <div className="px-1 py-10">
      <p className="text-strong text-ink">
        „{query}“ — ვერაფერი მოიძებნა
      </p>
      <p className="mt-1 text-small text-ink-2">
        სცადეთ სხვა სიტყვა, ან იხილეთ ახლომდებარე კატეგორიები:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Link
            key={s}
            href={`/search?q=${encodeURIComponent(s)}`}
            className="inline-flex h-8 items-center rounded border border-line-strong bg-paper px-3 text-small text-ink transition-colors hover:bg-surface-hover"
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}
