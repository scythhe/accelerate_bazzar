"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusDot, Thumb, gel } from "@/components/ui";
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

  const reorder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    reorderItems(
      order.items.map((it) => ({ productId: it.productId, packs: it.packs })),
    );
    router.push("/cart");
  };

  return (
    <div className="flex items-center gap-2 border-b border-line py-3 last:border-b-0">
      <Link
        href={href}
        className="flex min-w-0 flex-1 items-center gap-3 rounded px-1 py-1 text-left transition-colors hover:bg-surface-hover"
      >
        {first && <Thumb src={first.imageUrl} name={first.nameKa} />}
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
      <button
        type="button"
        onClick={reorder}
        aria-label={`ხელახლა შეკვეთა — ${order.supplierName}`}
        title="ხელახლა შეკვეთა"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-2 transition-colors hover:bg-surface-hover hover:text-ink"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M13 8A5 5 0 1 1 11.5 4.3M13 2v3h-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
