"use client";

import Link from "next/link";
import { StatusDot, gel } from "@/components/ui";
import type { Order } from "@/lib/mock/types";

/** Compact order row for the buyer orders list and the home "recent" strip. */
export function OrderListRow({ order, href }: { order: Order; href: string }) {
  const count = order.items.reduce((n, i) => n + i.packs, 0);
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-line px-1 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-hover"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-strong text-ink">{order.supplierName}</p>
        <p className="mt-0.5 truncate text-small text-ink-2">
          №{order.number} · {count} ერთ. · {order.requestedDate}
        </p>
        <div className="mt-1">
          <StatusDot status={order.status} />
        </div>
      </div>
      <span className="shrink-0 tabular text-price text-ink">
        {gel(order.subtotal)}
      </span>
    </Link>
  );
}
