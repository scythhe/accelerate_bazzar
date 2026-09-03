"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Screen, BackLink } from "@/components/screens/Screen";
import { OrderDetailBody } from "@/components/screens/OrderDetail";
import { useDemo } from "@/lib/store/DemoContext";

export default function BuyerOrderDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { persona, orders } = useDemo();

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  const order = orders.find((o) => o.id === id);

  return (
    <Screen>
      <BackLink href="/orders" children="შეკვეთები" />
      {order ? (
        <OrderDetailBody order={order} />
      ) : (
        <p className="py-10 text-center text-small text-ink-2">
          შეკვეთა ვერ მოიძებნა.
        </p>
      )}
    </Screen>
  );
}
