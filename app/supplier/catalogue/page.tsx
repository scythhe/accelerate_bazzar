"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Sheet,
  Switch,
  Thumb,
  TrashButton,
  cn,
  gel,
} from "@/components/ui";
import { PRODUCT_GRID, Screen } from "@/components/screens/Screen";
import { BagIcon, IconBadge } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { SUPPLIER_PERSONA_ID, SUPPLIER_PRODUCTS, supplierById } from "@/lib/mock/data";
import type { SupplierProduct } from "@/lib/mock/types";

// Catalogue management: availability toggle (live in buyer search), adding and
// deleting products — the thing CLAUDE.md §4 says has to be trivial or a
// supplier just won't do it.
export default function SupplierCataloguePage() {
  const router = useRouter();
  const {
    persona,
    isAvailable,
    setAvailability,
    customProducts,
    removedProductIds,
    removeProduct,
    setProductPrice,
  } = useDemo();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);
  const [deleting, setDeleting] = useState<SupplierProduct | null>(null);
  const [repricing, setRepricing] = useState<SupplierProduct | null>(null);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  const ownCustom = useMemo(
    () => customProducts.filter((p) => p.supplierId === SUPPLIER_PERSONA_ID),
    [customProducts],
  );

  // Seed products, each swapped for its edited copy if it has one.
  const products = useMemo(
    () =>
      SUPPLIER_PRODUCTS.filter(
        (p) =>
          p.supplierId === SUPPLIER_PERSONA_ID &&
          !removedProductIds.includes(p.id),
      )
        .map((p) => ownCustom.find((c) => c.id === p.id) ?? p)
        .sort((a, b) => a.nameKa.localeCompare(b.nameKa, "ka")),
    [removedProductIds, ownCustom],
  );

  if (persona !== "supplier") return null;

  const added = ownCustom.filter(
    (c) => !SUPPLIER_PRODUCTS.some((p) => p.id === c.id),
  );
  const all = [...added, ...products];
  const availableCount = all.filter((p) => isAvailable(p)).length;
  const newIds = new Set(added.map((p) => p.id));

  const parsedPrice = parseFloat(newPrice.replace(",", "."));
  const savePrice = () => {
    if (!repricing || !(parsedPrice > 0)) return;
    setProductPrice(repricing.id, Math.round(parsedPrice * 100) / 100);
    setRepricing(null);
  };

  return (
    <Screen>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconBadge tone="herb" size={32}>
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
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded bg-brand px-3 text-strong text-white"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          დამატება
        </Link>
      </div>
      <p className="mt-1 text-small text-ink-2">
        გამორთეთ ის, რაც ამჟამად მარაგში არ გაქვთ — მყისვე ქრება ძებნის
        შედეგებიდან.
      </p>

      <div className={cn(PRODUCT_GRID, "mt-3")}>
        {all.map((product) => {
          const available = isAvailable(product);
          return (
            <div
              key={product.id}
              className="card flex items-center gap-3 p-3 transition-shadow hover:shadow-lift"
            >
              <span className={available ? "" : "opacity-55"}>
                <Thumb src={product.imageUrl} name={product.nameKa} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p
                    className={
                      "truncate text-strong " +
                      (available ? "text-ink" : "text-ink-3")
                    }
                  >
                    {product.nameKa}
                  </p>
                  {newIds.has(product.id) && (
                    <span className="shrink-0 rounded-sm bg-accent px-1.5 py-px text-micro text-white">
                      ახალი
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`ფასის შეცვლა — ${product.nameKa}`}
                  onClick={() => {
                    setRepricing(product);
                    setNewPrice(String(product.pricePerPack));
                  }}
                  className="tabular flex min-h-8 max-w-full items-center gap-1 truncate text-left text-small text-ink-2 underline-offset-2 hover:underline"
                >
                  <span className="font-medium text-accent">
                    {gel(product.pricePerPack)}
                  </span>
                  <span className="truncate">
                    / {product.baseUnit}
                    {product.minQty > 1 ? ` · მინ. ${product.minQty}` : ""}
                    {product.sku ? ` · ${product.sku}` : ""}
                  </span>
                </button>
              </div>
              <Switch
                checked={available}
                onChange={(next) => setAvailability(product.id, next)}
                label={`${product.nameKa} — ხელმისაწვდომობა`}
              />
              <TrashButton
                label={`წაშლა — ${product.nameKa}`}
                onClick={() => setDeleting(product)}
              />
            </div>
          );
        })}
      </div>

      <Sheet
        open={repricing !== null}
        onClose={() => setRepricing(null)}
        title="ფასის შეცვლა"
        description={repricing?.nameKa}
        footer={
          <Button block size="lg" disabled={!(parsedPrice > 0)} onClick={savePrice}>
            შენახვა
          </Button>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            savePrice();
          }}
        >
          <Input
            label={repricing ? `ახალი ფასი 1 ${repricing.baseUnit}` : ""}
            leading="₾"
            numeric
            inputMode="decimal"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            autoFocus
            onFocus={(e) => e.target.select()}
            hint="მყიდველები ამას სიახლეებში ნახავენ."
          />
        </form>
      </Sheet>

      <Sheet
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="პროდუქტის წაშლა"
        description={deleting?.nameKa}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              გაუქმება
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) removeProduct(deleting.id);
                setDeleting(null);
              }}
            >
              წაშლა
            </Button>
          </>
        }
      >
        <p className="text-small text-ink-2">
          პროდუქტი გაქრება კატალოგიდან და მყიდველების ძებნიდან. თუ მხოლოდ დროებით
          არ გაქვთ, უბრალოდ გამორთეთ.
        </p>
      </Sheet>
    </Screen>
  );
}
