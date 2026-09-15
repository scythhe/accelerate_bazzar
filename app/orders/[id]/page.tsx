"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { OrderDetailBody } from "@/components/screens/OrderDetail";
import { useDemo } from "@/lib/store/DemoContext";

export default function BuyerOrderDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { persona, orders, reorderItems } = useDemo();

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  const order = orders.find((o) => o.id === id);

  const reorder = () => {
    if (!order) return;
    reorderItems(
      order.items.map((it) => ({ productId: it.productId, packs: it.packs })),
    );
    router.push("/cart");
  };

  return (
    <Screen>
      <BackLink href="/orders" children="შეკვეთები" />
      {order ? (
        <>
          <OrderDetailBody order={order} />
          <Button block size="lg" className="mt-6" onClick={reorder}>
            ხელახლა შეკვეთა
          </Button>
          <p className="mt-2 text-center text-small text-ink-2">
            იგივე პროდუქტები დღევანდელი ფასებით დაემატება კალათაში.
          </p>
        </>
      ) : (
        <p className="py-10 text-center text-small text-ink-2">
          შეკვეთა ვერ მოიძებნა.
        </p>
      )}
    </Screen>
  );
}
