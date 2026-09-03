"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  DropdownFilter,
  Input,
  Select,
  Sheet,
  StatusDot,
  Stepper,
  TableRow,
  gel,
  gelPerUnit,
  type OrderStatus,
} from "@/components/ui";

// Component inventory (DESIGN_SYSTEM.md §8). Not a designed screen — groups with
// h3 headings, 48px between groups, 24px between variants, each variant labelled
// at `micro` in --ink-3. Judge the system on /kitchen-sink/results, not here.
export default function KitchenSinkPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">
      <header className="mb-12">
        <p className="text-h1 tracking-tight text-ink">Accelerate</p>
        <p className="mt-2 text-body text-ink-2">
          კომპონენტების ინვენტარი — ყველა პრიმიტივი, ყველა მდგომარეობაში.
        </p>
        <Link
          href="/kitchen-sink/results"
          className="mt-4 inline-flex h-8 items-center rounded border border-line-strong px-3 text-small text-ink-2 transition-colors hover:bg-surface-hover"
        >
          → ძებნის შედეგები (12 რიგი)
        </Link>
      </header>

      <div className="space-y-12">
        <TypeScale />
        <Colours />
        <Buttons />
        <Inputs />
        <Selects />
        <Steppers />
        <Filters />
        <Statuses />
        <TableRows />
        <Sheets />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ layout -- */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-6 text-h3 text-ink">{title}</h3>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Variant({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-micro text-ink-3">{label}</p>
      <div className={className ?? "flex flex-wrap items-center gap-3"}>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- type scale -- */

function TypeScale() {
  const rows: [string, string, string][] = [
    ["h1", "text-h1", "30 / 38 · 700 — გვერდის სათაური"],
    ["h2", "text-h2", "24 / 32 · 700 — ქვე-გვერდის სათაური"],
    ["h3", "text-h3", "20 / 28 · 700 — სექციის სათაური"],
    ["title", "text-title", "17 / 24 · 500 — რიგის სათაური, პროდუქტი"],
    ["price", "text-price tabular", "17 / 22 · 700 — ფასი · 12.00 ₾"],
    ["strong", "text-strong", "15 / 23 · 500 — აქცენტი, ფორმის ლეიბლი"],
    ["body", "text-body", "15 / 23 · 400 — ძირითადი ტექსტი"],
    ["small", "text-small", "13 / 20 · 400 — მეორეხარისხოვანი, მომწოდებელი"],
    ["micro", "text-micro", "11 / 16 · 500 — მეტა ლეიბლი, ერთეული"],
  ];
  return (
    <Group title="ტიპოგრაფია — Noto Sans Georgian">
      <div className="divide-y divide-line border-y border-line">
        {rows.map(([token, cls, note]) => (
          <div
            key={token}
            className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-3"
          >
            <span className="w-14 shrink-0 text-micro text-ink-3">{token}</span>
            <span className={`${cls} text-ink`}>{note}</span>
          </div>
        ))}
      </div>
      <Variant label="tabular-nums — დეკიმალები უნდა ესწოროს">
        <div className="tabular text-price text-ink">
          <div>8.20 ₾</div>
          <div>12.00 ₾</div>
          <div>105.00 ₾</div>
          <div>1300.50 ₾</div>
        </div>
      </Variant>
    </Group>
  );
}

/* ---------------------------------------------------------------- colours --- */

function Colours() {
  const swatches: [string, string][] = [
    ["--paper", "var(--paper)"],
    ["--surface", "var(--surface)"],
    ["--surface-hover", "var(--surface-hover)"],
    ["--ink", "var(--ink)"],
    ["--ink-2", "var(--ink-2)"],
    ["--ink-3", "var(--ink-3)"],
    ["--line", "var(--line)"],
    ["--line-strong", "var(--line-strong)"],
    ["--accent", "var(--accent)"],
    ["--ok", "var(--ok)"],
    ["--warn", "var(--warn)"],
    ["--danger", "var(--danger)"],
  ];
  return (
    <Group title="ფერის ტოკენები">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {swatches.map(([name, value]) => (
          <div
            key={name}
            className="flex items-center gap-3 border border-line p-3"
          >
            <span
              className="h-9 w-9 shrink-0 border border-line"
              style={{ backgroundColor: value }}
            />
            <span className="text-micro text-ink-2">{name}</span>
          </div>
        ))}
      </div>
      <p className="text-small text-ink-3">
        --accent მხოლოდ ოთხ ადგილას: აქტიური ნავიგაცია, მონიშნული ფილტრი, ფოკუსის
        რგოლი, შეკვეთის ჯამი. #1A56DB დროებითია.
      </p>
    </Group>
  );
}

/* ---------------------------------------------------------------- buttons --- */

function Buttons() {
  return (
    <Group title="ღილაკი">
      <Variant label="ვარიანტები — primary არის --ink, არა --accent">
        <Button variant="primary">დადასტურება</Button>
        <Button variant="secondary">გაუქმება</Button>
        <Button variant="ghost">უკან</Button>
        <Button variant="destructive">უარყოფა</Button>
      </Variant>
      <Variant label="ზომები — 32 / 40 / 44">
        <Button size="sm">პატარა</Button>
        <Button size="md">საშუალო</Button>
        <Button size="lg">დიდი</Button>
      </Variant>
      <Variant label="დატვირთვა და გამორთული">
        <Button loading>იტვირთება</Button>
        <Button variant="secondary" loading>
          იტვირთება
        </Button>
        <Button disabled>გამორთული</Button>
        <Button variant="secondary" disabled>
          გამორთული
        </Button>
      </Variant>
      <Variant label="სრული სიგანე" className="max-w-sm">
        <Button block>შეკვეთის განთავსება</Button>
      </Variant>
    </Group>
  );
}

/* ----------------------------------------------------------------- inputs --- */

function Inputs() {
  const [phone, setPhone] = useState("");
  return (
    <Group title="ველი">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Variant label="ნაგულისხმევი" className="block">
          <Input label="კომპანიის დასახელება" placeholder="შპს მაგალითი" />
        </Variant>
        <Variant label="პრეფიქსით + დახმარების ტექსტი" className="block">
          <Input
            label="ტელეფონის ნომერი"
            leading="+995"
            numeric
            inputMode="tel"
            placeholder="599 12 34 56"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            hint="ნებისმიერი სწორი ქართული ნომერი მიიღება."
          />
        </Variant>
        <Variant label="შევსებული" className="block">
          <Input
            label="საიდენტიფიკაციო კოდი"
            numeric
            defaultValue="405123456"
            hint="ს/კ — 9 ციფრი."
          />
        </Variant>
        <Variant label="შეცდომა" className="block">
          <Input
            label="დადასტურების კოდი"
            numeric
            defaultValue="123123"
            error="კოდი არასწორია. სცადეთ თავიდან."
          />
        </Variant>
        <Variant label="გამორთული" className="block">
          <Input label="მისამართი" placeholder="ვაკე, ჭავჭავაძის 12" disabled />
        </Variant>
        <Variant label="რიცხვითი — tabular" className="block">
          <Input label="ფასი" leading="₾" numeric defaultValue="12.00" />
        </Variant>
      </div>
    </Group>
  );
}

/* ---------------------------------------------------------------- selects --- */

function Selects() {
  const districts = [
    { value: "vake", label: "ვაკე" },
    { value: "saburtalo", label: "საბურთალო" },
    { value: "isani", label: "ისანი" },
    { value: "gldani", label: "გლდანი" },
  ];
  return (
    <Group title="ჩამოსაშლელი სია">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <Variant label="placeholder" className="block">
          <Select
            label="რაიონი"
            options={districts}
            placeholder="აირჩიეთ რაიონი"
            defaultValue=""
          />
        </Variant>
        <Variant label="არჩეული" className="block">
          <Select label="რაიონი" options={districts} defaultValue="saburtalo" />
        </Variant>
        <Variant label="შეცდომა" className="block">
          <Select
            label="რაიონი"
            options={districts}
            defaultValue=""
            placeholder="აირჩიეთ რაიონი"
            error="აირჩიეთ მიწოდების რაიონი."
          />
        </Variant>
        <Variant label="გამორთული" className="block">
          <Select label="რაიონი" options={districts} defaultValue="vake" disabled />
        </Variant>
      </div>
    </Group>
  );
}

/* --------------------------------------------------------------- steppers --- */

function Steppers() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(3);
  return (
    <Group title="რაოდენობის ცვლა">
      <Variant label="ნაგულისხმევი · მინ. 1 · ერთეული გარეთ">
        <Stepper value={a} onChange={setA} min={1} unit="თარო" />
      </Variant>
      <Variant label="მინ. 0 — მინუსი გამორთული, არა დამალული">
        <Stepper value={b} onChange={setB} min={0} />
      </Variant>
      <Variant label="ლიმიტით · მაქს. 5">
        <Stepper value={c} onChange={setC} min={1} max={5} unit="ტომარა" />
      </Variant>
      <Variant label="ორნიშნა — მნიშვნელობა არ ხტება">
        <Stepper value={12} onChange={() => {}} min={1} unit="კგ" />
      </Variant>
      <Variant label="გამორთული">
        <Stepper value={2} onChange={() => {}} disabled unit="ცალი" />
      </Variant>
    </Group>
  );
}

/* ----------------------------------------------------------------- filters --- */

function Filters() {
  const [cat, setCat] = useState<string[]>([]);
  const [district, setDistrict] = useState<string[]>(["vake"]);
  const [minOrder, setMinOrder] = useState<string[]>([]);
  return (
    <Group title="ფილტრის ჩიპი">
      <Variant label="არააქტიური / აქტიური (--accent-soft) / მრავალარჩევანი">
        <DropdownFilter
          label="კატეგორია"
          value={cat}
          onChange={setCat}
          options={[
            { value: "eggs", label: "კვერცხი" },
            { value: "veg", label: "ბოსტნეული" },
            { value: "dairy", label: "რძის ნაწარმი" },
            { value: "oil", label: "ზეთი" },
          ]}
        />
        <DropdownFilter
          label="მიწოდება"
          activePrefix="მიწოდება"
          value={district}
          onChange={setDistrict}
          options={[
            { value: "vake", label: "ვაკე" },
            { value: "saburtalo", label: "საბურთალო" },
            { value: "isani", label: "ისანი" },
          ]}
        />
        <DropdownFilter
          label="მინ. შეკვეთა"
          multiple
          value={minOrder}
          onChange={setMinOrder}
          options={[
            { value: "100", label: "100 ₾-მდე" },
            { value: "200", label: "200 ₾-მდე" },
            { value: "300", label: "300 ₾-მდე" },
          ]}
        />
      </Variant>
    </Group>
  );
}

/* ---------------------------------------------------------------- statuses --- */

function Statuses() {
  const all: OrderStatus[] = [
    "PLACED",
    "CONFIRMED",
    "DELIVERED",
    "REJECTED",
    "CANCELLED",
  ];
  return (
    <Group title="სტატუსი">
      <Variant label="6px წერტილი + ეტიკეტი — არასდროს შევსებული ბეჯი">
        <div className="flex flex-col gap-2">
          {all.map((s) => (
            <StatusDot key={s} status={s} />
          ))}
        </div>
      </Variant>
      <Variant label="მხოლოდ წერტილი (ცხრილის რიგში)">
        {all.map((s) => (
          <StatusDot key={s} status={s} dotOnly />
        ))}
      </Variant>
    </Group>
  );
}

/* --------------------------------------------------------------- table row --- */

function TableRows() {
  const [qty, setQty] = useState(2);
  return (
    <Group title="ცხრილის რიგი">
      <Variant
        label="py 14 · px 16 · 1px გამყოფი · ფასის სვეტი მარჯვნივ და გასწორებული"
        className="block max-w-2xl border-y border-line"
      >
        <TableRow
          title="კვერცხი C1"
          meta1="აგრო ჯგუფი · თარო (30 ცალი)"
          meta2="ხვალ 09:00-მდე · მინ. 150 ₾"
          price={gel(12)}
          perUnit={gelPerUnit(0.4, "ცალი")}
          action={
            <Button
              variant="secondary"
              aria-label="დამატება"
              className="h-9 w-11 px-0 text-[18px] leading-none"
            >
              +
            </Button>
          }
        />
        <TableRow
          title="ქათმის კვერცხი, პირველი კატეგორია"
          meta1="ფუდ ტრეიდი · თარო (30 ცალი)"
          meta2="დღეს 14:00-მდე · მინ. 200 ₾"
          price={gel(12.6)}
          perUnit={gelPerUnit(0.42, "ცალი")}
          action={<Stepper value={qty} onChange={setQty} min={1} />}
        />
        <TableRow
          title="მზესუმზირის ზეთი"
          meta1="ოლიმპი · ბიდონი 5 ლ"
          meta2="ხვალ 12:00-მდე · მინ. 100 ₾"
          price={gel(38)}
          perUnit={gelPerUnit(7.6, "ლ")}
          unavailable
        />
        <TableRow
          title="ხახვი, ტომარა"
          meta1="მწვანე ბაზარი · ტომარა 25 კგ"
          meta2="ხვალ 08:00-მდე · მინ. 120 ₾"
          price={gel(30)}
          perUnit={gelPerUnit(1.2, "კგ")}
          interactive
          onClick={() => {}}
        />
      </Variant>
    </Group>
  );
}

/* ------------------------------------------------------------------ sheets --- */

function Sheets() {
  const [basic, setBasic] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <Group title="ფურცელი / მოდალი">
      <Variant label="მობილურზე ქვედა ფურცელი · დიდ ეკრანზე ცენტრში · radius 10, ერთი ჩრდილი">
        <Button variant="secondary" onClick={() => setBasic(true)}>
          ინფორმაციის ფურცელი
        </Button>
        <Button variant="destructive" onClick={() => setConfirm(true)}>
          უარყოფის დადასტურება
        </Button>
      </Variant>

      <Sheet
        open={basic}
        onClose={() => setBasic(false)}
        title="მიწოდების პარამეტრები"
        description="აგრო ჯგუფი"
      >
        <ul className="space-y-2 text-body text-ink">
          <li>რაიონები: ვაკე, საბურთალო, ისანი</li>
          <li>მინიმალური შეკვეთა: 150 ₾</li>
          <li>მიღების ბოლო დრო: 18:00</li>
          <li>მიწოდების დღეები: ორშ – შაბ</li>
        </ul>
      </Sheet>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="შეკვეთის უარყოფა"
        description="შეკვეთა #2026-0431"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              გაუქმება
            </Button>
            <Button variant="destructive" onClick={() => setConfirm(false)}>
              უარყოფა
            </Button>
          </>
        }
      >
        <p className="text-body text-ink">
          უარყოფის მიზეზი გადაეცემა შემკვეთს. ეს მოქმედება შეუქცევადია.
        </p>
        <div className="mt-4">
          <Input label="მიზეზი" placeholder="მაგ. მარაგი ამოიწურა" />
        </div>
      </Sheet>
    </Group>
  );
}
