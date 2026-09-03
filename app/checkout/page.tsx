"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, gel } from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { useDemo } from "@/lib/store/DemoContext";
import { groupCart } from "@/lib/cart";
import { BUYER_ADDRESS } from "@/lib/mock/data";

const ADDRESSES = [
  { value: BUYER_ADDRESS, label: BUYER_ADDRESS },
  { value: "ისანი, ქინძმარაულის ქ. 3 (საწყობი)", label: "ისანი, ქინძმარაულის ქ. 3 (საწყობი)" },
];

const DATES = [
  { value: "ხვალ, 4 სექ.", label: "ხვალ, 4 სექ." },
  { value: "ზეგ, 5 სექ.", label: "ზეგ, 5 სექ." },
  { value: "6 სექ., პარასკევი", label: "6 სექ., პარასკევი" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { persona, cart, cartTotal, placeOrders } = useDemo();

  const groups = useMemo(() => groupCart(cart), [cart]);
  const placing = useRef(false);

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
    // don't bounce to /cart while we're clearing the cart to place the order
    else if (cart.length === 0 && !placing.current) router.replace("/cart");
  }, [persona, cart.length, router]);

  const [address, setAddress] = useState(ADDRESSES[0].value);
  const [date, setDate] = useState(DATES[0].value);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (groups.length === 0) return null;

  const submit = () => {
    placing.current = true;
    setSubmitting(true);
    placeOrders({ address, requestedDate: date, note });
    router.push("/order-placed");
  };

  return (
    <Screen>
      <BackLink href="/cart" children="კალათა" />
      <h1 className="text-h2 text-ink">გაფორმება</h1>

      <section className="mt-4 rounded border border-line">
        <header className="border-b border-line px-3 py-2.5 text-small text-ink-2">
          {groups.length} მომწოდებელი · {groups.length} ცალკე შეკვეთა
        </header>
        <div className="divide-y divide-line">
          {groups.map((g) => (
            <div
              key={g.supplier.id}
              className="flex items-center justify-between px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-strong text-ink">
                  {g.supplier.displayName}
                </p>
                <p className="truncate text-micro text-ink-3">
                  {g.lines.reduce((n, l) => n + l.packs, 0)} ერთეული
                </p>
              </div>
              <span className="shrink-0 tabular text-strong text-ink">
                {gel(g.subtotal)}
              </span>
            </div>
          ))}
        </div>
        <footer className="flex items-baseline justify-between border-t border-line px-3 py-2.5">
          <span className="text-strong text-ink">სულ</span>
          <span className="tabular text-h3 text-ink">{gel(cartTotal)}</span>
        </footer>
      </section>

      <div className="mt-6 space-y-5">
        <Select
          label="მიწოდების მისამართი"
          options={ADDRESSES}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Select
          label="სასურველი მიწოდების თარიღი"
          options={DATES}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          hint="თითოეული მომწოდებელი ადასტურებს დროს ცალკე."
        />
        <Input
          label="კომენტარი (არასავალდებულო)"
          placeholder="მაგ. მოიტანეთ უკანა შესასვლელთან"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button block className="mt-6" loading={submitting} onClick={submit}>
        {groups.length} შეკვეთის განთავსება
      </Button>
    </Screen>
  );
}
