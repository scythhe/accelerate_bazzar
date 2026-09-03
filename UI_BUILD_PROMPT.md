# Accelerate — UI Build Specification

Read `CLAUDE.md` first for business context. `V1_BUILD_PROMPT.md` describes the
eventual backend — read it to understand the data shapes, but **do not build any
of it yet.**

This document covers the frontend only.

---

## 1. What we are building and why

A complete, clickable, Georgian-language frontend for Accelerate, running
entirely on mock data. No database, no authentication backend, no API.

The purpose is not to be a prototype we throw away. It has two jobs:

1. **It is the sales demo.** Suppliers and restaurants are being onboarded by
   hand, in person, by a founder with existing relationships. He needs to hand
   someone a phone and have them understand the product in thirty seconds. Every
   screen must therefore look and behave like a finished product, populated with
   realistic Georgian data — never with placeholder text, lorem ipsum, or empty
   tables.
2. **It becomes the real frontend.** The mock data layer mirrors the eventual
   schema exactly, so wiring up the backend later is a change to one directory,
   not a rewrite.

Consequence: polish matters more than completeness here. A screen that exists
but looks unfinished is worse than a screen that does not exist.

---

## 2. Stack

- **Next.js (App Router), TypeScript**
- **Tailwind CSS**, no component library — a small set of hand-built primitives
- No database, no ORM, no API routes that persist anything
- State that needs to survive navigation (cart, mock session) lives in React
  context, held in memory. **No localStorage, no sessionStorage.**

---

## 3. The mock data layer

All data lives in `/lib/mock/`. This directory is the seam that gets replaced
later, so respect the boundary strictly.

```
/lib/mock/
  types.ts       -- TypeScript types mirroring the schema in V1_BUILD_PROMPT.md §3
  data.ts        -- the seeded dataset (§9 of V1_BUILD_PROMPT.md)
  api.ts         -- async functions returning that data
  session.ts     -- the fake session / persona switcher
```

Rules:

- `types.ts` mirrors the real database schema field-for-field, including
  `pack_quantity`, `price_per_base_unit`, snapshot fields on order items, and the
  order event log. Do not invent a simpler frontend-only shape — the whole point
  is that these types survive the backend build.
- Everything in `api.ts` is `async` and returns a Promise, even though it
  resolves from memory. Add a small artificial delay (~150–300ms) so loading
  states are real and get built properly.
- Search, filtering and sorting are implemented **in `api.ts`**, not in
  components. Components call `searchProducts(query, filters, sort)` and render
  the result. When the backend arrives, that function body is swapped for a fetch
  and nothing else changes.
- No component imports `data.ts` directly. Everything goes through `api.ts`.

### Search in the mock layer

Implement the pipeline from `V1_BUILD_PROMPT.md` §5 in TypeScript:

1. Normalise the query — trim, collapse whitespace, strip punctuation.
2. Match against each canonical item's `search_terms` array using a simple
   similarity function (bigram/trigram overlap is fine, ~40 lines).
3. Return supplier products mapped to matched canonical items.
4. Fall back to matching supplier product names directly, ranked below.
5. Apply filters, then sort by `price_per_base_unit` ascending by default.

Georgian is unicameral — no case folding. `search_terms` must include Georgian
variants, Latin transliterations (`kvercxi`, `kvertskhi`), the Russian term where
it is used in Georgian wholesale (`яйца`), and English.

Typing `კვერცხი` must return eight suppliers at different prices. If it does
not, the demo is dead. Test this before moving on.

### The persona switcher

A small floating control, visible only in development, that switches the active
persona without any login flow:

- Buyer — "რესტორანი ოქტოპუსი" (Vake)
- Buyer — a second restaurant in a different district, so the district filter is
  demonstrable
- Supplier — "აგრო ჯგუფი"
- Platform admin

Switching persona changes the navigation, the accessible routes, and the data
shown. This is the single most useful thing for demoing, so build it early.

---

## 4. Screens

All Georgian. Build every state for each screen: default, loading, empty, and
error.

### Public
- **Landing** — deliberately minimal. What Accelerate does in one sentence, a
  login button, a registration link. No catalogue or prices visible. No marketing
  sections, no testimonials, no feature grid, no SEO copy.
- **Login** — phone number → 6-digit code. Fully mocked: any well-formed Georgian
  number is accepted, and the code `123456` always works. Show the input mask,
  the resend countdown, and the invalid-code error state.
- **Register** — org type, legal company name, tax ID (ს/კ), contact name, phone,
  and for buyers an address and district.
- **Registration submitted** — confirmation that an operator will call to
  activate the account.

### Buyer
- **Home** — the search field *is* the page. Below it: recent orders, and a
  compact category grid. No dashboard, no charts, no hero banner.
- **Search results** — see §6. This is the most important screen in the product;
  build it last among the buyer screens, after the primitives are settled, and
  spend disproportionate time on it.
- **Supplier page** — that supplier's catalogue, delivery districts, minimum
  order, cutoff time, delivery days.
- **Cart** — grouped by supplier, each group showing its own subtotal against
  that supplier's minimum order value, with a clear warning state when the
  minimum is not met. Checkout is blocked while any group is short.
- **Checkout** — per supplier group: delivery address, requested delivery date
  (respecting cutoff time and delivery days), optional note.
- **Order placed** — confirmation showing the orders created, one per supplier.
- **Orders** — list with status, and a detail view with items and the event
  timeline.
- **Settings** — company profile, delivery addresses, team members.

### Supplier
- **Home** — the incoming orders inbox. New orders first, visually distinct.
- **Order detail** — confirm, or reject with a required reason; then mark
  delivered.
- **Catalogue** — table with inline availability toggle and inline price editing.
- **Add / edit product** — with the unit system from `V1_BUILD_PROMPT.md` §4 and
  a live preview of the computed per-base-unit price as the user types. That live
  computation is the thing that teaches suppliers how the pricing model works, so
  make it prominent.
- **Import** — file picker, then a validated preview table with per-row errors
  before anything commits. Mock the parse; show a realistic mix of valid rows and
  errors.
- **Delivery settings** — districts, minimum order value, cutoff time, delivery
  days, lead time.
- **Company profile.**

### Platform admin
- **Registration queue** — approve or reject pending organisations.
- **Mapping queue** — unmapped supplier products with ranked suggested canonical
  matches, one-click accept, or search for the right item. Optimise this screen
  for speed and keyboard use; it is a daily task.
- **Canonical catalogue** — categories and canonical items, including editing
  `search_terms`.
- **Orders** — read-only list across the platform.

### Order status display

`განთავსებულია` → `დადასტურებულია` → `მიწოდებულია`, plus `უარყოფილია` and
`გაუქმებულია`. Each has a distinct, quiet visual treatment — a coloured dot and
a label, not a filled badge on every row.

---

## 5. Design

### Direction

A tool used at 6am by a kitchen manager on a phone, often in a hurry, often
one-handed. Calm, legible, dense where density helps comparison, generous where
it helps tapping. Georgian in feel through typography and restraint, not through
ornament or national motifs. Nothing decorative survives that does not help
someone find a price faster.

The Accelerate wordmark — bold, geometric, angular — is the only loud element in
the entire interface. Everything around it stays quiet and disciplined. Do not
echo the wordmark's angularity in buttons, cards, or dividers; let it be the one
place the brand raises its voice.

### Typography

**FiraGO** as the single family, `Noto Sans Georgian` as fallback. FiraGO is open
source and its Georgian was drawn alongside its Latin, so Mkhedruli, Latin and
numerals sit together properly — which matters on every price row.

- Weights: 400 body, 500 labels and emphasis, 700 prices and headings.
- **`font-variant-numeric: tabular-nums` on every price and quantity.**
  Non-negotiable — prices must align vertically down a column or scanning them
  is impossible.
- Body line-height 1.6. Georgian has more ascenders and descenders than Latin
  and suffocates at 1.4.
- Do not tighten letter-spacing on Georgian text.
- Never `text-transform: uppercase`. Georgian has no case; Mtavruli is a separate
  style, not a transform. This applies to labels and buttons too.
- Sentence case everywhere.

### Colour tokens

```css
--paper:      #FBFBF9;   /* page background */
--surface:    #FFFFFF;   /* rows, sheets, panels */
--ink:        #1C1B19;   /* primary text */
--ink-muted:  #6B6862;   /* units, secondary labels */
--line:       #E4E2DC;   /* dividers, borders */
--accent:     #7A1F2B;   /* placeholder — set to the Accelerate brand colour */
--ok:         #1F6B3F;   /* confirmed, available */
--warn:       #A66300;   /* pending, below minimum */
--danger:     #A32020;   /* rejected, destructive */
```

`--accent` is a single token used in exactly three places: primary buttons, the
active navigation item, and the order total. Nowhere else. No gradients, no
tinted section backgrounds, no coloured washes.

### Search results layout — the one hard requirement

Results are a **dense list with a right-aligned price column**, not a grid of
cards. The buyer's entire job on this screen is comparing prices across
suppliers, and cards destroy the vertical alignment that makes comparison
possible. The per-unit comparison price sits directly beneath the pack price, in
the same column.

```
┌──────────────────────────────────────────────────────────────┐
│  კვერცხი                                    [ 8 შედეგი ]     │
│  ⌄ კატეგორია   ⌄ მიწოდება: ვაკე ✓   ⌄ მინ. შეკვეთა          │
├──────────────────────────────────────────────────────────────┤
│  კვერცხი C1                                       12.00 ₾    │
│  აგრო ჯგუფი · თარო (30 ცალი)                  0.40 ₾/ცალი   │
│  ხვალ 09:00-მდე · მინ. 150 ₾                       [ + ]     │
├──────────────────────────────────────────────────────────────┤
│  ქათმის კვერცხი, პირველი კატეგორია                12.60 ₾    │
│  ფუდ ტრეიდი · თარო (30 ცალი)                  0.42 ₾/ცალი   │
│  დღეს 14:00-მდე · მინ. 200 ₾                       [ + ]     │
└──────────────────────────────────────────────────────────────┘
```

Left column left-aligned, price column right-aligned and tabular. On mobile the
row compresses but keeps this structure — it does not become a card.

Delivery lead time and minimum order appear on **every** row. A cheap price from
a supplier who cannot deliver to this district until Thursday is worse than no
result, so the buyer must never have to click through to find that out. The
"delivers to my district" filter defaults to **on**.

### Interaction

- Minimum tap target 44×44px throughout.
- Quantity is a **stepper**, never a free-text number field.
- Sticky cart bar at the bottom on mobile: item count, running total, and
  whether every supplier's minimum is met.
- Motion only as feedback for a user action — item added to cart, order
  confirmed. No scroll-triggered reveals, no hover animation on rows.
- Visible keyboard focus rings. Respect `prefers-reduced-motion`.
- Mobile-first. Design each screen at 380px, then adapt upward.

### Empty and error states

Empty search names what was searched and offers the nearest categories as
alternatives — never a bare "no results". Errors state plainly what happened and
what to do next, in the interface's voice. No apologies, no vague "something
went wrong".

---

## 6. Georgian interface strings

Starting vocabulary. Use these exact terms for consistency; extend as needed and
flag anything you are unsure about rather than guessing.

| Element | Georgian |
|---|---|
| Search | ძებნა |
| Log in / Register / Log out | შესვლა / რეგისტრაცია / გამოსვლა |
| Cart | კალათა |
| Orders | შეკვეთები |
| Place order | შეკვეთის განთავსება |
| Catalogue | კატალოგი |
| Add product | პროდუქტის დამატება |
| Delivery settings | მიწოდების პარამეტრები |
| Minimum order | მინიმალური შეკვეთა |
| Delivery / District | მიწოდება / რაიონი |
| Price / Quantity / Total | ფასი / რაოდენობა / ჯამი |
| Add / Remove / Edit / Save | დამატება / წაშლა / რედაქტირება / შენახვა |
| Cancel / Confirm / Reject | გაუქმება / დადასტურება / უარყოფა |
| Placed / Confirmed / Delivered | განთავსებულია / დადასტურებულია / მიწოდებულია |
| Rejected / Cancelled / Pending | უარყოფილია / გაუქმებულია / მოლოდინში |
| Available / Out of stock | ხელმისაწვდომი / ამოიწურა |
| No results found | შედეგი არ მოიძებნა |
| Supplier | მომწოდებელი |
| Order number / Delivery date | შეკვეთის ნომერი / მიწოდების თარიღი |
| Note | კომენტარი |
| Phone number | ტელეფონის ნომერი |
| Get code / Verification code | კოდის მიღება / დადასტურების კოდი |
| Company name / Tax ID | კომპანიის დასახელება / საიდენტიფიკაციო კოდი |
| Address | მისამართი |
| Units | ცალი · კგ · ლ |
| Packs | თარო · ტომარა · ბიდონი · ვედრო · ყუთი |

Currency is `₾`, written after the number with a space: `12.00 ₾`.

---

## 7. Build order

Stop and report at the end of each step.

1. **Foundation** — Next.js, Tailwind, design tokens, FiraGO loaded, and the
   primitive components: button, input, select, stepper, dropdown filter, status
   dot, sheet/modal, table row. Build a `/kitchen-sink` route showing every
   primitive in every state. **Stop here for review** — everything downstream
   inherits these, so they need to be right first.
2. **Mock layer** — types, seed data, `api.ts` including the search function, the
   persona switcher. Verify that searching `კვერცხი` returns eight suppliers at
   different prices before continuing.
3. **Public screens** — landing, login, register, submitted.
4. **Buyer screens** — home, supplier page, cart, checkout, order confirmation,
   orders, settings. Then search results last, with the most care.
5. **Supplier screens** — inbox, order detail, catalogue, product form with live
   per-unit computation, import preview, delivery settings, profile.
6. **Admin screens** — registration queue, mapping queue, canonical catalogue,
   orders.
7. **Polish pass** — every empty and loading state, full mobile pass at 380px,
   keyboard navigation, focus rings, reduced motion.

## 8. Definition of done

- Every screen listed in §4 exists, in Georgian, populated with realistic data.
- Searching `კვერცხი` on a 380px viewport returns eight suppliers with aligned,
  comparable prices, and items from three different suppliers can be added and
  taken through checkout into three separate orders — in under 90 seconds,
  one-handed.
- The persona switcher moves cleanly between buyer, supplier and admin views.
- No English is visible anywhere in the interface.
- No component imports mock data directly; everything goes through `api.ts`.
- Every screen has a designed empty state and loading state.
- No `localStorage`, no `sessionStorage`, no persistence of any kind.

## 9. Out of scope

Database, migrations, real authentication, API routes, SMS, file upload to a
server, payments, and everything listed in `V1_BUILD_PROMPT.md` §12. If something
seems necessary to make the UI work, mock it and raise it — do not build a
backend for it.
