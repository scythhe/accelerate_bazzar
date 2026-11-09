"use client";

import Link from "next/link";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button, StatusDot, Thumb, gel } from "@/components/ui";
import { useDemo } from "@/lib/store/DemoContext";
import type { Order } from "@/lib/mock/types";

/** Compact order row for the buyer orders list and the home "recent" strip.
 *  Includes a one-tap reorder — the habit-forming shortcut that makes
 *  repeat use feel like less work than picking up the phone again. */
export function OrderListRow({ order, href }: { order: Order; href: string }) {
  const router = useRouter();
  const { reorderItems } = useDemo();
  const count = order.items.reduce((n, i) => n + i.packs, 0);
  const first = order.items[0];

  const reorder = () => {
    reorderItems(
      order.items.map((it) => ({ productId: it.productId, packs: it.packs })),
    );
    router.push("/cart");
  };

  return (
    <div className="card p-3 transition-shadow hover:shadow-lift">
      <Link
        href={href}
        className="flex items-center gap-3 rounded text-left"
      >
        {first && <Thumb src={first.imageUrl} name={first.nameKa} />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-strong text-ink">{order.supplierName}</p>
          <p className="truncate text-small text-ink-2">
            {count} ერთ. · {order.requestedDate}
          </p>
          <div className="mt-1">
            <StatusDot status={order.status} />
          </div>
        </div>
        <span className="shrink-0 tabular text-price text-ink">
          {gel(order.subtotal)}
        </span>
      </Link>
      <Button
        variant="secondary"
        block
        onClick={reorder}
        aria-label={`გამეორება — ${order.supplierName}`}
        className="mt-3"
      >
        <ArrowsClockwise weight="bold" aria-hidden="true" className="h-4 w-4 text-accent" />
        გამეორება
      </Button>
    </div>
  );
}
