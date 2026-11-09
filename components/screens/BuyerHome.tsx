"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Band, Screen } from "./Screen";
import { PinIcon } from "./Glyphs";
import { SearchBox } from "./SearchBox";
import { OrderListRow } from "./OrderListRow";
import { useDemo } from "@/lib/store/DemoContext";
import { BUYER, HOME_CATEGORIES } from "@/lib/mock/data";

// Buyer home — the search field is the page. Below it the two shortest ways to
// an order: repeat a recent one, or tap a category.
export function BuyerHome() {
  const router = useRouter();
  const { orders, deliveryAddress } = useDemo();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // A keyboard user gets straight to typing. Phones skip this: the on-screen
  // keyboard would cover the reorder list before they've chosen to search.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  const recent = orders
    .filter((o) => o.buyerId === BUYER.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 2);

  const go = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Screen>
      <Band image="/brand/hero-market.jpg">
        <h1 className="text-h1">{BUYER.displayName}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-body text-white/90">
          <PinIcon className="h-5 w-5" />
          <span className="truncate">{deliveryAddress}</span>
        </p>
        <div className="mt-5 max-w-2xl">
          <SearchBox ref={inputRef} value={q} onChange={setQ} onSubmit={go} suggest large />
        </div>
      </Band>

      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-h3 text-ink">შეუკვეთეთ ისევ</h2>
          <Link
            href="/orders"
            className="py-1 text-small font-medium text-accent transition-colors hover:text-brand"
          >
            ყველა
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {recent.map((o) => (
            <OrderListRow key={o.id} order={o} href={`/orders/${o.id}`} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-h3 text-ink">კატეგორიები</h2>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 md:gap-3">
          {HOME_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => go(c.query)}
              className="group relative aspect-[4/3] overflow-hidden rounded bg-surface-hover text-left shadow-card transition-shadow hover:shadow-lift"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
              />
              <span className="absolute inset-x-2 bottom-1.5 text-small font-semibold leading-tight text-white md:text-strong">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </Screen>
  );
}
