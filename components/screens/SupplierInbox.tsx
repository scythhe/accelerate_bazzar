"use client";

import Link from "next/link";
import { StatusDot, gel, cn } from "@/components/ui";
import { Screen } from "./Screen";
import { SupplierNav } from "./SupplierNav";
import { BellIcon, CoinIcon, IconBadge, ReceiptIcon } from "./Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, supplierById } from "@/lib/mock/data";

// Supplier inbox — incoming orders, newest first, unconfirmed ones visually
// distinct (DEMO_PROMPT.md §7).
export function SupplierInbox() {
  const { orders } = useDemo();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);

  const inbox = orders
    .filter((o) => o.supplierId === SUPPLIER_PERSONA_ID)
    .sort((a, b) => b.createdAt - a.createdAt);

  const newCount = inbox.filter((o) => o.status === "PLACED").length;
  const live = inbox.filter(
    (o) => o.status !== "REJECTED" && o.status !== "CANCELLED",
  );
  const monthTotal = Math.round(live.reduce((t, o) => t + o.subtotal, 0) * 100) / 100;

  return (
    <Screen>
      <p className="text-h1 tracking-tight text-ink">Accelerate</p>
      <p className="mt-1 text-small text-ink-2">{supplier.displayName}</p>

      <SupplierNav />

      {/* KPI strip — a quick read on why the subscription is worth it. */}
      <div className="mt-4 flex items-center gap-3 rounded border border-line bg-paper px-4 py-3 shadow-card">
        <IconBadge hue={142}>
          <CoinIcon />
        </IconBadge>
        <div>
          <p className="text-micro text-ink-3">ამ თვის ბრუნვა</p>
          <p className="tabular mt-0.5 text-stat text-ink">{gel(monthTotal)}</p>
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-3 py-2.5 shadow-card">
          <IconBadge hue={32}>
            <BellIcon />
          </IconBadge>
          <div>
            <p className="text-micro text-ink-3">ახალი</p>
            <p className="tabular mt-0.5 text-h2 text-ink">{newCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-3 py-2.5 shadow-card">
          <IconBadge hue={216}>
            <ReceiptIcon />
          </IconBadge>
          <div>
            <p className="text-micro text-ink-3">შეკვეთა</p>
            <p className="tabular mt-0.5 text-h2 text-ink">{live.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <h1 className="text-h3 text-ink">შემოსული შეკვეთები</h1>
        {newCount > 0 && (
          <span className="tabular text-small text-warn">
            {newCount} ახალი
          </span>
        )}
      </div>

      <div className="mt-2 space-y-2">
        {inbox.map((o) => {
          const isNew = o.status === "PLACED";
          const count = o.items.reduce((n, i) => n + i.packs, 0);
          return (
            <Link
              key={o.id}
              href={`/supplier/orders/${o.id}`}
              className={cn(
                "block rounded border px-3 py-3 transition-colors",
                isNew
                  ? "border-accent bg-accent-soft shadow-card"
                  : "border-line hover:bg-surface-hover",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-strong text-ink">
                  {o.buyerName}
                </p>
                <span className="shrink-0 tabular text-price text-ink">
                  {gel(o.subtotal)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-small text-ink-2">
                №{o.number} · {count} ერთეული · {o.requestedDate}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                {isNew ? (
                  <span className="inline-flex items-center rounded-sm bg-accent px-1.5 py-px text-micro text-white">
                    ახალი — დასადასტურებელი
                  </span>
                ) : (
                  <StatusDot status={o.status} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </Screen>
  );
}
