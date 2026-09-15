"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Switch, Thumb, gel, gelPerUnit } from "@/components/ui";
import { Screen } from "@/components/screens/Screen";
import { SupplierNav } from "@/components/screens/SupplierNav";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, SUPPLIER_PRODUCTS, supplierById } from "@/lib/mock/data";

// Read-only-ish catalogue management: the one lever a supplier actually
// touches in this demo is availability, wired live into buyer search
// (DEMO_PROMPT scope stops short of full product forms/CSV import).
export default function SupplierCataloguePage() {
  const router = useRouter();
  const { persona, isAvailable, setAvailability } = useDemo();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  const products = useMemo(
    () =>
      SUPPLIER_PRODUCTS.filter((p) => p.supplierId === SUPPLIER_PERSONA_ID).sort(
        (a, b) => a.nameKa.localeCompare(b.nameKa, "ka"),
      ),
    [],
  );

  if (persona !== "supplier") return null;

  const availableCount = products.filter((p) => isAvailable(p)).length;

  return (
    <Screen>
      <p className="text-h2 tracking-tight text-ink">Accelerate</p>
      <p className="mt-1 text-small text-ink-2">{supplier.displayName}</p>

      <SupplierNav />

      <div className="mt-5 flex items-baseline justify-between">
        <h1 className="text-h3 text-ink">კატალოგი</h1>
        <span className="tabular text-small text-ink-3">
          {availableCount}/{products.length} ხელმისაწვდომი
        </span>
      </div>
      <p className="mt-1 text-small text-ink-2">
        გამორთეთ ის, რაც ამჟამად მარაგში არ გაქვთ — მყისვე ქრება ძებნის
        შედეგებიდან.
      </p>

      <div className="mt-3 border-y border-line">
        {products.map((product) => {
          const available = isAvailable(product);
          const pricePerBaseUnit =
            Math.round((product.pricePerPack / product.packQuantity) * 100) /
            100;
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 border-b border-line px-1 py-2.5 last:border-b-0"
            >
              <Thumb src={product.imageUrl} name={product.nameKa} />
              <div className="min-w-0 flex-1">
                <p
                  className={
                    "truncate text-title leading-[20px] " +
                    (available ? "text-ink" : "text-ink-3")
                  }
                >
                  {product.nameKa}
                </p>
                <p className="truncate text-small text-ink-2">
                  {product.packLabel}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="tabular text-strong text-ink">
                  {gel(product.pricePerPack)}
                </p>
                <p className="tabular text-small text-ink-3">
                  {gelPerUnit(pricePerBaseUnit, product.baseUnit)}
                </p>
              </div>
              <Switch
                checked={available}
                onChange={(next) => setAvailability(product.id, next)}
                label={`${product.nameKa} — ხელმისაწვდომობა`}
              />
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
