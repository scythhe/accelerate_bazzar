"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Switch, Thumb, gel, gelPerUnit } from "@/components/ui";
import { Screen } from "@/components/screens/Screen";
import { SupplierNav } from "@/components/screens/SupplierNav";
import { BagIcon, IconBadge } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, SUPPLIER_PRODUCTS, supplierById } from "@/lib/mock/data";

// Catalogue management: availability toggle (live in buyer search) plus
// adding a new product — the thing CLAUDE.md §4 says has to be trivial or a
// supplier just won't do it.
export default function SupplierCataloguePage() {
  const router = useRouter();
  const { persona, isAvailable, setAvailability, customProducts } = useDemo();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  const ownCustom = useMemo(
    () => customProducts.filter((p) => p.supplierId === SUPPLIER_PERSONA_ID),
    [customProducts],
  );

  const products = useMemo(
    () =>
      SUPPLIER_PRODUCTS.filter((p) => p.supplierId === SUPPLIER_PERSONA_ID).sort(
        (a, b) => a.nameKa.localeCompare(b.nameKa, "ka"),
      ),
    [],
  );

  if (persona !== "supplier") return null;

  const all = [...ownCustom, ...products];
  const availableCount = all.filter((p) => isAvailable(p)).length;
  const newIds = new Set(ownCustom.map((p) => p.id));

  return (
    <Screen>
      <p className="text-h2 tracking-tight text-ink">Accelerate</p>
      <p className="mt-1 text-small text-ink-2">{supplier.displayName}</p>

      <SupplierNav />

      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconBadge hue={142} size={32}>
            <BagIcon />
          </IconBadge>
          <div>
            <h1 className="text-h3 text-ink">კატალოგი</h1>
            <span className="tabular text-small text-ink-3">
              {availableCount}/{all.length} ხელმისაწვდომი
            </span>
          </div>
        </div>
        <Link
          href="/supplier/catalogue/new"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded bg-ink px-3 text-strong text-white"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          პროდუქტი
        </Link>
      </div>
      <p className="mt-1 text-small text-ink-2">
        გამორთეთ ის, რაც ამჟამად მარაგში არ გაქვთ — მყისვე ქრება ძებნის
        შედეგებიდან.
      </p>

      <div className="mt-3 border-y border-line">
        {all.map((product) => {
          const available = isAvailable(product);
          const pricePerBaseUnit =
            Math.round((product.pricePerPack / product.packQuantity) * 100) /
            100;
          const isNew = newIds.has(product.id);
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 border-b border-line px-1 py-2.5 last:border-b-0"
            >
              <Thumb src={product.imageUrl} name={product.nameKa} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p
                    className={
                      "truncate text-title leading-[20px] " +
                      (available ? "text-ink" : "text-ink-3")
                    }
                  >
                    {product.nameKa}
                  </p>
                  {isNew && (
                    <span className="shrink-0 rounded-sm bg-accent px-1.5 py-px text-micro text-white">
                      ახალი
                    </span>
                  )}
                </div>
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
