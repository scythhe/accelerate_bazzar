# Bazzar — Project Context

This file is the durable context for the project. Read it before doing anything.
It says *why* the product exists, what has been decided, and what the constraints
are. (The repository folder is still named `accelerate_bazzar`; the product was
called Accelerate until it was renamed Bazzar.)

## 0. Where things stand

**Current stage: a clickable UI demo on mock data.** It's used in conversations
with restaurant managers and distributors to get reactions, so it has to run end to
end without a dead end. There is no backend yet.

| Document | What it is |
|---|---|
| `DESIGN_SYSTEM.md` | **Authoritative for anything visual**, plus the friction rules (§7). Read it before touching UI. |
| `DEMO_PROMPT.md` | The demo's scope and the end-to-end path that must always work |
| `UI_BUILD_PROMPT.md` | The original UI brief. Where it conflicts with the two above, they win. |
| `V1_BUILD_PROMPT.md` | Backend specification. Reference for the shape of the data; **do not implement yet**. |

How the demo works:

- **Stack:** Next.js (App Router) + Tailwind, one frontend, no API.
- **Data:** `lib/mock/` is the seam a real backend replaces later. `lib/mock/api.ts`
  returns promises on purpose, so callers won't change.
- **State:** `lib/store/DemoContext.tsx` holds personas, cart, orders, catalogue
  edits and news. It persists to `localStorage` (`accelerate.demo.vN`). Bump `N`
  whenever the stored shape changes.
- **Login:** mocked. Any Georgian mobile number and code `123456`. The session
  stands in for the 30-day cookie in V1 §2.
- **Personas:** a switcher flips between buyer (რესტორანი ალაზანი) and
  distributor (აგრო ჯგუფი). The persona sheet also has logout and the demo reset.
- **Run it:** `npm run dev` (port 3100 via `.claude/launch.json`); check with
  `npm run typecheck` and `npm run build`.

---

## 1. What this is

A B2B web platform for Tbilisi, Georgia that connects **food supply companies**
(wholesale distributors) with **restaurants, cafés, hotels, bakeries and small
markets** (HoReCa buyers).

Distributors publish their catalogue with prices. Buyers search in Georgian, see
every distributor who carries an item with the price, and place an order.

The platform does not hold stock, does not deliver, and does not process payments.
It is a discovery and ordering layer on top of relationships and logistics that
already exist.

## 2. The problem, from the field

Two problems observed directly by a Tbilisi restaurant manager with 15+ years in
the industry, and confirmed as typical.

**Distributor side — wasted acquisition spend.** Field sales reps visit restaurants
in person to introduce the company and hand over a price list. A mid-size
distributor spends roughly **10,000–20,000+ GEL a month** on this, with a poor hit
rate: the manager is busy, already has a supplier they trust, and won't stop
service to hear a pitch, even for a better price.

**Buyer side — stockouts.** A kitchen runs out of pickles, eggs or onions mid-service.
The manager makes five or six calls to find someone who can deliver today, or sends
staff to buy retail at a market. It is slow, expensive and constant.

## 3. The insight the product is built on

Restaurants do **not** want to switch suppliers. Switching is about trust, delivery
reliability and payment terms, not price. A catalogue that only saves 4% on onions
will not get used.

But a restaurant that has **run out of something right now** is, for that moment,
completely open to buying from a stranger. It isn't a switch; it's a gap being
filled. Low commitment, high urgency, no loyalty conflict.

So the product's job is to be the fastest possible answer to:

> *"Who has 20kg of cucumbers and can get them to Saburtalo by tomorrow morning,
> and what does it cost?"*

Every design decision follows from that sentence. A distributor who fills three
emergency orders well has given a demonstration no sales rep could buy.
**Discovery is a side effect of solving urgency.**

**In practice:** the experience is tuned for a person in a hurry, not a person
browsing. Delivery time, minimums and availability show *in the search results*,
next to the price. A result the buyer cannot act on today is noise.

## 4. Users

**Buyer (restaurant / market)**
- Kitchen or purchasing manager. Often 40+, Georgian-speaking, not a heavy computer
  user. Uses a phone, frequently with wet or busy hands.
- Orders early morning or late evening.
- Cares about: does this distributor deliver to my district, when, what's the
  minimum, what does it cost, and can I get it now.

**Distributor**
- Office staff or the owner. The price list lives in Excel and goes out over Viber
  or on paper.
- Cares about: new customers, and not typing. Adding and updating the catalogue
  must be trivial or they won't do it.

**Platform admin (us)**
- Onboards distributors, maps their products to the shared catalogue, resolves
  disputes, manages subscriptions by hand.

## 5. Product decisions so far

These came out of demo sessions and stand until changed. Each one is reflected in
the code.

**Ordering, with as little friction as possible** (full rules in
`DESIGN_SYSTEM.md` §7)
- Login is phone, then SMS code. Each field submits itself when full, and the
  session is remembered.
- Search lives on the results page and updates as you type, with typeahead on home.
  Filters work: district (from the delivery address) and minimum order.
- One tap on + adds to the cart. Quantities can be typed, and a trash button sits
  next to the stepper's plus.
- Cart and checkout are one screen. Address, date and note default to the last
  used values.
- A distributor under their minimum never blocks the others: ready orders are sent,
  and the short one stays in the cart. Search rows warn early ("აკლია X ₾").
- Repeating a past order (`გამეორება`) puts it in the cart; one more tap sends it.

**Units — everything is sold and counted by the single piece, kg or litre**
- Prices show for one base unit ("0.40 ₾ / 1 ცალი"), never per tray or sack.
- Each product has a **minimum quantity**. The first tap on + adds that minimum,
  minus below it removes the line, and typed amounts round up to it.
- The seed's wholesale pack (a tray of 30) only derives the unit price and the
  default minimum. Base units must still be recorded properly. That is non-negotiable
  for price comparison and for waybills (§8).

**Distributor tools**
- Adding a product starts from the shared catalogue, which fills in the name, unit
  and photo and makes it comparable at once. Then a price, minimum and optional code,
  and on to the next. Unmatched products are allowed and wait for admin mapping.
- A whole price list pastes in from Excel (or a CSV): code, name, unit, price,
  minimum.
- Catalogue rows have an availability toggle, a tap-to-edit price, and delete.

**News (`სიახლეები`)**
- One feed of every distributor's new products and price changes, newest first,
  orderable straight from the feed. There is no following.
- A price change made in the app shows here at once. This is the buyer-facing side
  of the append-only price log in §9.

**Catalogue scope**
- Food plus alcohol and hygiene (napkins, toilet paper, gloves, soap). Twelve
  categories, each with a photo tile.

## 6. Business model

- **Free for buyers, always.** No subscription, no fee, no commission that raises
  their price. Demand is the scarce side of this market.
- **Free for distributors until there is liquidity** (first 3–6 months). Then a
  monthly subscription priced against what they already spend on field reps.
- Tiers are priced on **value received** (orders, inbound demand), **never on the
  number of SKUs**. We want whole catalogues uploaded.
- **No commission in v1, possibly never.** Georgian HoReCa settles on delayed terms
  offline. Sitting in the money flow means credit risk, collections, and a reason
  for both sides to transact around us.
- Subscriptions are invoiced **by hand, by bank transfer**. No payment code.

## 7. Market and go-to-market

- **Tbilisi only** for v1 and the foreseeable future.
- A founding partner with personal relationships across Tbilisi restaurants and
  distributors onboards both sides by hand, by phone, one at a time. **The product
  doesn't need to acquire users. It needs to not embarrass us when they arrive.**
- So polish and reliability matter more than growth loops, referrals, SEO or
  marketing pages. Don't build any of those.

## 8. Georgia-specific constraints — not optional

**Language.** Georgian first: every string, product name and error message. English
is not required for v1. Kitchen staff don't read English.

**Payment terms.** Restaurants pay weekly or monthly on terms, not on delivery.
Orders are placed here; money moves offline exactly as it does today.

**Viber and WhatsApp are the real competitor**, not another website. Distributor
notifications must reach them there. v1 uses SMS behind an interface, so
Viber/WhatsApp can be added without a rewrite.

**Electronic waybills (სასაქონლო ზედნადები).** Georgian law requires an rs.ge
waybill for B2B goods movement, done by hand today. Generating it from an order is
the strongest moat available and a major post-v1 priority. **Don't build it yet**,
but don't block it: orders must keep buyer and distributor tax IDs, legal names,
itemised quantities with units, and delivery addresses.

## 9. Engineering principles — non-negotiable

**Prices are the sensitive data.** In a market this small, one leak ends the
business.

- Distributor A must never see distributor B's prices or customers. A buyer must
  never see another buyer's negotiated rates. The news feed and search show list
  prices only, and when negotiated pricing arrives (v2), it must never reach either.
- Every database read is scoped by organisation **in server-side code**, explicitly.
  Row-level security can be a backstop, never the only boundary.
- A dedicated test suite asserts that cross-tenant reads fail. It runs in CI, and
  every new endpoint gets a test in it.
- No unauthenticated catalogue endpoints, and authenticated reads are rate-limited.
  Competitors will scrape prices on day one.
- Orders and price changes go into an **append-only event log**. When a distributor
  says "he ordered 200kg, not 20kg", there must be a record.
- No card data touches our servers, ever.

**Boring architecture.** Built by one or two people: one backend service, one
Postgres database, one frontend. No microservices, queues, Kubernetes or event bus.
If it can be a Postgres table and a function call, it is.

## 10. Scope discipline

Not in v1, even though they're good ideas: in-app payments, chat, ratings and
reviews, delivery tracking, par levels and auto-reorder, AI order intake from voice
notes, rs.ge waybills, price index / market data, native apps, multi-city, English
UI, public marketing site, referrals.

Already pulled forward into the demo, because they were cheap and showed their
value at once: repeat ordering, delivery confirmation with missing-item reporting,
the news feed, and alcohol and hygiene categories.

## 11. Roadmap after v1

- **v1.5** — saved order guides; order history and spend by category.
- **v2** — Viber/WhatsApp order intake for distributors' existing customers; rs.ge
  waybills; negotiated pricing per buyer.
- **v3** — AI order intake (voice note or free text into an order); par-level
  inventory with suggested reorders; an anonymised category price index sold back
  to distributors.
- **Adjacent** — more non-food HoReCa supply (cleaning chemicals, packaging,
  disposables, uniforms): same buyers, weaker incumbents, better margins.

## 12. Before anything goes public

- **Photos** come from Wikimedia Commons and need author and licence credits
  (`public/brand/CREDITS.md`). None were taken in Tbilisi; real ones would be better.
- **The Netlify site** (`acceleratebazzar`) has a draft deploy of an older build.
  Production deploys only with `--prod`.

## 13. Domain glossary

| Georgian | English | Notes |
|---|---|---|
| მომწოდებელი | supplier / distributor | The distribution company |
| შემკვეთი / მყიდველი | buyer | Restaurant, café, market |
| კატალოგი | catalogue | A distributor's product list |
| ფასი | price | Per base unit |
| ერთეული | unit | ცალი (piece), კგ, ლ |
| მინ. რაოდენობა | minimum quantity | Per product |
| მინიმალური შეკვეთა | minimum order value | Per distributor, in ₾ |
| შეკვეთა | order | |
| მიწოდება | delivery | |
| რაიონი | district | Tbilisi district |
| სიახლეები | news | New products and price changes |
| გამეორება | reorder | Repeat a past order |
| სასაქონლო ზედნადები | electronic waybill | rs.ge, post-v1 |
| ს/კ | tax ID | Georgian company identification number |
