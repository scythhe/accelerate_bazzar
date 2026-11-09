"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { StatusDot, gel } from "@/components/ui";
import { Screen } from "@/components/screens/Screen";
import { useDemo } from "@/lib/store/DemoContext";

export default function OrderPlacedPage() {
  const router = useRouter();
  const { persona, orders, lastPlacedIds, cartCount } = useDemo();

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
    <Screen narrow>
      <div className="mt-6 flex flex-col items-center text-center">
        <CheckCircle weight="fill" aria-hidden="true" className="h-16 w-16 text-ok" />
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
            className="block card px-3 py-3 transition-colors hover:bg-surface-hover"
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
        {cartCount > 0 && (
          <Link
            href="/cart"
            className="flex min-h-11 items-center justify-between gap-2 rounded bg-saffron-soft px-3 py-2 text-small text-warn"
          >
            <span>კალათაში დარჩა {cartCount} ერთეული</span>
            <span className="shrink-0 font-medium">გაგრძელება →</span>
          </Link>
        )}
        <Link
          href="/orders"
          className="flex h-11 w-full items-center justify-center rounded bg-brand text-strong text-white"
        >
          შეკვეთების ნახვა
        </Link>
        <Link
          href="/"
          className="flex h-11 w-full items-center justify-center rounded border border-line-strong bg-paper text-strong text-ink"
        >
          ახალი შეკვეთა
        </Link>
      </div>
    </Screen>
  );
}
