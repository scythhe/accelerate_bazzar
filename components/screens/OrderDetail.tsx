"use client";

import { LockSimple, Warning } from "@phosphor-icons/react";
import { StatusDot, Thumb, gel } from "@/components/ui";
import { OrderStatusStepper } from "./OrderStatusStepper";
import type { Order } from "@/lib/mock/types";

/** Shared body for buyer and supplier order-detail screens. */
export function OrderDetailBody({
  order,
  showBuyer = false,
}: {
  order: Order;
  showBuyer?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-h2 text-ink">№{order.number}</h1>
        <StatusDot status={order.status} />
      </div>
      <p className="mt-1 text-small text-ink-2">
        {showBuyer ? order.buyerName : order.supplierName} · {order.requestedDate}
      </p>

      {showBuyer && (
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small">
          <dt className="text-ink-3">ს/კ</dt>
          <dd className="tabular text-ink">{order.buyerTaxId}</dd>
          <dt className="text-ink-3">მისამართი</dt>
          <dd className="text-ink">{order.deliveryAddress}</dd>
        </dl>
      )}

      <section className="mt-5 card">
        <div className="divide-y divide-line">
          {order.items.map((it) => (
            <div
              key={it.productId}
              className="flex items-start gap-3 px-3 py-2.5"
            >
              <Thumb src={it.imageUrl} name={it.nameKa} className="mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-strong text-ink">{it.nameKa}</p>
                <p className="truncate text-small text-ink-2">
                  {it.packs} {it.baseUnit} × {gel(it.pricePerPack)}
                </p>
              </div>
              <span className="shrink-0 tabular text-strong text-ink">
                {gel(it.lineTotal)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-baseline justify-between border-t border-line px-3 py-2.5">
          <span className="text-strong text-ink">ჯამი</span>
          <span className="tabular text-h3 text-ink">{gel(order.subtotal)}</span>
        </div>
      </section>

      {order.note && (
        <p className="mt-3 text-small text-ink-2">
          <span className="text-ink-3">კომენტარი:</span> {order.note}
        </p>
      )}

      <section className="mt-6 card px-4 py-4">
        <h2 className="mb-4 text-micro text-ink-3">მიმდინარეობა</h2>
        <OrderStatusStepper order={order} />
        <p className="mt-4 border-t border-line pt-3 text-micro text-ink-3">
          ყოველი ცვლილება აქ ინახება — დავის შემთხვევაში ყოველთვის გაქვთ
          ჩანაწერი, ვინ რა შეცვალა და როდის.
        </p>
      </section>

      {/* The dispute-ledger promise above, made concrete: the actual entry a
          missing-item report or a receipt confirmation leaves behind. */}
      {(() => {
        const issue = [...order.events]
          .reverse()
          .find((e) => e.label.startsWith("ხარვეზი დაფიქსირდა"));
        const okConfirm = order.events.find((e) =>
          e.label.includes("ყველაფერი მიღებულია"),
        );
        if (issue) {
          return (
            <div className="mt-3 rounded border border-danger/30 bg-danger/5 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-small font-medium text-danger">
                <Warning weight="fill" aria-hidden="true" className="h-4 w-4 shrink-0" />
                {issue.label}
              </p>
              <p className="mt-0.5 text-micro text-ink-3">{issue.at}</p>
            </div>
          );
        }
        if (okConfirm) {
          return (
            <div className="mt-3 flex items-center gap-2 card px-3 py-2.5 text-small text-ink-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ok" aria-hidden />
              მიღება დადასტურებულია შემკვეთის მიერ · {okConfirm.at}
            </div>
          );
        }
        return null;
      })()}

      {/* Roadmap preview — not a working feature yet, named honestly as one. */}
      <div className="mt-3 flex items-center gap-2.5 rounded border border-dashed border-line px-3 py-2.5 text-ink-3">
        <LockSimple weight="duotone" aria-hidden="true" className="h-5 w-5 shrink-0" />
        <p className="text-small">
          მალე: ამ შეკვეთიდან ავტომატურად გენერირებული სასაქონლო ზედნადები
          (rs.ge).
        </p>
      </div>
    </>
  );
}
