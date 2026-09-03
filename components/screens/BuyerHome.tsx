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
      <p className="text-h2 tracking-tight text-ink">Accelerate</p>
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

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
        {HOME_CATEGORIES.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => go(c.query)}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded border border-line-strong bg-paper pl-2.5 pr-3 text-small text-ink-2 transition-colors hover:bg-surface-hover"
          >
            <CategoryIcon slug={c.slug} className="text-ink-3" />
            {c.label}
          </button>
        ))}
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
        <div className="mt-2">
          {recent.map((o) => (
            <OrderListRow key={o.id} order={o} href={`/orders/${o.id}`} />
          ))}
        </div>
      </section>
    </Screen>
  );
}
