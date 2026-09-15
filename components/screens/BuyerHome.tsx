"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui";
import { Screen } from "./Screen";
import { OrderListRow } from "./OrderListRow";
import { CategoryIcon, SearchIcon } from "./CategoryIcon";
import { useDemo } from "@/lib/store/DemoContext";
import { BUYER, HOME_CATEGORIES } from "@/lib/mock/data";

// Matches the hues baked into the generated product placeholder images
// (scripts/gen-product-images.mjs) so the tile badge and the thumbnails a tap
// away feel like one system.
const CATEGORY_HUE: Record<string, number> = {
  eggs: 44,
  veg: 132,
  fruit: 20,
  dairy: 208,
  meat: 4,
  bakery: 32,
  oil: 66,
  pickle: 92,
};

// Buyer home — the search field is the page. Below it a category strip and the
// two most recent orders (DEMO_PROMPT.md §1).
export function BuyerHome() {
  const router = useRouter();
  const { orders } = useDemo();
  const [q, setQ] = useState("");

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
      <p className="text-h1 tracking-tight text-ink">Accelerate</p>
      <p className="mt-1 text-small text-ink-2">{BUYER.displayName}</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
      >
        <Input
          aria-label="ძებნა"
          leading={<SearchIcon />}
          placeholder="ძებნა — მაგ. კვერცხი, ხახვი, ზეთი"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          enterKeyHint="search"
        />
        <button type="submit" className="sr-only">
          ძებნა
        </button>
      </form>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {HOME_CATEGORIES.map((c) => {
          const hue = CATEGORY_HUE[c.slug] ?? 0;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => go(c.query)}
              className="flex flex-col items-center gap-1.5 rounded-md border border-line bg-paper py-3 transition-colors hover:border-line-strong hover:bg-surface-hover"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `hsl(${hue} 55% 94%)`,
                  color: `hsl(${hue} 40% 38%)`,
                }}
              >
                <CategoryIcon slug={c.slug} />
              </span>
              <span className="text-micro leading-[13px] text-ink-2">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-h3 text-ink">ბოლო შეკვეთები</h2>
          <Link
            href="/orders"
            className="text-small text-ink-2 transition-colors hover:text-ink"
          >
            ყველა
          </Link>
        </div>
        <div className="mt-2 rounded border border-line px-1 shadow-card">
          {recent.map((o) => (
            <OrderListRow key={o.id} order={o} href={`/orders/${o.id}`} />
          ))}
        </div>
      </section>
    </Screen>
  );
}
