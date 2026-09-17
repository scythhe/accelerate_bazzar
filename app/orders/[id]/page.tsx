"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Sheet } from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { OrderDetailBody } from "@/components/screens/OrderDetail";
import { useDemo } from "@/lib/store/DemoContext";

export default function BuyerOrderDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { persona, orders, reorderItems, confirmReceived, reportIssue } =
    useDemo();
  const [reporting, setReporting] = useState(false);
  const [issueNote, setIssueNote] = useState("");

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

  const responded = order?.events.some(
    (e) =>
      e.label.includes("ყველაფერი მიღებულია") ||
      e.label.startsWith("ხარვეზი დაფიქსირდა"),
  );

  const submitIssue = () => {
    if (!order) return;
    reportIssue(order.id, issueNote.trim() || "დეტალები არ არის მითითებული");
    setReporting(false);
    setIssueNote("");
  };

  return (
    <Screen>
      <BackLink href="/orders" children="შეკვეთები" />
      {order ? (
        <>
          <OrderDetailBody order={order} />

          {order.status === "DELIVERED" && !responded && (
            <section className="mt-6 rounded border border-line px-4 py-4">
              <p className="text-strong text-ink">ყველაფერი მოვიდა?</p>
              <p className="mt-1 text-small text-ink-2">
                დაადასტურეთ მიღება, ან მიუთითეთ, თუ რამე აკლია — ორივე
                შემთხვევაში ჩანაწერში რჩება.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => confirmReceived(order.id)}
                >
                  დიახ, ყველაფერი
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setReporting(true)}
                >
                  რაღაც აკლია
                </Button>
              </div>
            </section>
          )}

          <Button block size="lg" className="mt-6" onClick={reorder}>
            ხელახლა შეკვეთა
          </Button>
          <p className="mt-2 text-center text-small text-ink-2">
            იგივე პროდუქტები დღევანდელი ფასებით დაემატება კალათაში.
          </p>

          <Sheet
            open={reporting}
            onClose={() => setReporting(false)}
            title="რა აკლია ან არასწორია?"
            description={`№${order.number} · ${order.supplierName}`}
            footer={
              <>
                <Button variant="secondary" onClick={() => setReporting(false)}>
                  გაუქმება
                </Button>
                <Button variant="destructive" onClick={submitIssue}>
                  გაგზავნა
                </Button>
              </>
            }
          >
            <p className="text-body text-ink">
              მომწოდებელი დაუყოვნებლივ ნახავს ამ ჩანაწერს შეკვეთის გვერდზე.
            </p>
            <textarea
              className="mt-4 h-24 w-full rounded border border-line-strong bg-paper px-3 py-2.5 text-body text-ink outline-none placeholder:text-ink-3 focus-within:border-ink"
              placeholder="მაგ. 2 ყუთი კვერცხი აკლდა"
              value={issueNote}
              onChange={(e) => setIssueNote(e.target.value)}
            />
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
