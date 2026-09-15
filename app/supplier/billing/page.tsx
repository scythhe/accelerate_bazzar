"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gel } from "@/components/ui";
import { Screen } from "@/components/screens/Screen";
import { SupplierNav } from "@/components/screens/SupplierNav";
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
    <Screen>
      <p className="text-h2 tracking-tight text-ink">Accelerate</p>
      <p className="mt-1 text-small text-ink-2">{supplier.displayName}</p>

      <SupplierNav />

      <h1 className="mt-5 text-h3 text-ink">გეგმა და გადახდა</h1>

      {/* Trial status */}
      <section className="mt-5 rounded border border-line px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ok" aria-hidden />
          <p className="text-strong text-ink">საცდელი პერიოდი აქტიურია</p>
        </div>
        <p className="tabular mt-1 text-small text-ink-2">
          დარჩენილია {SUPPLIER_PLAN.trialDaysLeft} დღე
        </p>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
          <div
            className="h-full rounded-full bg-ok"
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
      <section className="mt-4 rounded border border-line-strong px-4 py-4 shadow-card">
        <div className="flex items-baseline justify-between">
          <p className="text-strong text-ink">{SUPPLIER_PLAN.name} გეგმა</p>
          <p className="tabular text-h3 text-ink">
            {gel(SUPPLIER_PLAN.monthlyPriceGel)}
            <span className="text-small font-normal text-ink-2"> /თვეში</span>
          </p>
        </div>
        <ul className="mt-3 space-y-2">
          {INCLUDED.map((line) => (
            <li key={line} className="flex gap-2 text-small text-ink-2">
              <svg
                viewBox="0 0 16 16"
                className="mt-0.5 h-4 w-4 shrink-0 text-ok"
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
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* What it replaces */}
      <section className="mt-4 rounded border border-line px-4 py-4">
        <p className="text-micro text-ink-3">რას ხარჯავთ დღეს</p>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div>
            <p className="text-small text-ink-2">სავაჭრო წარმომადგენლები</p>
            <p className="tabular mt-1 text-strong text-ink-2">
              ~15 000 ₾<span className="text-micro text-ink-3"> /თვეში</span>
            </p>
          </div>
          <div>
            <p className="text-small text-ink-2">Accelerate</p>
            <p className="tabular mt-1 text-strong text-ink">
              {gel(SUPPLIER_PLAN.monthlyPriceGel)}
              <span className="text-micro text-ink-3"> /თვეში</span>
            </p>
          </div>
        </div>
      </section>

      {/* This month */}
      <section className="mt-4 rounded border border-line px-4 py-4">
        <p className="text-micro text-ink-3">ამ თვეს Accelerate-ზე</p>
        <div className="mt-2 flex items-baseline justify-between">
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
