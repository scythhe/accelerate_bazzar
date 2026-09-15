"use client";

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
      <div className="flex items-baseline justify-between">
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

      <section className="mt-5 rounded border border-line">
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
                  {it.packLabel} · {it.packs} × {gel(it.pricePerPack)}
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

      <section className="mt-6 rounded border border-line px-4 py-4">
        <h2 className="mb-4 text-micro text-ink-3">მიმდინარეობა</h2>
        <OrderStatusStepper order={order} />
      </section>
    </>
  );
}
