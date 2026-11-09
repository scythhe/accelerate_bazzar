"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownFilter, TableRow, Thumb, cn, gel } from "@/components/ui";
import { Band, PRODUCT_GRID, Screen } from "@/components/screens/Screen";
import { StoreIcon, TruckIcon } from "@/components/screens/Glyphs";
import { AddButton, LineQty, MetaLine, unitLabel } from "@/components/screens/ProductQty";
import { SearchBox } from "@/components/screens/SearchBox";
import { apiSearch, type SearchResponse } from "@/lib/mock/api";
import { groupCart } from "@/lib/cart";
import { HOME_CATEGORIES } from "@/lib/mock/data";
import { useDemo } from "@/lib/store/DemoContext";

const DISTRICTS = [
  "ვაკე",
  "საბურთალო",
  "ისანი",
  "გლდანი",
  "დიდუბე",
  "ვერა",
  "მთაწმინდა",
];

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

  const {
    persona,
    cart,
    deliveryAddress,
    getPacks,
    isAvailable,
    customProducts,
    removedProductIds,
  } = useDemo();
  const [res, setRes] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persona guard — a supplier should never be on a buyer screen mid-demo.
  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  // Results follow the box as you type, with no submit step. Replace, not push:
  // back should leave search, not rewind it a letter at a time.
  useEffect(() => {
    if (text.trim() === query) return;
    const t = setTimeout(() => {
      const q = text.trim();
      router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // The sidebar's category links change the URL from outside the box.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setText(query);
  }, [query]);

  // Search the district the order is going to; nothing else is actionable.
  const [district, setDistrict] = useState<string[]>([
    deliveryAddress.split(",")[0],
  ]);
  const [minFilter, setMinFilter] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    apiSearch(query, customProducts).then((r) => {
      if (alive) {
        setRes(r);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
    // customProducts intentionally excluded — a product added mid-search
    // shouldn't re-run the search out from under the buyer; re-search on the
    // next query change picks it up.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const hits = useMemo(() => {
    const maxMin = minFilter.length ? Number(minFilter[0]) : Infinity;
    return (res?.hits ?? []).filter(
      ({ product, supplier }) =>
        !removedProductIds.includes(product.id) &&
        (district.length === 0 ||
          (supplier.delivery.districts as string[]).includes(district[0])) &&
        supplier.delivery.minOrderValue <= maxMin,
    );
  }, [res, district, minFilter, removedProductIds]);

  const cheapestId = useMemo(() => {
    const available = hits
      .filter((h) => isAvailable(h.product))
      .sort((a, b) => a.pricePerBaseUnit - b.pricePerBaseUnit);
    return available[0]?.product.id ?? null;
  }, [hits, isAvailable]);

  // What each supplier in the cart still needs, shown on their rows so the
  // minimum surfaces here, while it's easy to fix, not as a surprise at the cart.
  const shortfalls = useMemo(
    () =>
      new Map(
        groupCart(cart, customProducts).map((g) => [g.supplier.id, g.shortfall]),
      ),
    [cart, customProducts],
  );

  // Only a first search blanks the list. Later ones keep the old rows up until
  // the new ones land, so typing doesn't strobe the screen.
  const showSkeleton = loading && !res;

  return (
    <Screen>
      <Band sticky>
        <SearchBox
          ref={inputRef}
          value={text}
          onChange={setText}
          onSubmit={(q) => setText(q)}
          onFocus={(e) => e.target.select()}
        />
      </Band>

      <div className="relative z-10 -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <DropdownFilter
          label="მიწოდება"
          activePrefix="მიწოდება"
          value={district}
          onChange={setDistrict}
          options={DISTRICTS.map((d) => ({ value: d, label: d }))}
        />
        <DropdownFilter
          label="მინ. შეკვეთა"
          value={minFilter}
          onChange={setMinFilter}
          options={[
            { value: "100", label: "100 ₾-მდე" },
            { value: "150", label: "150 ₾-მდე" },
            { value: "200", label: "200 ₾-მდე" },
          ]}
        />
        <span className="ml-auto shrink-0 pl-2 tabular text-small font-medium text-ink-2">
          {showSkeleton || !query ? "" : `${hits.length} შედეგი`}
        </span>
      </div>

      {!query ? (
        <div className="mt-6">
          <p className="text-strong text-ink">რას ეძებთ?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {HOME_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/search?q=${encodeURIComponent(c.query)}`}
                className="inline-flex h-11 items-center rounded-full border border-line-strong bg-paper px-5 text-strong text-ink transition-colors hover:bg-surface-hover"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className={cn(PRODUCT_GRID, "mt-3")}>
          {showSkeleton && <LoadingRows />}

          {!loading && res && hits.length === 0 && (
            <EmptyState
              query={query}
              suggestions={res.suggestions}
              filtered={res.hits.length > 0}
            />
          )}

          {!showSkeleton &&
            hits.map(({ product, supplier }) => {
              const available = isAvailable(product);
              const shortfall = shortfalls.get(supplier.id) ?? 0;
              return (
                <TableRow
                  key={product.id}
                  thumb={<Thumb src={product.imageUrl} name={product.nameKa} />}
                  title={product.nameKa}
                  meta1={
                    <MetaLine icon={StoreIcon}>
                      <Link
                        href={`/suppliers/${supplier.id}`}
                        className="text-ink-2 underline-offset-2 hover:text-accent hover:underline"
                      >
                        {supplier.displayName}
                      </Link>
                    </MetaLine>
                  }
                  meta2={
                    <MetaLine icon={TruckIcon}>
                      {shortfall > 0 ? (
                        <span className="font-medium text-warn">
                          {supplier.delivery.leadLabel} · აკლია {gel(shortfall)}
                        </span>
                      ) : (
                        `${supplier.delivery.leadLabel} · მინ. ${supplier.delivery.minOrderValue} ₾`
                      )}
                    </MetaLine>
                  }
                  price={gel(product.pricePerPack)}
                  perUnit={unitLabel(product)}
                  unavailable={!available}
                  bestPrice={product.id === cheapestId}
                  action={
                    available && getPacks(product.id) === 0 ? (
                      <AddButton product={product} />
                    ) : undefined
                  }
                  footer={
                    available && getPacks(product.id) > 0 ? (
                      <LineQty product={product} />
                    ) : undefined
                  }
                />
              );
            })}
        </div>
      )}
    </Screen>
  );
}

function LoadingRows() {
  return (
    <div aria-busy="true" aria-label="იტვირთება" className="contents">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="card flex min-h-[92px] items-center p-3"
        >
          <div className="mr-3 h-16 w-16 shrink-0 rounded bg-surface-hover" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3.5 w-2/5 rounded-sm bg-surface-hover" />
            <div className="h-3 w-3/5 rounded-sm bg-surface-hover" />
            <div className="h-2.5 w-2/5 rounded-sm bg-surface-hover" />
          </div>
          <div className="ml-2 h-4 w-14 rounded-sm bg-surface-hover" />
          <div className="ml-2 h-9 w-9 rounded bg-surface-hover" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  query,
  suggestions,
  filtered,
}: {
  query: string;
  suggestions: string[];
  filtered: boolean;
}) {
  return (
    <div className="col-span-full px-4 py-10 md:px-1">
      <p className="text-strong text-ink">
        {filtered
          ? "ამ ფილტრებით ვერაფერი მოიძებნა"
          : `„${query}“ — ვერაფერი მოიძებნა`}
      </p>
      <p className="mt-1 text-small text-ink-2">
        {filtered
          ? "სცადეთ სხვა რაიონი ან მოხსენით ფილტრი."
          : "სცადეთ სხვა სიტყვა, ან იხილეთ ახლომდებარე კატეგორიები:"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Link
            key={s}
            href={`/search?q=${encodeURIComponent(s)}`}
            className="inline-flex h-11 items-center rounded border border-line-strong bg-paper px-4 text-small text-ink transition-colors hover:bg-surface-hover"
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}
