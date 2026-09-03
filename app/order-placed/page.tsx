"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusDot, gel } from "@/components/ui";
import { Screen } from "@/components/screens/Screen";
import { useDemo } from "@/lib/store/DemoContext";

export default function OrderPlacedPage() {
  const router = useRouter();
  const { persona, orders, lastPlacedIds } = useDemo();

  useEffect(() => {
    if (persona !== "buyer") {
      router.replace("/");
      return;
    }
    // tolerate the first paint arriving a tick before the placed ids commit
    if (lastPlacedIds.length === 0) {
      const t = setTimeout(() => router.replace("/"), 60);
      return () => clearTimeout(t);
    }
  }, [persona, lastPlacedIds.length, router]);

  const placed = orders.filter((o) => lastPlacedIds.includes(o.id));
  if (placed.length === 0) return null;

  return (
    <Screen>
      <div className="mt-6 flex flex-col items-center text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ok text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            <path
              d="m5 12 4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1 className="mt-3 text-h2 text-ink">
          შეიქმნა {placed.length} შეკვეთა
        </h1>
        <p className="mt-1 text-small text-ink-2">
          თითო მომწოდებელზე ცალკე. თითოეული ცალკე დაგიდასტურებთ.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {placed.map((o) => (
          <Link
            key={o.id}
            href={`/orders/${o.id}`}
            className="block rounded border border-line px-3 py-3 transition-colors hover:bg-surface-hover"
          >
            <div className="flex items-baseline justify-between">
              <p className="text-strong text-ink">{o.supplierName}</p>
              <span className="tabular text-price text-ink">
                {gel(o.subtotal)}
              </span>
            </div>
            <p className="mt-0.5 text-small text-ink-2">
              №{o.number} · {o.items.reduce((n, i) => n + i.packs, 0)} ერთეული ·{" "}
              {o.requestedDate}
            </p>
            <div className="mt-1.5">
              <StatusDot status={o.status} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <Link
          href="/orders"
          className="flex h-10 w-full items-center justify-center rounded bg-ink text-strong text-white"
        >
          შეკვეთების ნახვა
        </Link>
        <Link
          href="/"
          className="flex h-10 w-full items-center justify-center rounded border border-line-strong text-strong text-ink"
        >
          მთავარზე დაბრუნება
        </Link>
      </div>
    </Screen>
  );
}
