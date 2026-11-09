"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableRow, Thumb, cn, gel } from "@/components/ui";
import { BackLink, PRODUCT_GRID, Screen } from "@/components/screens/Screen";
import { AddButton, LineQty, MetaLine, unitLabel } from "@/components/screens/ProductQty";
import { NewsIcon, StoreIcon } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { supplierById } from "@/lib/mock/data";
import type { CatalogueNews } from "@/lib/mock/types";

type Filter = "all" | CatalogueNews["kind"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "ყველა" },
  { value: "NEW_PRODUCT", label: "ახალი პროდუქტები" },
  { value: "PRICE_CHANGE", label: "ფასები" },
];

// What every distributor changed, newest first: a new line on their list or a
// price that moved. Each row can be ordered from right here, so a price drop is
// one tap from the cart.
export default function NewsPage() {
  const router = useRouter();
  const {
    persona,
    news,
    markNewsSeen,
    getProduct,
    isAvailable,
    getPacks,
    removedProductIds,
  } = useDemo();
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  useEffect(() => {
    markNewsSeen();
  }, [markNewsSeen, news.length]);

  const feed = useMemo(
    () =>
      news
        .filter(
          (n) =>
            !removedProductIds.includes(n.productId) &&
            (filter === "all" || n.kind === filter),
        )
        .sort((a, b) => b.createdAt - a.createdAt),
    [news, removedProductIds, filter],
  );

  return (
    <Screen>
      <BackLink href="/" children="მთავარი" />
      <h1 className="text-h2 text-ink">სიახლეები</h1>
      <p className="mt-1 text-small text-ink-2">
        ახალი პროდუქტები და შეცვლილი ფასები ყველა მომწოდებლისგან.
      </p>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "h-10 shrink-0 rounded-full border px-4 text-small transition-colors",
              filter === f.value
                ? "border-accent bg-accent-soft font-medium text-accent"
                : "border-line-strong bg-paper text-ink-2 hover:bg-surface-hover",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {feed.length === 0 ? (
        <div className="mt-3 card px-4 py-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink-3">
            <NewsIcon className="h-6 w-6" />
          </span>
          <p className="mt-3 text-strong text-ink">სიახლეები ჯერ არ არის</p>
        </div>
      ) : (
        <div className={cn(PRODUCT_GRID, "mt-3")}>
          {feed.map((n) => {
            const product = getProduct(n.productId);
            if (!product) return null;
            const supplier = supplierById(n.supplierId);
            const available = isAvailable(product);
            const inCart = getPacks(product.id) > 0;
            return (
              <TableRow
                key={n.id}
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
                meta2={<NewsLabel news={n} />}
                price={gel(n.price)}
                perUnit={
                  n.oldPrice != null ? (
                    <span className="line-through">{gel(n.oldPrice)}</span>
                  ) : (
                    unitLabel(product)
                  )
                }
                unavailable={!available}
                action={
                  available && !inCart ? (
                    <AddButton product={product} />
                  ) : undefined
                }
                footer={
                  available && inCart ? <LineQty product={product} /> : undefined
                }
              />
            );
          })}
        </div>
      )}
    </Screen>
  );
}

function NewsLabel({ news }: { news: CatalogueNews }) {
  if (news.kind === "NEW_PRODUCT") {
    return (
      <>
        <span className="font-medium text-accent">ახალი პროდუქტი</span> ·{" "}
        {news.at}
      </>
    );
  }
  const dropped = news.price < (news.oldPrice ?? news.price);
  return (
    <>
      <span className={cn("font-medium", dropped ? "text-ok" : "text-warn")}>
        {dropped ? "ფასი დაიკლო" : "ფასი მოიმატა"}
      </span>{" "}
      · {news.at}
    </>
  );
}
