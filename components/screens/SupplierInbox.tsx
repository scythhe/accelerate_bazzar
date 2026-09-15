"use client";

import Link from "next/link";
import { StatusDot, gel, cn } from "@/components/ui";
import { Screen } from "./Screen";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, SUPPLIER_PLAN, supplierById } from "@/lib/mock/data";

// Supplier inbox — incoming orders, newest first, unconfirmed ones visually
// distinct (DEMO_PROMPT.md §7).
export function SupplierInbox() {
  const { orders } = useDemo();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);

  const inbox = orders
    .filter((o) => o.supplierId === SUPPLIER_PERSONA_ID)
    .sort((a, b) => b.createdAt - a.createdAt);

  const newCount = inbox.filter((o) => o.status === "PLACED").length;

  return (
    <Screen>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-h2 tracking-tight text-ink">Accelerate</p>
          <p className="mt-1 text-small text-ink-2">{supplier.displayName}</p>
        </div>
        <Link
          href="/supplier/billing"
          className="mt-1 inline-flex h-8 shrink-0 items-center gap-1.5 rounded border border-line-strong bg-paper px-3 text-small text-ink-2 transition-colors hover:bg-surface-hover"
        >
          <span className="tabular">{gel(SUPPLIER_PLAN.monthlyPriceGel)}/თვე</span>
          <span className="text-ink-3">· გეგმა</span>
        </Link>
      </div>

      <div className="mt-5 flex items-baseline justify-between">
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
                  ? "border-accent bg-accent-soft"
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
