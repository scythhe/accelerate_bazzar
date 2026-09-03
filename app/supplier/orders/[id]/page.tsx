"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Sheet } from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { OrderDetailBody } from "@/components/screens/OrderDetail";
import { useDemo } from "@/lib/store/DemoContext";

export default function SupplierOrderDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { persona, orders, confirmOrder, rejectOrder } = useDemo();

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  const order = orders.find((o) => o.id === id);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const confirm = () => {
    if (!order) return;
    confirmOrder(order.id);
    router.push("/");
  };

  const reject = () => {
    if (!order) return;
    rejectOrder(order.id, reason.trim() || "მიზეზი მითითებული არ არის");
    setRejecting(false);
    router.push("/");
  };

  return (
    <Screen>
      <BackLink href="/" children="შემოსული" />
      {order ? (
        <>
          <OrderDetailBody order={order} showBuyer />

          {order.status === "PLACED" && (
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={confirm}>
                დადასტურება
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setRejecting(true)}
              >
                უარყოფა
              </Button>
            </div>
          )}

          <Sheet
            open={rejecting}
            onClose={() => setRejecting(false)}
            title="შეკვეთის უარყოფა"
            description={`№${order.number} · ${order.buyerName}`}
            footer={
              <>
                <Button
                  variant="secondary"
                  onClick={() => setRejecting(false)}
                >
                  გაუქმება
                </Button>
                <Button variant="destructive" onClick={reject}>
                  უარყოფა
                </Button>
              </>
            }
          >
            <p className="text-body text-ink">
              მიზეზი გადაეცემა შემკვეთს. ეს მოქმედება შეუქცევადია.
            </p>
            <div className="mt-4">
              <Input
                label="მიზეზი"
                placeholder="მაგ. მარაგი ამოიწურა"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </Sheet>
        </>
      ) : (
        <p className="py-10 text-center text-small text-ink-2">
          შეკვეთა ვერ მოიძებნა.
        </p>
      )}
    </Screen>
  );
}
