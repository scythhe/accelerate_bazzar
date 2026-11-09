"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react";
import { gel } from "@/components/ui";
import { Screen } from "@/components/screens/Screen";
import { ClockIcon, CoinIcon, IconBadge, ReceiptIcon } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, SUPPLIER_PLAN, supplierById } from "@/lib/mock/data";

const INCLUDED = [
  "კატალოგის ულიმიტო სიღრმე — არ იხდით SKU-ების რაოდენობაზე",
  "შემოსული შეკვეთების ულიმიტო რაოდენობა",
  "0% საკომისიო — ყოველთვის",
  "ინვოისი ბანკის გადარიცხვით, ყოველი თვის ბოლოს",
];

export default function SupplierBillingPage() {
  const router = useRouter();
  const { persona, orders } = useDemo();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  const stats = useMemo(() => {
    const mine = orders.filter(
      (o) => o.supplierId === SUPPLIER_PERSONA_ID && o.status !== "REJECTED" && o.status !== "CANCELLED",
    );
    return {
      count: mine.length,
      total: Math.round(mine.reduce((t, o) => t + o.subtotal, 0) * 100) / 100,
    };
  }, [orders]);

  if (persona !== "supplier") return null;

  const trialProgress = Math.round(
    ((SUPPLIER_PLAN.trialDays - SUPPLIER_PLAN.trialDaysLeft) / SUPPLIER_PLAN.trialDays) * 100,
  );

  return (
    <Screen narrow>
      <h1 className="text-h2 text-ink">გეგმა და გადახდა</h1>

      {/* Trial status */}
      <section className="mt-5 card px-4 py-4">
        <div className="flex items-center gap-2.5">
          <IconBadge tone="saffron" size={28}>
            <ClockIcon />
          </IconBadge>
          <p className="text-strong text-ink">საცდელი პერიოდი აქტიურია</p>
        </div>
        <p className="tabular mt-1 text-small text-ink-2">
          დარჩენილია {SUPPLIER_PLAN.trialDaysLeft} დღე
        </p>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
          <div
            className="h-full rounded-full bg-saffron"
            style={{ width: `${trialProgress}%` }}
          />
        </div>
        <p className="mt-2.5 text-small text-ink-2">
          დაიწყო {SUPPLIER_PLAN.trialStartedLabel}. საცდელის დასრულების შემდეგ
          ავტომატურად გადადით {SUPPLIER_PLAN.name} გეგმაზე — ბარათი არ
          გჭირდებათ, ინვოისი ივსება ბანკის გადარიცხვით.
        </p>
      </section>

      {/* Plan */}
      <section className="mt-4 card px-4 py-4">
        <div className="flex items-center gap-2.5">
          <IconBadge tone="herb" size={28}>
            <CoinIcon />
          </IconBadge>
          <p className="text-strong text-ink">{SUPPLIER_PLAN.name} გეგმა</p>
          <span className="rounded-sm border border-line-strong px-1.5 py-px text-micro text-ink-3">
            საწყისი დონე
          </span>
        </div>
        <p className="tabular mt-1 text-stat text-ink">
          {gel(SUPPLIER_PLAN.monthlyPriceGel)}
          <span className="text-small font-normal text-ink-2"> /თვეში</span>
        </p>
        <ul className="mt-3 space-y-2">
          {INCLUDED.map((line) => (
            <li key={line} className="flex gap-2 text-small text-ink-2">
              <CheckCircle weight="fill" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* This month */}
      <section className="mt-4 card px-4 py-4">
        <div className="flex items-center gap-2.5">
          <IconBadge tone="pomegranate" size={28}>
            <ReceiptIcon />
          </IconBadge>
          <p className="text-micro text-ink-3">ამ თვეს Bazzar-ზე</p>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-small text-ink-2">შეკვეთა</span>
          <span className="tabular text-strong text-ink">{stats.count}</span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-small text-ink-2">ჯამური ბრუნვა</span>
          <span className="tabular text-strong text-ink">{gel(stats.total)}</span>
        </div>
      </section>
    </Screen>
  );
}
