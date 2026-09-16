"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Stepper,
  TableRow,
  Thumb,
  gel,
  gelPerUnit,
} from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { ClockIcon, CoinIcon, IconBadge, TruckIcon } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PRODUCTS, supplierById } from "@/lib/mock/data";

// A supplier's own catalogue — reached by tapping a supplier name anywhere in
// the buyer flow. Same dense, price-aligned row as search results, just
// scoped to one supplier (UI_BUILD_PROMPT.md §4 "Supplier page").
export default function SupplierStorefrontPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const {
    persona,
    getPacks,
    addOnePack,
    setPacks,
    isAvailable,
    customProducts,
  } = useDemo();

  useEffect(() => {
    if (persona !== "buyer") router.replace("/");
  }, [persona, router]);

  const supplier = supplierById(id);
  const products = useMemo(
    () =>
      [...SUPPLIER_PRODUCTS, ...customProducts]
        .filter((p) => p.supplierId === id)
        .sort((a, b) => a.nameKa.localeCompare(b.nameKa, "ka")),
    [id, customProducts],
  );

  if (persona !== "buyer") return null;

  return (
    <Screen>
      <BackLink href="/" children="მთავარი" />

      <div className="rounded border border-line px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={supplier.displayName} seed={supplier.id} size={44} />
          <div className="min-w-0">
            <p className="truncate text-h3 text-ink">{supplier.displayName}</p>
            <p className="mt-0.5 truncate text-small text-ink-2">
              {supplier.legalName}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {supplier.delivery.districts.map((d) => (
            <span
              key={d}
              className="inline-flex h-7 items-center rounded border border-line-strong px-2.5 text-small text-ink-2"
            >
              {d}
            </span>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
          <div>
            <div className="flex items-center gap-1.5 text-micro text-ink-3">
              <IconBadge hue={142} size={20}>
                <CoinIcon className="h-3 w-3" />
              </IconBadge>
              <span>მინ. შეკვეთა</span>
            </div>
            <p className="tabular mt-1 text-strong text-ink">
              {supplier.delivery.minOrderValue} ₾
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-micro text-ink-3">
              <IconBadge hue={32} size={20}>
                <ClockIcon className="h-3 w-3" />
              </IconBadge>
              <span>მიღება</span>
            </div>
            <p className="mt-1 text-strong text-ink">
              {supplier.delivery.cutoffLabel}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-micro text-ink-3">
              <IconBadge hue={216} size={20}>
                <TruckIcon className="h-3 w-3" />
              </IconBadge>
              <span>მიწოდება</span>
            </div>
            <p className="mt-1 text-strong text-ink">
              {supplier.delivery.leadLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h1 className="text-h3 text-ink">კატალოგი</h1>
        <span className="tabular text-small text-ink-3">
          {products.length} პროდუქტი
        </span>
      </div>

      <div className="mt-2 border-y border-line lg:grid lg:grid-cols-2 lg:gap-x-8 lg:border-none">
        {products.map((product) => {
          const packs = getPacks(product.id);
          const available = isAvailable(product);
          const pricePerBaseUnit =
            Math.round((product.pricePerPack / product.packQuantity) * 100) /
            100;
          return (
            <TableRow
              key={product.id}
              thumb={<Thumb src={product.imageUrl} name={product.nameKa} />}
              title={product.nameKa}
              meta1={product.packLabel}
              meta2={
                available ? "ხელმისაწვდომია" : "ამჟამად არ არის მარაგში"
              }
              price={gel(product.pricePerPack)}
              perUnit={gelPerUnit(pricePerBaseUnit, product.baseUnit)}
              unavailable={!available}
              action={
                !available ? undefined : packs === 0 ? (
                  <Button
                    variant="secondary"
                    aria-label={`დამატება — ${product.nameKa}`}
                    onClick={() => addOnePack(product.id)}
                    className="h-9 w-9 px-0 text-[18px] leading-none"
                  >
                    +
                  </Button>
                ) : (
                  <Stepper
                    value={packs}
                    onChange={(v) => setPacks(product.id, v)}
                    min={0}
                  />
                )
              }
            />
          );
        })}
      </div>
    </Screen>
  );
}
