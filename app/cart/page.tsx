"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Input,
  Sheet,
  Stepper,
  Thumb,
  TrashButton,
  cn,
  gel,
} from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { BasketIcon, CalendarIcon, PinIcon } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { groupCart } from "@/lib/cart";
import { deliveryDates } from "@/lib/dates";
import { BUYER_ADDRESSES } from "@/lib/mock/data";

// Cart and checkout are one screen. Address, date and note all have sensible
// defaults, so reviewing the order and placing it is a single tap; changing
// any of them is the exception and lives behind "შეცვლა".
export default function CartPage() {
  const router = useRouter();
  const {
    persona,
    cart,
    setPacks,
    removeLine,
    customProducts,
    deliveryAddress,
    setDeliveryAddress,
    placeOrders,
  } = useDemo();

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  const groups = useMemo(
    () => groupCart(cart, customProducts),
    [cart, customProducts],
  );
  const dates = useMemo(() => deliveryDates(), []);

  const [date, setDate] = useState(dates[0]);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [placed, setPlaced] = useState(false);

  // One short supplier shouldn't hold up the others: what's ready goes now, the
  // rest waits in the cart.
  const ready = groups.filter((g) => g.meetsMinimum);
  const short = groups.filter((g) => !g.meetsMinimum);
  const shownTotal = (ready.length > 0 ? ready : groups).reduce(
    (t, g) => t + g.subtotal,
    0,
  );

  const submit = () => {
    setPlaced(true);
    placeOrders({
      address: deliveryAddress,
      requestedDate: date,
      note,
      supplierIds: ready.map((g) => g.supplier.id),
    });
    router.push("/order-placed");
  };

  if (placed) return null;

  return (
    <Screen className="!pb-44">
      <BackLink href="/" children="მთავარი" />
      <h1 className="text-h2 text-ink">კალათა</h1>

      {groups.length === 0 ? (
        <div className="mt-8 card px-4 py-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
            <BasketIcon className="h-8 w-8" />
          </span>
          <p className="mt-3 text-strong text-ink">კალათა ცარიელია</p>
          <p className="mt-1 text-small text-ink-2">
            იპოვეთ პროდუქტი ძებნით და დაამატეთ კალათაში.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex h-11 items-center rounded bg-brand px-4 text-strong text-white"
          >
            ძებნა
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2 min-[1700px]:grid-cols-3">
            {groups.map((g) => (
              <section
                key={g.supplier.id}
                className="card"
              >
                <header className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
                  <Avatar name={g.supplier.displayName} seed={g.supplier.id} />
                  <div className="min-w-0">
                    <Link
                      href={`/suppliers/${g.supplier.id}`}
                      className="block truncate text-strong text-ink underline-offset-2 hover:underline"
                    >
                      {g.supplier.displayName}
                    </Link>
                    <p className="truncate text-small text-ink-2">
                      {g.supplier.delivery.leadLabel} · შეკვეთა{" "}
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
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 min-w-0 text-strong leading-[20px] text-ink">
                            {l.product.nameKa}
                          </p>
                          <span className="shrink-0 tabular text-price leading-[20px] text-ink">
                            {gel(l.lineTotal)}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-small text-ink-2">
                          {gel(l.product.pricePerPack)} / {l.product.baseUnit}
                          {l.product.minQty > 1
                            ? ` · მინ. ${l.product.minQty}`
                            : ""}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <Stepper
                            value={l.packs}
                            onChange={(v) => setPacks(l.product.id, v)}
                            min={0}
                            minQty={l.product.minQty}
                            label={`რაოდენობა — ${l.product.nameKa}`}
                          />
                          <TrashButton
                            label={`წაშლა — ${l.product.nameKa}`}
                            onClick={() => removeLine(l.product.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="border-t border-line px-3 py-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-small text-ink-2">
                      ჯამი · მინ. {g.minOrderValue} ₾
                    </span>
                    <span className="tabular text-strong text-ink">
                      {gel(g.subtotal)}
                    </span>
                  </div>
                  {!g.meetsMinimum && (
                    <Link
                      href={`/suppliers/${g.supplier.id}`}
                      className="mt-2 flex min-h-11 items-center justify-between gap-2 rounded bg-saffron-soft px-3 py-2 text-small text-warn"
                    >
                      <span>მინიმუმამდე აკლია {gel(g.shortfall)}</span>
                      <span className="shrink-0 font-medium">დამატება →</span>
                    </Link>
                  )}
                </footer>
              </section>
            ))}
          </div>

          <section className="mt-4 card px-3 py-2.5">
            <div className="flex items-start justify-between gap-3">
              <dl className="min-w-0 space-y-1 text-small text-ink">
                <div className="flex items-center gap-2">
                  <dt className="text-ink-3">
                    <PinIcon />
                    <span className="sr-only">მისამართი</span>
                  </dt>
                  <dd className="truncate">{deliveryAddress}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-ink-3">
                    <CalendarIcon />
                    <span className="sr-only">თარიღი</span>
                  </dt>
                  <dd className="truncate">{date}</dd>
                </div>
                {note.trim() && <p className="truncate text-ink-2">{note}</p>}
              </dl>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditing(true)}
                className="h-10 shrink-0"
              >
                შეცვლა
              </Button>
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] shadow-float backdrop-blur lg:left-64">
            <div className="px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
              {short.length > 0 && ready.length > 0 && (
                <p className="mb-2 truncate text-small text-ink-2">
                  {short.map((g) => g.supplier.displayName).join(", ")} კალათაში
                  დარჩება
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="shrink-0">
                  <p className="text-small leading-4 text-ink-2">სულ</p>
                  <p className="tabular text-h3 leading-6 text-ink">
                    {gel(shownTotal)}
                  </p>
                </div>
                <Button
                  block
                  disabled={ready.length === 0}
                  onClick={submit}
                  className="h-12 md:!w-96"
                >
                  {ready.length === 0
                    ? "შეავსეთ მინიმუმი"
                    : ready.length === 1
                      ? "შეკვეთის გაგზავნა"
                      : `${ready.length} შეკვეთის გაგზავნა`}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <Sheet
        open={editing}
        onClose={() => setEditing(false)}
        title="მიწოდება"
        footer={
          <Button block size="lg" onClick={() => setEditing(false)}>
            მზადაა
          </Button>
        }
      >
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-strong text-ink">მისამართი</legend>
            <div className="flex flex-col gap-2">
              {BUYER_ADDRESSES.map((a) => (
                <Choice
                  key={a}
                  label={a}
                  active={a === deliveryAddress}
                  onClick={() => setDeliveryAddress(a)}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-strong text-ink">
              სასურველი თარიღი
            </legend>
            <div className="flex flex-col gap-2">
              {dates.map((d) => (
                <Choice
                  key={d}
                  label={d}
                  active={d === date}
                  onClick={() => setDate(d)}
                />
              ))}
            </div>
            <p className="mt-2 text-small text-ink-3">
              თითოეული მომწოდებელი ადასტურებს დროს ცალკე.
            </p>
          </fieldset>
          <Input
            label="კომენტარი (არასავალდებულო)"
            placeholder="მაგ. მოიტანეთ უკანა შესასვლელთან"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Sheet>
    </Screen>
  );
}

function Choice({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-11 items-center justify-between gap-3 rounded border px-3 py-2 text-left text-body text-ink transition-colors",
        active
          ? "border-accent bg-accent-soft"
          : "border-line-strong hover:bg-surface-hover",
      )}
    >
      {label}
      {active && (
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 text-accent"
          fill="none"
          aria-hidden
        >
          <path
            d="m3 8 3.5 3.5L13 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
