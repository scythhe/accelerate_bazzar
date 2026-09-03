"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Stepper, Thumb, gel } from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { useDemo } from "@/lib/store/DemoContext";
import { groupCart } from "@/lib/cart";

export default function CartPage() {
  const router = useRouter();
  const { persona, cart, setPacks, removeLine, cartTotal } = useDemo();

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  const groups = groupCart(cart);
  const anyShort = groups.some((g) => !g.meetsMinimum);

  return (
    <Screen>
      <BackLink href="/" children="მთავარი" />
      <h1 className="text-h2 text-ink">კალათა</h1>

      {groups.length === 0 ? (
        <div className="mt-8 rounded border border-line px-4 py-10 text-center">
          <p className="text-strong text-ink">კალათა ცარიელია</p>
          <p className="mt-1 text-small text-ink-2">
            იპოვეთ პროდუქტი ძებნით და დაამატეთ კალათაში.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex h-10 items-center rounded bg-ink px-4 text-strong text-white"
          >
            ძებნა
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-4">
            {groups.map((g) => (
              <section
                key={g.supplier.id}
                className="rounded border border-line"
              >
                <header className="flex items-baseline justify-between border-b border-line px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-strong text-ink">
                      {g.supplier.displayName}
                    </p>
                    <p className="truncate text-micro text-ink-3">
                      მინ. შეკვეთა {g.minOrderValue} ₾ ·{" "}
                      {g.supplier.delivery.leadLabel}{" "}
                      {g.supplier.delivery.cutoffLabel}
                    </p>
                  </div>
                </header>

                <div className="divide-y divide-line">
                  {g.lines.map((l) => (
                    <div
                      key={l.product.id}
                      className="flex items-start gap-3 px-3 py-3"
                    >
                      <Thumb
                        src={l.product.imageUrl}
                        name={l.product.nameKa}
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-title leading-[20px] text-ink">
                          {l.product.nameKa}
                        </p>
                        <p className="mt-0.5 truncate text-small text-ink-2">
                          {l.product.packLabel}
                        </p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <Stepper
                            value={l.packs}
                            onChange={(v) => setPacks(l.product.id, v)}
                            min={0}
                          />
                          <button
                            type="button"
                            onClick={() => removeLine(l.product.id)}
                            className="text-small text-ink-3 underline-offset-2 transition-colors hover:text-danger hover:underline"
                          >
                            წაშლა
                          </button>
                        </div>
                      </div>
                      <span className="shrink-0 pt-0.5 tabular text-price text-ink">
                        {gel(l.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <footer className="border-t border-line px-3 py-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-small text-ink-2">ჯამი</span>
                    <span className="tabular text-strong text-ink">
                      {gel(g.subtotal)}
                    </span>
                  </div>
                  {!g.meetsMinimum && (
                    <p className="mt-1.5 border-l-2 border-warn pl-2 text-small text-warn">
                      მინიმალურ შეკვეთამდე აკლია {gel(g.shortfall)} — დაამატეთ
                      კიდევ ამ მომწოდებლისგან.
                    </p>
                  )}
                </footer>
              </section>
            ))}
          </div>

          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-strong text-ink">სულ</span>
            <span className="tabular text-h3 text-ink">{gel(cartTotal)}</span>
          </div>

          <Button
            block
            className="mt-3"
            disabled={anyShort}
            onClick={() => router.push("/checkout")}
          >
            {anyShort ? "ვერ გააგრძელებთ — შეავსეთ მინიმუმი" : "გაგრძელება"}
          </Button>
          {anyShort && (
            <p className="mt-2 text-center text-small text-ink-3">
              ერთ-ერთი მომწოდებლის კალათა მინიმალურ შეკვეთაზე ნაკლებია.
            </p>
          )}
        </>
      )}
    </Screen>
  );
}
