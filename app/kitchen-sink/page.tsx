"use client";

import { useState } from "react";
import {
  Button,
  DropdownFilter,
  Input,
  Select,
  Sheet,
  StatusDot,
  Stepper,
  TableRow,
  type OrderStatus,
} from "@/components/ui";

export default function KitchenSinkPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-3xl font-bold tracking-tight text-ink">Accelerate</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">კომპონენტების გვერდი</h1>
        <p className="mt-1 text-base text-ink-muted">
          ყველა პრიმიტიული კომპონენტი, ყველა მდგომარეობაში. საძირკვლის ეტაპი.
        </p>
      </header>

      <Tokens />
      <Buttons />
      <Inputs />
      <Selects />
      <Steppers />
      <Filters />
      <Statuses />
      <TableRows />
      <Sheets />
    </main>
  );
}

/* ------------------------------------------------------------------ layout -- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 border-t border-line pt-6">
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Case({
  label,
  children,
  align = "start",
}: {
  label: string;
  children: React.ReactNode;
  align?: "start" | "center";
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-ink-muted">{label}</p>
      <div
        className={
          align === "center"
            ? "flex flex-wrap items-center gap-3"
            : "flex flex-wrap items-start gap-3"
        }
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ tokens -- */

function Tokens() {
  const swatches: [string, string][] = [
    ["--paper", "var(--paper)"],
    ["--surface", "var(--surface)"],
    ["--ink", "var(--ink)"],
    ["--ink-muted", "var(--ink-muted)"],
    ["--line", "var(--line)"],
    ["--accent", "var(--accent)"],
    ["--ok", "var(--ok)"],
    ["--warn", "var(--warn)"],
    ["--danger", "var(--danger)"],
  ];
  return (
    <Section title="ტოკენები">
      <Case label="ფერები">
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map(([name, value]) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-md border border-line bg-surface p-3"
            >
              <span
                className="h-9 w-9 shrink-0 rounded border border-line"
                style={{ backgroundColor: value }}
              />
              <span className="tabular text-sm text-ink-muted">{name}</span>
            </div>
          ))}
        </div>
      </Case>
      <Case label="ტიპოგრაფია — FiraGO (400 / 500 / 700)">
        <div className="w-full space-y-1">
          <p className="text-3xl font-bold text-ink">კვერცხი C1 — 12.00 ₾</p>
          <p className="text-xl font-medium text-ink">
            თარო (30 ცალი) · 0.40 ₾/ცალი
          </p>
          <p className="text-base text-ink">
            ხმარებაში მარტივი, დილის ხუთ საათზეც. Latin, ქართული და 1234567890
            ერთ რიტმში.
          </p>
          <p className="tabular text-base text-ink-muted">
            tabular-nums: 111.10 ₾ / 909.99 ₾ / 12.00 ₾
          </p>
        </div>
      </Case>
    </Section>
  );
}

/* ----------------------------------------------------------------- buttons -- */

function Buttons() {
  return (
    <Section title="ღილაკი">
      <Case label="ვარიანტები" align="center">
        <Button variant="primary">დადასტურება</Button>
        <Button variant="secondary">გაუქმება</Button>
        <Button variant="ghost">უკან</Button>
        <Button variant="danger">უარყოფა</Button>
      </Case>
      <Case label="ზომები" align="center">
        <Button size="sm">პატარა</Button>
        <Button size="md">საშუალო</Button>
        <Button size="lg">დიდი</Button>
      </Case>
      <Case label="დატვირთვა და გამორთული" align="center">
        <Button loading>იტვირთება</Button>
        <Button variant="secondary" loading>
          იტვირთება
        </Button>
        <Button disabled>გამორთული</Button>
        <Button variant="secondary" disabled>
          გამორთული
        </Button>
      </Case>
      <Case label="სრული სიგანე">
        <div className="w-full max-w-sm">
          <Button block>შეკვეთის განთავსება</Button>
        </div>
      </Case>
    </Section>
  );
}

/* ------------------------------------------------------------------ inputs -- */

function Inputs() {
  const [phone, setPhone] = useState("");
  return (
    <Section title="ველი">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="კომპანიის დასახელება" placeholder="შპს მაგალითი" />
        <Input
          label="ტელეფონის ნომერი"
          leading="+995"
          inputMode="tel"
          placeholder="599 12 34 56"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint="ნებისმიერი სწორი ქართული ნომერი მიიღება."
        />
        <Input
          label="საიდენტიფიკაციო კოდი"
          defaultValue="405123456"
          hint="ს/კ — 9 ციფრი."
        />
        <Input
          label="დადასტურების კოდი"
          defaultValue="123123"
          error="კოდი არასწორია. სცადეთ თავიდან."
        />
        <Input label="მისამართი" placeholder="ვაკე, ჭავჭავაძის 12" disabled />
        <Input
          label="ფასი"
          leading="₾"
          inputMode="decimal"
          defaultValue="12.00"
          className="tabular"
        />
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- selects -- */

function Selects() {
  const districts = [
    { value: "vake", label: "ვაკე" },
    { value: "saburtalo", label: "საბურთალო" },
    { value: "isani", label: "ისანი" },
    { value: "gldani", label: "გლდანი" },
  ];
  return (
    <Section title="ჩამოსაშლელი სია">
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="რაიონი"
          options={districts}
          placeholder="აირჩიეთ რაიონი"
          defaultValue=""
        />
        <Select label="რაიონი" options={districts} defaultValue="saburtalo" />
        <Select
          label="რაიონი"
          options={districts}
          defaultValue=""
          placeholder="აირჩიეთ რაიონი"
          error="აირჩიეთ მიწოდების რაიონი."
        />
        <Select
          label="რაიონი"
          options={districts}
          defaultValue="vake"
          disabled
        />
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- steppers -- */

function Steppers() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(3);
  return (
    <Section title="რაოდენობის ცვლა">
      <Case label="ნაგულისხმევი · მინ. 1 · ერთეული „თარო“" align="center">
        <Stepper value={a} onChange={setA} min={1} unit="თარო" />
      </Case>
      <Case label="მინ. 0 (ცარიელი მდგომარეობა)" align="center">
        <Stepper value={b} onChange={setB} min={0} />
      </Case>
      <Case label="ლიმიტით · მაქს. 5" align="center">
        <Stepper value={c} onChange={setC} min={1} max={5} unit="ტომარა" />
      </Case>
      <Case label="პატარა ზომა (ცხრილში)" align="center">
        <Stepper value={a} onChange={setA} min={1} size="sm" />
      </Case>
      <Case label="გამორთული" align="center">
        <Stepper value={2} onChange={() => {}} disabled unit="ცალი" />
      </Case>
    </Section>
  );
}

/* ----------------------------------------------------------------- filters -- */

function Filters() {
  const [cat, setCat] = useState<string[]>([]);
  const [district, setDistrict] = useState<string[]>(["vake"]);
  const [minOrder, setMinOrder] = useState<string[]>([]);
  return (
    <Section title="ფილტრი">
      <Case label="ძებნის შედეგების ფილტრები" align="center">
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
      </Case>
      <p className="text-sm text-ink-muted">
        მდგომარეობები: დახურული, ღია, აქტიური (მონიშნული). „მიწოდება: ვაკე“
        ნაგულისხმევად აქტიურია.
      </p>
    </Section>
  );
}

/* ---------------------------------------------------------------- statuses -- */

function Statuses() {
  const all: OrderStatus[] = [
    "PLACED",
    "CONFIRMED",
    "DELIVERED",
    "REJECTED",
    "CANCELLED",
  ];
  return (
    <Section title="სტატუსის ნიშნული">
      <Case label="ეტიკეტით">
        <div className="flex flex-col gap-2">
          {all.map((s) => (
            <StatusDot key={s} status={s} />
          ))}
        </div>
      </Case>
      <Case label="მხოლოდ წერტილი (ცხრილის რიგში)" align="center">
        {all.map((s) => (
          <StatusDot key={s} status={s} dotOnly />
        ))}
      </Case>
    </Section>
  );
}

/* --------------------------------------------------------------- table row -- */

function TableRows() {
  const [qty, setQty] = useState(0);
  return (
    <Section title="ცხრილის რიგი">
      <p className="text-sm text-ink-muted">
        მჭიდრო სია, ფასის სვეტი მარჯვნივ და გასწორებული. არა ბარათი.
      </p>
      <div className="overflow-hidden rounded-md border border-line">
        <TableRow
          title="კვერცხი C1"
          lines={[
            "აგრო ჯგუფი · თარო (30 ცალი)",
            "ხვალ 09:00-მდე · მინ. 150 ₾",
          ]}
          price="12.00 ₾"
          subPrice="0.40 ₾/ცალი"
          action={
            <Button size="sm" variant="secondary" aria-label="დამატება">
              +
            </Button>
          }
        />
        <TableRow
          title="ქათმის კვერცხი, პირველი კატეგორია"
          lines={[
            "ფუდ ტრეიდი · თარო (30 ცალი)",
            "დღეს 14:00-მდე · მინ. 200 ₾",
          ]}
          price="12.60 ₾"
          subPrice="0.42 ₾/ცალი"
          action={
            <Stepper value={qty} onChange={setQty} min={0} size="sm" />
          }
        />
        <TableRow
          title="მზესუმზირის ზეთი"
          lines={["ოლიო + · ბიდონი 5 ლ", "ხვალ 12:00-მდე · მინ. 100 ₾"]}
          price="38.00 ₾"
          subPrice="7.60 ₾/ლ"
          unavailable
          action={
            <Button size="sm" variant="secondary" disabled aria-label="დამატება">
              +
            </Button>
          }
        />
        <TableRow
          title="ხახვი, ტომარა"
          lines={["მწვანე ბაზარი · ტომარა 25 კგ"]}
          price="30.00 ₾"
          subPrice="1.20 ₾/კგ"
          interactive
          onClick={() => {}}
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ sheets -- */

function Sheets() {
  const [basic, setBasic] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <Section title="ფურცელი / მოდალი">
      <Case label="მობილურზე — ქვედა ფურცელი; დიდ ეკრანზე — ცენტრში" align="center">
        <Button variant="secondary" onClick={() => setBasic(true)}>
          ინფორმაციის ფურცელი
        </Button>
        <Button variant="danger" onClick={() => setConfirm(true)}>
          უარყოფის დადასტურება
        </Button>
      </Case>

      <Sheet
        open={basic}
        onClose={() => setBasic(false)}
        title="მიწოდების პარამეტრები"
        description="აგრო ჯგუფი"
      >
        <ul className="space-y-2 text-base text-ink">
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
            <Button variant="danger" onClick={() => setConfirm(false)}>
              უარყოფა
            </Button>
          </>
        }
      >
        <p className="text-base text-ink">
          უარყოფის მიზეზი გადაეცემა შემკვეთს. ეს მოქმედება შეუქცევადია.
        </p>
        <div className="mt-4">
          <Input label="მიზეზი" placeholder="მაგ. მარაგი ამოიწურა" />
        </div>
      </Sheet>
    </Section>
  );
}
