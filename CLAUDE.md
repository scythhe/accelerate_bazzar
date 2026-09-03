# Accelerate — Project Context

This file is the durable context for the project. Read it before doing anything.
It describes *why* the product exists and what the constraints are.

**Current stage: UI only.** Build instructions are in `UI_BUILD_PROMPT.md`.
The full backend specification in `V1_BUILD_PROMPT.md` is reference material for
later — read it to understand the shape of the data, but do not implement it
yet.

---

## 1. What this is

A B2B web platform for Tbilisi, Georgia that connects **food supply companies**
(wholesale distributors) with **restaurants, cafés, hotels, bakeries and small
markets** (HoReCa buyers).

Suppliers publish their product catalogue with prices. Buyers search for what
they need in Georgian, see every supplier who carries it with the price, and
place an order.

The platform does not hold stock, does not deliver, and does not process
payments. It is a discovery and ordering layer on top of relationships and
logistics that already exist.

## 2. The problem, from the field

Two problems observed directly from a Tbilisi restaurant manager with 15+ years
in the industry, and confirmed as typical.

**Supplier side — wasted acquisition spend.**
Supply companies employ field sales reps whose job is to physically visit
restaurants, introduce the company, and hand over a price list. A mid-size
supplier burns roughly **10,000–20,000+ GEL per month** on this. The hit rate is
terrible, because the manager on the other side is busy, already has a supplier
he trusts, and will not stop service to hear a pitch — even when the price
offered is better.

**Buyer side — stockouts.**
A kitchen runs out of something mid-service. Pickles, eggs, onions. The manager
then makes five or six phone calls to find someone who has it and can deliver
today, or sends a staff member to a market to buy retail. It is slow, expensive,
and it happens constantly.

## 3. The insight the product is built on

Restaurants do **not** want to switch suppliers. Switching is a decision about
trust, delivery reliability and payment terms — not about price. A catalogue
that only helps someone save 4% on onions will not get used.

But a restaurant that has **run out of something right now** is, for that
moment, completely open to buying from a stranger. It is not a switch, it is a
gap being filled. Low commitment, high urgency, no loyalty conflict.

So the product's job is to be the fastest possible answer to:

> *"Who has 20kg of cucumbers and can get them to Saburtalo by tomorrow morning,
> and what does it cost?"*

Every design decision follows from that sentence.

The commercial consequence: a supplier who fills three emergency orders well has
run a live demonstration that no sales rep could ever buy. Relationships form
through fulfilment, not through browsing. **Discovery is a side effect of
solving urgency.** That is the whole strategy.

**Practical implication for v1:** the search experience must be tuned for a
person in a hurry, not a person browsing. Delivery time, minimum order value and
availability must be visible *in the search results themselves*, next to the
price. A result the buyer cannot actually act on today is noise.

## 4. Users

**Buyer (restaurant / market)**
- Kitchen manager or purchasing manager. Often 40+, Georgian-speaking, not a
  heavy computer user. Uses a phone, frequently with wet or busy hands.
- Places orders early morning or late evening.
- Cares about: does this supplier deliver to my district, when, what's the
  minimum order, what does it cost, and can I get it now.

**Supplier (distributor)**
- Office staff or the owner. Maintains a price list that today lives in Excel
  and gets sent over Viber or printed.
- Cares about: new customers, not typing. Uploading and updating a catalogue
  must be trivial or they will not do it.

**Platform admin (us)**
- Onboards suppliers, maps their products to the canonical catalogue, resolves
  disputes, manages subscriptions manually.

## 5. Business model

- **Free for buyers, always.** No subscription, no fee, no commission that
  raises their price. Demand is the scarce side of this market.
- **Free for suppliers until liquidity exists** — first 3–6 months. Then a
  monthly subscription priced against what they already spend on field reps
  ("you spend 15,000 GEL/month on four reps; pay 600 GEL/month for inbound
  orders from buyers who want to purchase today").
- Subscription tiers are priced on **value received** (order volume / inbound
  demand), **never on number of SKUs**. We want suppliers uploading their entire
  catalogue; do not tax catalogue depth.
- **No commission in v1, possibly never.** Georgian HoReCa settles on delayed
  payment terms offline. Sitting in the money flow means credit risk,
  collections, and a reason for both sides to transact around us.
- Subscription invoicing is handled **manually by bank transfer** for now.
  Georgian B2B pays by invoice anyway. No payment code needs to exist.

## 6. Market and go-to-market

- **Tbilisi only** for v1 and the foreseeable future. Other cities, then other
  countries, only after Tbilisi is saturated.
- Distribution comes from a founding partner with deep, personal relationships
  across Tbilisi restaurants and supply companies. Suppliers and buyers are
  onboarded by hand, by phone, one at a time. **The product does not need to
  acquire users. It needs to not embarrass us when they arrive.**
- Consequence: polish and reliability matter more than growth loops, referral
  systems, SEO, or public marketing pages. Do not build any of that.

## 7. Georgia-specific constraints — these are not optional

**Language.** Georgian first. Not a translation layer bolted on later. Every
string, every product name, every error message ships in Georgian. English is a
distant second and is not required for v1. Kitchen staff placing orders do not
read English.

**Payment terms.** Restaurants pay suppliers weekly or monthly on terms, not on
delivery. A platform that assumes prepayment is dead on arrival. Orders are
placed here; money moves offline exactly as it does today.

**Viber and WhatsApp are the incumbent competitor.** The thing we are replacing
is a phone call and a Viber group, not another website. Supplier-facing
notifications must reach them where they already are. v1 uses SMS; the
notification layer must be behind an interface so Viber/WhatsApp can be added
without a rewrite.

**Electronic waybills (სასაქონლო ზედნადები).** Georgian law requires an
electronic waybill through rs.ge for B2B goods movement. Every supplier does
this manually for every delivery today. Auto-generating the waybill from an
order is the single strongest moat available to us and is a major post-v1
priority. **Do not build it in v1**, but do not make data-model decisions that
would block it — orders need buyer/supplier tax IDs, legal names, itemised
quantities with units, and delivery addresses recorded properly.

**Units are harder than they look.** Eggs by tray. Onions by kilo or by sack.
Oil by litre or by 5L canister. Cheese by whole wheel. If units are not
normalised, price comparison is meaningless and the catalogue looks broken. This
is specified in detail in the build prompt and must be right on day one —
retrofitting it is brutal.

## 8. Non-negotiable engineering principles

**Prices are the sensitive data.** This is a multi-tenant application where the
crown jewels are commercial pricing. Supplier A must never see Supplier B's
prices or customer list. A buyer must never see another buyer's negotiated
rates. In a market this small, one leak ends the business.

- Every database read is scoped by organisation **in server-side application
  code**, explicitly. Row-level security may exist as a backstop but is never
  the only boundary.
- There is a dedicated automated test suite whose entire job is asserting that
  cross-tenant reads fail. It runs in CI. Every new endpoint gets a test in it.
- No unauthenticated catalogue endpoints. Competitors will scrape prices on day
  one. Authenticated catalogue reads are rate-limited too.
- Orders and price changes are recorded in an **append-only event log**. When a
  supplier says "he ordered 200kg, not 20kg", there must be a record. This is a
  business requirement, not an engineering nicety.
- No card data touches our servers, ever. Not in v1, not later — hosted
  checkout only if payments are ever added.

**Boring architecture.** This is built by one or two people. One backend
service, one Postgres database, one frontend. Every additional moving part is
something that has to be secured, monitored and operated. No microservices, no
queues, no Kubernetes, no event bus. If something can be a Postgres table and a
function call, it is.

## 9. Scope discipline

Things that are explicitly **not** in v1, even though they are good ideas:
in-app payments, chat/messaging, ratings and reviews, delivery tracking,
inventory par-levels and auto-reorder, AI order intake from voice notes, rs.ge
waybill generation, price index / market data products, mobile native apps,
multi-city support, English UI, public marketing site, referral system,
non-food categories.

The v1 build prompt defines the boundary. Anything not in it is out.

## 10. Roadmap after v1

- **v1.5** — repeat ordering and saved order guides (one-tap reorder of last
  week's list); order history and spend reporting by category; delivery
  confirmation with missing-item reporting.
- **v2** — Viber/WhatsApp order intake for suppliers' existing customers;
  rs.ge waybill generation; supplier-specific negotiated pricing per buyer.
- **v3** — AI order intake (parse a voice note or free text into a structured
  order); par-level inventory with suggested reorders; anonymised category
  price index sold back to suppliers as market data.
- **Adjacent expansion** — non-food HoReCa supply (cleaning chemicals,
  packaging, disposables, uniforms): same buyers, weaker incumbent
  relationships, better margins.

## 11. Domain glossary

| Georgian | English | Notes |
|---|---|---|
| მომწოდებელი | supplier | The distribution company |
| მიმწოდებელი / შემკვეთი | buyer | Restaurant, café, market |
| კატალოგი | catalogue | Supplier's product list |
| ფასი | price | |
| ერთეული | unit | kg, litre, piece |
| შეფუთვა | pack | Tray, sack, canister, box |
| შეკვეთა | order | |
| მინიმალური შეკვეთა | minimum order value | Per supplier |
| მიწოდება | delivery | |
| ზონა / რაიონი | zone / district | Tbilisi district |
| სასაქონლო ზედნადები | electronic waybill | rs.ge, post-v1 |
| ს/კ | tax ID | Georgian company identification number |
