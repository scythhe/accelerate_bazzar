"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, gel, gelPerUnit } from "@/components/ui";
import { Screen, BackLink } from "@/components/screens/Screen";
import { useDemo } from "@/lib/store/DemoContext";
import type { BaseUnit } from "@/lib/mock/types";

const UNIT_OPTIONS: { value: BaseUnit; label: string }[] = [
  { value: "ცალი", label: "ცალი" },
  { value: "კგ", label: "კგ" },
  { value: "ლ", label: "ლ" },
];

const PACK_EXAMPLES: Record<BaseUnit, string> = {
  ცალი: "თარო (30 ცალი)",
  კგ: "ტომარა 25 კგ",
  ლ: "ბიდონი 5 ლ",
};

// Add product — the unit system from V1_BUILD_PROMPT.md §4: a pack has a
// Georgian label plus a quantity in base units, and price_per_base_unit is
// what actually teaches a supplier how the pricing model works, so the
// preview updates live and stays prominent (UI_BUILD_PROMPT.md §7).
export default function NewProductPage() {
  const router = useRouter();
  const { persona, addProduct } = useDemo();

  useEffect(() => {
    if (persona !== "supplier") router.replace("/");
  }, [persona, router]);

  const [nameKa, setNameKa] = useState("");
  const [baseUnit, setBaseUnit] = useState<BaseUnit>("კგ");
  const [packLabel, setPackLabel] = useState("");
  const [packQuantity, setPackQuantity] = useState("");
  const [pricePerPack, setPricePerPack] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (persona !== "supplier") return null;

  const qty = parseFloat(packQuantity);
  const price = parseFloat(pricePerPack);
  const perUnit =
    Number.isFinite(qty) && qty > 0 && Number.isFinite(price) && price >= 0
      ? Math.round((price / qty) * 100) / 100
      : null;

  const errors = {
    nameKa: submitted && !nameKa.trim() ? "სახელი აუცილებელია" : undefined,
    packLabel: submitted && !packLabel.trim() ? "შეფუთვის ეტიკეტი აუცილებელია" : undefined,
    packQuantity:
      submitted && !(qty > 0) ? "მიუთითეთ დადებითი რაოდენობა" : undefined,
    pricePerPack:
      submitted && !(price > 0) ? "მიუთითეთ დადებითი ფასი" : undefined,
  };
  const valid =
    nameKa.trim() && packLabel.trim() && qty > 0 && price > 0;

  const submit = () => {
    setSubmitted(true);
    if (!valid) return;
    addProduct({
      nameKa: nameKa.trim(),
      baseUnit,
      packLabel: packLabel.trim(),
      packQuantity: qty,
      pricePerPack: Math.round(price * 100) / 100,
    });
    router.push("/supplier/catalogue");
  };

  return (
    <Screen>
      <BackLink href="/supplier/catalogue" children="კატალოგი" />
      <h1 className="text-h2 text-ink">პროდუქტის დამატება</h1>
      <p className="mt-1 text-small text-ink-2">
        ჩნდება თქვენს კატალოგში მყისვე და მოიძებნება სახელით ძებნაში.
      </p>

      <div className="mt-5 space-y-5">
        <Input
          label="დასახელება"
          placeholder="მაგ. ხახვი, ყვითელი"
          value={nameKa}
          onChange={(e) => setNameKa(e.target.value)}
          error={errors.nameKa}
        />

        <Select
          label="საბაზისო ერთეული"
          options={UNIT_OPTIONS}
          value={baseUnit}
          onChange={(e) => setBaseUnit(e.target.value as BaseUnit)}
        />

        <Input
          label="შეფუთვის ეტიკეტი"
          placeholder={PACK_EXAMPLES[baseUnit]}
          hint={`მაგალითად: ${PACK_EXAMPLES[baseUnit]}`}
          value={packLabel}
          onChange={(e) => setPackLabel(e.target.value)}
          error={errors.packLabel}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={`რაოდენობა (${baseUnit})`}
            placeholder="25"
            numeric
            inputMode="decimal"
            value={packQuantity}
            onChange={(e) => setPackQuantity(e.target.value)}
            error={errors.packQuantity}
          />
          <Input
            label="ფასი შეფუთვაზე"
            leading="₾"
            placeholder="30.00"
            numeric
            inputMode="decimal"
            value={pricePerPack}
            onChange={(e) => setPricePerPack(e.target.value)}
            error={errors.pricePerPack}
          />
        </div>

        {/* Live per-base-unit preview — the number that actually teaches the
            pricing model, so it stays big and updates as you type. */}
        <div className="rounded border border-line-strong bg-paper px-4 py-4 shadow-card">
          <p className="text-micro text-ink-3">შედარების ფასი (თვითგამოთვლადი)</p>
          {perUnit !== null ? (
            <p className="tabular mt-1 text-stat text-ink">
              {gelPerUnit(perUnit, baseUnit)}
            </p>
          ) : (
            <p className="mt-1 text-h3 text-ink-3">— /{baseUnit}</p>
          )}
          <p className="mt-1 text-small text-ink-2">
            {qty > 0 && price > 0
              ? `${gel(price)} ÷ ${qty} ${baseUnit} — ამას ხედავენ მყიდველები ფასების შედარებისას.`
              : "შეავსეთ რაოდენობა და ფასი — ეს ფასი გამოჩნდება ყველა ძებნის შედეგში."}
          </p>
        </div>
      </div>

      <Button block size="lg" className="mt-6" onClick={submit}>
        პროდუქტის დამატება
      </Button>
    </Screen>
  );
}
