"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Screen, BackLink } from "@/components/screens/Screen";
import { OrderListRow } from "@/components/screens/OrderListRow";
import { useDemo } from "@/lib/store/DemoContext";
import { BUYER } from "@/lib/mock/data";

export default function OrdersPage() {
  const router = useRouter();
  const { persona, orders } = useDemo();

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  const mine = orders
    .filter((o) => o.buyerId === BUYER.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Screen>
      <BackLink href="/" children="მთავარი" />
      <h1 className="text-h2 text-ink">შეკვეთები</h1>

      <div className="mt-3">
        {mine.length === 0 ? (
          <p className="py-10 text-center text-small text-ink-2">
            შეკვეთები ჯერ არ არის.
          </p>
        ) : (
          mine.map((o) => (
            <OrderListRow key={o.id} order={o} href={`/orders/${o.id}`} />
          ))
        )}
      </div>
    </Screen>
  );
}
