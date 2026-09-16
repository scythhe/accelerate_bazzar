"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/screens/Screen";
import { SupplierNav } from "@/components/screens/SupplierNav";
import { ClockIcon, CoinIcon, IconBadge, PinIcon, TruckIcon } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, supplierById } from "@/lib/mock/data";
import type { District } from "@/lib/mock/types";

const ALL_DISTRICTS: District[] = [
  "ვაკე",
  "საბურთალო",
  "ისანი",
  "გლდანი",
  "დიდუბე",
  "ვერა",
  "მთაწმინდა",
];

export default function SupplierDeliveryPage() {
  const router = useRouter();
  const { persona } = useDemo();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  if (persona !== "supplier") return null;

  const served = new Set(supplier.delivery.districts);

  return (
    <Screen>
      <p className="text-h2 tracking-tight text-ink">Accelerate</p>
      <p className="mt-1 text-small text-ink-2">{supplier.displayName}</p>

      <SupplierNav />

      <h1 className="mt-5 text-h3 text-ink">მიწოდების პარამეტრები</h1>
      <p className="mt-1 text-small text-ink-2">
        ეს პარამეტრები ჩანს ყველა ბუყერისთვის ძებნის შედეგებში, ფასის გვერდით.
      </p>

      <section className="mt-4 rounded border border-line px-4 py-4">
        <div className="flex items-center gap-2 text-micro text-ink-3">
          <IconBadge hue={260} size={24}>
            <PinIcon className="h-3.5 w-3.5" />
          </IconBadge>
          <span>რაიონები</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ALL_DISTRICTS.map((d) => {
            const active = served.has(d);
            return (
              <span
                key={d}
                className={
                  "inline-flex h-8 items-center rounded border px-3 text-small transition-colors " +
                  (active
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line text-ink-3")
                }
              >
                {d}
              </span>
            );
          })}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <section className="rounded border border-line px-4 py-3.5 shadow-card">
          <div className="flex items-center gap-2 text-micro text-ink-3">
            <IconBadge hue={142} size={24}>
              <CoinIcon className="h-3.5 w-3.5" />
            </IconBadge>
            <span>მინიმალური შეკვეთა</span>
          </div>
          <p className="tabular mt-1.5 text-h3 text-ink">
            {supplier.delivery.minOrderValue} ₾
          </p>
        </section>
        <section className="rounded border border-line px-4 py-3.5 shadow-card">
          <div className="flex items-center gap-2 text-micro text-ink-3">
            <IconBadge hue={32} size={24}>
              <ClockIcon className="h-3.5 w-3.5" />
            </IconBadge>
            <span>მიღების ბოლო დრო</span>
          </div>
          <p className="mt-1.5 text-h3 text-ink">{supplier.delivery.cutoffLabel}</p>
        </section>
      </div>

      <section className="mt-2.5 flex items-center gap-3 rounded border border-line px-4 py-3.5">
        <IconBadge hue={216} size={36}>
          <TruckIcon />
        </IconBadge>
        <div>
          <p className="text-micro text-ink-3">მიწოდების ვადა</p>
          <p className="mt-0.5 text-strong text-ink">
            შეკვეთა მიღების დროზე ადრე → {supplier.delivery.leadLabel} მიწოდება
          </p>
        </div>
      </section>
    </Screen>
  );
}
