"use client";

import Link from "next/link";
import { StatusDot, gel, cn } from "@/components/ui";
import { Band, Screen } from "./Screen";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, supplierById } from "@/lib/mock/data";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded bg-white/15 px-3 py-2.5 backdrop-blur-sm">
      <p className="text-micro text-white/85">{label}</p>
      <p className="tabular mt-0.5 text-h3">{value}</p>
    </div>
  );
}

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
      <Band image="/brand/supplier-warehouse.jpg">
        <h1 className="text-h1">{supplier.displayName}</h1>
        <div className="mt-4 grid max-w-2xl grid-cols-3 gap-2">
          <Stat label="ბრუნვა" value={gel(monthTotal)} />
          <Stat label="ახალი" value={newCount} />
          <Stat label="შეკვეთა" value={live.length} />
        </div>
      </Band>

      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-h3 text-ink">შემოსული შეკვეთები</h2>
        {newCount > 0 && (
          <span className="tabular text-small font-medium text-warn">
            {newCount} ახალი
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 min-[1700px]:grid-cols-3 min-[2200px]:grid-cols-4">
        {inbox.map((o) => {
          const isNew = o.status === "PLACED";
          const count = o.items.reduce((n, i) => n + i.packs, 0);
          return (
            <Link
              key={o.id}
              href={`/supplier/orders/${o.id}`}
              className={cn(
                "card block p-4 transition-shadow hover:shadow-lift",
                isNew && "!border-saffron ring-1 ring-saffron",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-title leading-[22px] text-ink">
                  {o.buyerName}
                </p>
                <span className="shrink-0 tabular text-price text-ink">
                  {gel(o.subtotal)}
                </span>
              </div>
              <p className="mt-1 truncate text-small text-ink-2">
                №{o.number} · {count} ერთეული · {o.requestedDate}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {isNew ? (
                  <span className="inline-flex items-center rounded-full bg-saffron px-2.5 py-0.5 text-micro font-semibold text-ink">
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
