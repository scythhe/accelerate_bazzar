# Accelerate — v1 Build Specification

Read `CLAUDE.md` first for business context. This document defines exactly what
to build. Anything not in this document is out of scope for v1.

**Before writing code:** complete Milestone 0 (schema + migrations + seed) and
stop. Show me the schema for review. Do not continue to M1 until I approve it.
If any part of this spec is ambiguous or you believe it is wrong, say so before
building rather than guessing.

---

## 1. Stack

- **Next.js (App Router), TypeScript** — one codebase, server and client.
- **PostgreSQL** with the `pg_trgm` extension enabled.
- **Drizzle ORM** with SQL migrations checked into the repo.
- **Tailwind CSS**, no component library. Small set of hand-built primitives.
- **Vitest** for unit and integration tests. **Playwright** for two or three
  critical end-to-end flows only.
- Node 20+.

No Redis, no queues, no external services beyond Postgres and an SMS gateway.
Background work (there is almost none) runs in-request or via a cron route.

If you would strongly prefer a different backend, say so with reasoning before
starting — but the default is the above and TypeScript end-to-end.

### Environment variables

```
DATABASE_URL
SESSION_SECRET
SMS_PROVIDER=console|<provider>
SMS_API_KEY
SMS_SENDER_ID
APP_URL
```

`SMS_PROVIDER=console` must work with no credentials — OTP codes print to the
server log. All local development runs this way.

---

## 2. Roles and authentication

### Organisations, not users

Everything is owned by an **organisation**. A user belongs to one or more
organisations through a membership with a role. There is no such thing as data
owned by a bare user.

Organisation types: `SUPPLIER`, `BUYER`, `PLATFORM`.

Roles: `OWNER`, `STAFF` (within a buyer or supplier org), `ADMIN` (platform org
only).

### Auth flow

Phone number + SMS one-time code. No passwords, no email.

1. User enters Georgian phone number (`+995` prefix, normalise input — accept
   `599123456`, `0599123456`, `+995599123456`, store canonical `+995599123456`).
2. Server generates a 6-digit code, stores a **hash** of it with a 5-minute
   expiry, sends by SMS.
3. User submits code. On success, create a session.
4. Session is an **opaque random token stored in the database**, set as an
   `httpOnly`, `secure`, `sameSite=lax` cookie. 30-day expiry, sliding. Not a
   JWT — sessions must be revocable.
5. If the phone belongs to memberships in more than one org, prompt to pick one.
   The active org is part of the session.

Rate limits: max 3 code requests per phone per 15 minutes, max 10 per IP per
hour, max 5 verification attempts per code. Codes are single-use. Compare hashes
in constant time.

### Registration

Self-service registration creates a **pending** organisation; it cannot log in
or transact until a platform admin approves it. This is correct because
onboarding happens by hand anyway, and it prevents competitors from creating
accounts to scrape prices.

Registration form collects: org type, legal company name, tax ID (ს/კ),
contact person name, phone, and — for buyers — delivery address and district.

---

## 3. Data model

Write this as Drizzle schema with SQL migrations. All tables get `id` (uuid),
`created_at`, `updated_at`.

```
organizations
  id, type (SUPPLIER|BUYER|PLATFORM), status (PENDING|ACTIVE|SUSPENDED)
  legal_name, display_name, tax_id, phone, email?
  logo_url?

users
  id, phone (unique, canonical +995 format), full_name, last_login_at

memberships
  user_id, organization_id, role (OWNER|STAFF|ADMIN)
  unique(user_id, organization_id)

sessions
  id, token_hash (unique), user_id, active_organization_id
  expires_at, last_seen_at, user_agent, ip

otp_codes
  id, phone, code_hash, expires_at, consumed_at?, attempts

addresses
  id, organization_id, label, district (enum), street, notes?, is_default

-- Canonical catalogue (platform-owned, the backbone of search)
categories
  id, slug, name_ka, name_en, sort_order

canonical_items
  id, category_id, name_ka, name_en
  base_unit (KG|L|PIECE)
  search_terms text[]        -- see §5
  is_active

-- Supplier catalogue
supplier_products
  id, supplier_org_id, canonical_item_id?   -- nullable until mapped
  name_ka                                    -- supplier's own wording
  description_ka?
  base_unit (KG|L|PIECE)                     -- must equal canonical's if mapped
  pack_label_ka                              -- "თარო (30 ცალი)", "ტომარა 25კგ"
  pack_quantity numeric                      -- base units per pack, see §4
  price_per_pack numeric                     -- GEL, gross
  price_per_base_unit numeric GENERATED      -- price_per_pack / pack_quantity
  min_order_packs int default 1
  is_available boolean default true
  image_url?

supplier_delivery_settings
  supplier_org_id (unique)
  districts (enum[])            -- Tbilisi districts served
  min_order_value numeric       -- GEL
  order_cutoff_time time        -- orders after this go to the next day
  delivery_days int[]           -- 1..7
  lead_time_hours int
  notes_ka?

-- Ordering
carts
  id, buyer_org_id, user_id
cart_items
  cart_id, supplier_product_id, packs int
  unique(cart_id, supplier_product_id)

orders
  id, order_number (human-readable, sequential per year)
  buyer_org_id, supplier_org_id, placed_by_user_id
  status (PLACED|CONFIRMED|REJECTED|DELIVERED|CANCELLED)
  requested_delivery_date, delivery_address_snapshot jsonb
  buyer_note?, supplier_note?, rejection_reason?
  subtotal numeric
  -- snapshots for the future rs.ge waybill:
  buyer_legal_name, buyer_tax_id, supplier_legal_name, supplier_tax_id

order_items
  order_id, supplier_product_id
  name_ka_snapshot, pack_label_snapshot, base_unit_snapshot
  pack_quantity_snapshot, price_per_pack_snapshot
  packs int, line_total numeric

order_events                     -- APPEND ONLY. No updates, no deletes.
  id, order_id, actor_user_id?, actor_org_id?
  event (PLACED|CONFIRMED|REJECTED|DELIVERED|CANCELLED|NOTE_ADDED)
  payload jsonb, created_at

price_history                    -- APPEND ONLY
  id, supplier_product_id, old_price, new_price, changed_by_user_id, created_at
```

Every order line **snapshots** the product name, pack, unit and price. A
supplier changing a price must never alter the record of an order already
placed.

Indexes: `supplier_products(canonical_item_id)`,
`supplier_products(supplier_org_id)`, `supplier_products(price_per_base_unit)`,
GIN trigram indexes per §5, `orders(buyer_org_id, created_at desc)`,
`orders(supplier_org_id, status, created_at desc)`.

---

## 4. The unit system — get this exactly right

This is the part most likely to be built wrong, and it is very expensive to fix
later. Read it twice.

There are exactly **three base units**: `KG`, `L`, `PIECE`. Nothing else.

Every supplier product is sold as a **pack**. A pack has a human label in
Georgian and a numeric quantity expressed **in base units**.

```
price_per_base_unit = price_per_pack / pack_quantity
```

Worked examples:

| Product | base_unit | pack_label_ka | pack_quantity | price_per_pack | → per base unit |
|---|---|---|---|---|---|
| Eggs, C1 | PIECE | თარო (30 ცალი) | 30 | 12.00 | 0.40 / ცალი |
| Sunflower oil | L | ბიდონი 5 ლ | 5 | 38.00 | 7.60 / ლ |
| Onions, sack | KG | ტომარა 25 კგ | 25 | 30.00 | 1.20 / კგ |
| Onions, loose | KG | კგ | 1 | 1.40 | 1.40 / კგ |
| Sulguni cheese | KG | ბლოკი ~2 კგ | 2 | 34.00 | 17.00 / კგ |
| Pickled cucumbers | KG | ვედრო 10 კგ | 10 | 45.00 | 4.50 / კგ |

Rules:
- `pack_quantity > 0`, enforced by a check constraint.
- If `canonical_item_id` is set, `base_unit` **must** equal the canonical item's
  `base_unit`. Enforce in application validation and reject the write otherwise.
- Buyers order in **whole packs**, never fractional. The quantity control is a
  stepper, minimum `min_order_packs`.
- Search results and the cart display **both** numbers: `price_per_pack` as the
  price the buyer pays, and `price_per_base_unit` as the comparison figure. The
  comparison figure is what makes the platform useful — it must be present
  everywhere prices are shown next to each other.
- Products whose real weight varies (a cheese block, a whole fish) use the
  nominal pack quantity and the label carries the `~`. v1 does not reconcile
  actual delivered weight; that is a v1.5 concern.

---

## 5. Search — this is the product

A buyer types `კვერცხი` and must immediately see every supplier who has eggs,
with prices, sorted so the cheapest comparable option is obvious. Search quality
is the difference between this platform being used and being abandoned.

### The canonical layer

Suppliers name things inconsistently: `კვერცხი C1`, `ქათმის კვერცხი პირველი
კატეგორია`, `კვერცხი დიდი`. Free-text matching across these produces fragmented,
uncomparable results.

So: platform admins maintain a **canonical catalogue** (`canonical_items`), and
each `supplier_product` is mapped to one canonical item. Search resolves the
query to canonical items, then returns the supplier products mapped to them.
That is what makes an aligned price comparison possible.

Mapping is an admin task with a work queue (§6). Unmapped products must still be
findable — see the fallback below — so the catalogue is never dead while the
queue has a backlog.

### Georgian text matching

- Georgian script is **unicameral** — there is no upper/lower case. Do not
  apply case folding logic, and never use `text-transform: uppercase` on
  Georgian text in the UI.
- Postgres has no Georgian full-text dictionary. Use the `simple` FTS config
  combined with **`pg_trgm` trigram similarity**, which handles Georgian well.
- Normalise queries: trim, collapse internal whitespace, strip punctuation.

`canonical_items.search_terms` is a `text[]` containing, for each item:
- the Georgian name and its common plural/declined forms (`კვერცხი`,
  `კვერცხები`)
- common misspellings
- Latin transliterations, because some people type on a Latin keyboard
  (`kvercxi`, `kvertskhi`)
- the Russian term where it is still in commercial use in Georgian wholesale
  (`яйца`) — this is real, do not skip it
- the English name

Build a GIN trigram index over a materialised concatenation of `search_terms`.

### Query pipeline

1. Normalise the input.
2. Match against `canonical_items` via trigram similarity on `search_terms`
   (threshold ~0.3, tune against the seed data). Also match `categories` so
   `რძის პროდუქტი` returns the whole category.
3. Fetch `supplier_products` where `canonical_item_id` is in the matched set,
   `is_available = true`, and the supplier org is `ACTIVE`.
4. **Fallback:** additionally trigram-match `supplier_products.name_ka` directly,
   and union the results in below the canonical matches. This keeps unmapped
   products findable.
5. Apply filters, sort, return.

### Filters (all applied server-side)

- **Delivers to my district** — defaults to **ON**, using the buyer's default
  address. A supplier who cannot deliver to Gldani is noise to a buyer in
  Gldani.
- Category
- Minimum order value ≤ selected threshold
- Available today (respects the supplier's `order_cutoff_time` and `lead_time_hours`)

### Sort

Default: `price_per_base_unit` ascending. Alternatives: delivery lead time,
minimum order value, supplier name.

### Type-ahead

Debounced (250ms) suggestions drawn from `canonical_items` and `categories`
only, capped at 8. Suggestions are cheap; do not query supplier products for
them.

### Rate limiting

Search is the endpoint a competitor will hammer. Authenticated only, and
rate-limited per organisation (e.g. 60 requests/minute) with a logged warning
above threshold.

---

## 6. Screens and flows

Georgian UI throughout. No English strings visible to users in v1.

### Public

- **Landing** — deliberately minimal. One clear sentence on what the platform
  does, a login button, a registration link. **No catalogue, no prices, no
  supplier list visible without authentication.** No SEO work, no marketing
  sections, no testimonials.
- **Login** — phone → OTP → (org picker if multiple).
- **Register** — the form in §2. On submit, a confirmation screen explaining
  that an operator will call to activate the account.

### Buyer

- **Home = search.** The search field is the page. Below it: recent orders, and
  a compact category grid for browsing. No dashboard, no charts, no hero.
- **Search results** — see §7 for the layout requirement.
- **Supplier page** — the supplier's full catalogue, delivery districts, minimum
  order, cutoff time, delivery days. Reached by clicking a supplier name in
  results.
- **Cart** — grouped by supplier. Each group shows its own subtotal against that
  supplier's minimum order value, with a clear warning when the minimum is not
  met. The cart cannot be checked out while any group is below its minimum.
- **Checkout** — per supplier group: delivery address (default pre-selected),
  requested delivery date (respecting cutoff and delivery days), optional note.
  Confirming creates **one order per supplier group**.
- **Orders** — list with status, and a detail view with the full item list and
  the event timeline. Buyer can cancel while status is `PLACED` or `CONFIRMED`.

### Supplier

- **Home = incoming orders.** New orders first, visually distinct.
- **Order detail** — confirm, or reject with a required reason. After confirming,
  mark as delivered.
- **Catalogue** — table of products with inline availability toggle and inline
  price editing (price changes write to `price_history`). Add and edit product
  forms.
- **Import** — upload CSV or XLSX. Columns: name, base unit, pack label, pack
  quantity, price per pack, min packs. Show a **preview with per-row validation
  errors before committing anything.** This matters more than it looks: every
  supplier's price list already lives in Excel, and manual re-entry is the
  single biggest reason they will abandon the platform.
- **Delivery settings** — districts, minimum order value, cutoff time, delivery
  days, lead time.
- **Company profile.**

### Platform admin

- **Registration queue** — approve or reject pending organisations.
- **Mapping queue** — unmapped `supplier_products` with suggested canonical
  matches (trigram-ranked). One-click accept, or search for the right item, or
  create a new canonical item inline. This queue must be fast to work through;
  it is a daily task.
- **Canonical catalogue** — CRUD for categories and canonical items, including
  editing `search_terms`.
- **Orders** — read-only list across the platform for support.

### Order state machine

```
PLACED ──▶ CONFIRMED ──▶ DELIVERED
   │            │
   │            └──▶ CANCELLED   (buyer)
   ├──▶ REJECTED                 (supplier, reason required)
   └──▶ CANCELLED                (buyer)
```

Every transition writes an `order_events` row. Transitions not on this diagram
are rejected server-side, and the check is by role: a buyer cannot confirm, a
supplier cannot cancel.

### Notifications

Define a `NotificationSender` interface with a `console` implementation for
development and an SMS implementation for production. **All notification sending
goes through it** — Viber and WhatsApp will be added later and must not require
touching call sites.

v1 notifications:
- Order placed → SMS to supplier
- Order confirmed / rejected → SMS to buyer
- Organisation approved → SMS to the contact

---

## 7. Design

### Direction

This is a tool used at 6am by a kitchen manager on a phone, often in a hurry,
often with one hand. Calm, legible, dense where density helps comparison,
generous where it helps tapping. Georgian in feel through typography and
restraint, not through ornament, patterns, or national motifs. Nothing
decorative survives that does not help someone find a price faster.

### Typography

**FiraGO** as the single family, with `Noto Sans Georgian` as fallback. FiraGO is
open source and its Georgian was drawn alongside its Latin, so numbers, Latin
and Mkhedruli sit together properly — which matters on every price row.

- Weights: 400 body, 500 emphasis and labels, 700 for prices and headings.
- **`font-variant-numeric: tabular-nums` on every price and quantity.**
  Non-negotiable. Prices must align vertically down a column or scanning them is
  impossible.
- Body line-height 1.6. Georgian has more ascenders and descenders than Latin and
  suffocates at 1.4.
- Do not tighten letter-spacing on Georgian text.
- Never `text-transform: uppercase` — Georgian has no case, and Mtavruli is a
  separate style, not a transform.
- Sentence case for all labels and buttons.

### Colour tokens

```css
--paper:      #FBFBF9;   /* page background */
--surface:    #FFFFFF;   /* rows, cards, sheets */
--ink:        #1C1B19;   /* primary text */
--ink-muted:  #6B6862;   /* secondary text, units, labels */
--line:       #E4E2DC;   /* dividers, borders */
--accent:     #7A1F2B;   /* deep wine red */
--ok:         #1F6B3F;   /* confirmed, available */
--warn:       #A66300;   /* pending, below minimum */
--danger:     #A32020;   /* rejected, destructive */
```

The accent appears **only** on: primary buttons, the active navigation item, and
the order total. Nowhere else. No gradients, no tinted backgrounds, no coloured
section washes.

### Search results layout — the one hard requirement

Results are a **dense list with a right-aligned price column**, not a grid of
cards. The buyer's whole job on this screen is comparing prices across
suppliers, and cards break the vertical alignment that makes comparison
possible. The comparison price sits directly under the pack price in the same
column.

```
┌──────────────────────────────────────────────────────────────┐
│  კვერცხი                                    [ 8 შედეგი ]     │
│  ⌄ კატეგორია   ⌄ მიწოდება: ვაკე ✓   ⌄ მინ. შეკვეთა          │
├──────────────────────────────────────────────────────────────┤
│  კვერცხი C1                                       12.00 ₾    │
│  აგრო ჯგუფი · თარო (30 ცალი)                  0.40 ₾/ცალი   │
│  ხვალ 09:00-მდე · მინ. 150 ₾                       [ + ]     │
├──────────────────────────────────────────────────────────────┤
│  ქათმის კვერცხი, პირველი კატეგორია                 12.60 ₾   │
│  ფუდ ტრეიდი · თარო (30 ცალი)                  0.42 ₾/ცალი   │
│  დღეს 14:00-მდე · მინ. 200 ₾                       [ + ]     │
└──────────────────────────────────────────────────────────────┘
```

Left column is left-aligned; the price column is right-aligned and tabular. On
mobile the row keeps this structure — it compresses, it does not become a card.

### Interaction

- Minimum tap target 44×44px throughout.
- Quantity is a **stepper**, not a free-text number field.
- Sticky cart summary bar at the bottom on mobile, showing item count, running
  total, and whether each supplier's minimum is met.
- Motion only as feedback for a user action: item added to cart, order
  confirmed. No scroll-triggered reveals, no hover animation on rows.
- Visible keyboard focus rings. Respect `prefers-reduced-motion`.

### Empty and error states

Empty search: name what was searched, and offer the nearest categories as
alternatives. Never a bare "no results". Errors state plainly what happened and
what to do next, in Georgian, in the interface's voice — no apologies, no vague
"something went wrong".

---

## 8. Security requirements

These are acceptance criteria, not suggestions.

**Tenant isolation.** Every query that touches org-owned data goes through a
data-access layer that takes the active organisation from the session and scopes
explicitly. Never take an org id from a request body or query parameter and
trust it. If row-level security is enabled, it is a backstop only — application
scoping is the boundary.

**Required test suite: `tests/isolation.test.ts`.** It runs in CI and must
contain at minimum:

- Buyer A requesting Buyer B's order by id → 404 (not 403 — do not confirm the
  record exists).
- Supplier A requesting Supplier B's product by id → 404.
- Supplier A requesting an order belonging to Supplier B → 404.
- A supplier fetching an order that includes only that supplier's lines, never
  the buyer's other orders or other suppliers' pricing.
- Every catalogue, search, cart and order endpoint returns 401 when
  unauthenticated.
- A buyer attempting `CONFIRMED` transition → 403.
- A supplier attempting `CANCELLED` transition → 403.
- A pending (unapproved) organisation cannot read or write anything.

Every new endpoint added later gets a case in this file. Say so in the README.

**Other requirements:**
- OTP rate limits and hashing per §2, verified by tests.
- Session cookies `httpOnly`, `secure`, `sameSite=lax`. Session rotation on
  login. Logout deletes the row, not just the cookie.
- Input validation with Zod at every route boundary. Never pass a request body
  into an ORM call unvalidated.
- Uploads (product images, import files): strict MIME allowlist, size cap, random
  server-generated filenames, served from a path that cannot execute.
- Search and OTP endpoints rate-limited per org and per IP.
- Security headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`,
  `Strict-Transport-Security`.
- Secrets from environment only. No credentials in the repo. Add a
  `.env.example`.
- `order_events` and `price_history` are append-only. Enforce with a database
  trigger that rejects UPDATE and DELETE, not just by convention.
- Automated daily database backup, and a documented restore procedure in the
  README that has actually been run once.

---

## 9. Seed data

Seed a realistic Tbilisi dataset so search can be evaluated properly. Do not use
`foo`/`bar` placeholders — bad seed data hides bad search.

**Districts enum:** ვაკე, საბურთალო, ვერა, მთაწმინდა, ჩუღურეთი, დიდუბე,
ნაძალადევი, გლდანი, სამგორი, ისანი, კრწანისი, დიღომი.

**Categories:** ხილი და ბოსტნეული · ხორცი · ფრინველი · თევზი და ზღვის პროდუქტი ·
რძის პროდუქტი · კვერცხი · ბაკალეა · პური და საცხობი · სანელებლები · ზეთი და
ძმარი · კონსერვი და მწნილი · გაყინული პროდუქტი · უალკოჰოლო სასმელი · ალკოჰოლი ·
ერთჯერადი ჭურჭელი · სახარჯი მასალა

**Canonical items** — around 60, spread across those categories, including:
კვერცხი C1, კვერცხი C0, ხახვი, კარტოფილი, სტაფილო, პომიდორი, კიტრი, მწნილი კიტრი,
ჯონჯოლი, სულგუნი, იმერული ყველი, მაწონი, არაჟანი, კარაქი, რძე, ფქვილი, შაქარი,
მარილი, ბრინჯი, მაკარონი, მზესუმზირის ზეთი, ზეითუნის ზეთი, ქათმის ხორცი,
ღორის ხორცი, საქონლის ხორცი, კარაქი, ტომატის პასტა.

Each canonical item gets a properly populated `search_terms` array with Georgian
variants, Latin transliteration, Russian where relevant, and English.

**Organisations:** 8 supplier orgs with overlapping catalogues and *different
prices for the same canonical item* — otherwise the comparison feature cannot be
evaluated. Different delivery districts, minimums and cutoff times across them.
3 buyer orgs in different districts. 1 platform org.

Leave roughly 15% of supplier products unmapped, to exercise the admin mapping
queue and the search fallback path.

---

## 10. Build order

Stop at the end of each milestone and report before continuing.

- **M0** — Repo, Next.js + TypeScript + Tailwind + Drizzle, Postgres with
  `pg_trgm`, full schema, migrations, seed script, CI running lint and tests.
  **Stop here for schema review.**
- **M1** — Phone OTP auth, sessions, organisations, memberships, roles,
  registration with admin approval, the tenant-scoped data-access layer, and the
  first version of `tests/isolation.test.ts`.
- **M2** — Supplier catalogue: product CRUD, the unit system with validation,
  price history, availability toggle, delivery settings, CSV/XLSX import with
  validated preview.
- **M3** — Canonical catalogue, admin mapping queue with trigram suggestions,
  the search pipeline with trigram indexes, filters, sort, type-ahead. Verify
  search quality against the seed data before moving on.
- **M4** — Buyer flow: search UI, results layout, supplier page, multi-supplier
  cart with per-supplier minimums, checkout producing one order per supplier,
  order list and detail.
- **M5** — Supplier order dashboard, state machine with role checks, event log,
  `NotificationSender` with console and SMS implementations.
- **M6** — Hardening: complete the isolation suite, rate limits, security
  headers, append-only triggers, backups and documented restore, empty and error
  states, mobile pass, accessibility pass.

## 11. Definition of done for v1

- A supplier can register, be approved, import a 100-row price list from Excel,
  set delivery settings, and receive and confirm an order — entirely in
  Georgian, without help.
- A buyer can search `კვერცხი`, see every supplier who delivers to their
  district with aligned comparable prices, add items from three different
  suppliers, and check out into three orders — on a phone, in under 90 seconds.
- `tests/isolation.test.ts` passes and covers every listed case.
- No English is visible anywhere in the buyer or supplier interface.
- Lighthouse mobile performance ≥ 85 on the search results page.
- The restore procedure in the README has been executed successfully once.

## 12. Explicitly out of scope

In-app payments. Chat or messaging. Ratings and reviews. Delivery tracking.
Inventory or par-levels. AI order intake. rs.ge waybill generation. Buyer-specific
negotiated pricing. Native mobile apps. Cities other than Tbilisi. English UI.
Marketing site or SEO. Referral or invite systems. Non-food categories.
Subscription billing (invoiced manually offline for now).

Do not build any of these. If one seems necessary to make v1 work, raise it
rather than building it.
