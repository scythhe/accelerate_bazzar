"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  BUYER,
  BUYER_ADDRESS,
  productById,
  seedOrders,
  supplierById,
} from "@/lib/mock/data";
import type {
  CartLine,
  Order,
  OrderItem,
  SupplierProduct,
} from "@/lib/mock/types";

export type Persona = "buyer" | "supplier";

interface DemoState {
  persona: Persona;
  cart: CartLine[];
  orders: Order[];
  lastPlacedIds: string[];
  availabilityOverrides: Record<string, boolean>;
  /** Products added live via a supplier's "add product" form this session —
   *  the seed catalogue in lib/mock/data.ts never changes. */
  customProducts: SupplierProduct[];
  toast: { id: number; message: string } | null;
}

export interface NewProductInput {
  nameKa: string;
  baseUnit: SupplierProduct["baseUnit"];
  packLabel: string;
  packQuantity: number;
  pricePerPack: number;
}

interface DemoContextValue extends DemoState {
  setPersona: (p: Persona) => void;

  cartCount: number; // total packs across all lines
  cartTotal: number; // GEL
  getPacks: (productId: string) => number;
  setPacks: (productId: string, packs: number) => void;
  addOnePack: (productId: string) => void;
  reorderItems: (items: { productId: string; packs: number }[]) => {
    added: number;
    skipped: number;
  };
  removeLine: (productId: string) => void;
  clearCart: () => void;

  placeOrders: (opts: {
    address: string;
    requestedDate: string;
    note?: string;
  }) => string[]; // returns created order ids
  confirmOrder: (id: string) => void;
  rejectOrder: (id: string, reason: string) => void;
  markDelivered: (id: string) => void;
  confirmReceived: (id: string) => void;
  reportIssue: (id: string, note: string) => void;

  /** Live availability, honouring a supplier's catalogue toggle. */
  isAvailable: (product: SupplierProduct) => boolean;
  setAvailability: (productId: string, available: boolean) => void;

  /** Any product by id — seed catalogue or added this session. */
  getProduct: (productId: string) => SupplierProduct | undefined;
  /** Adds a product to the supplier persona's catalogue, returns its id. */
  addProduct: (input: NewProductInput) => string;

  dismissToast: () => void;

  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function nowLabel(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `დღეს, ${hh}:${mm}`;
}

function makeItem(p: SupplierProduct, packs: number): OrderItem {
  return {
    productId: p.id,
    nameKa: p.nameKa,
    packLabel: p.packLabel,
    baseUnit: p.baseUnit,
    packQuantity: p.packQuantity,
    pricePerPack: p.pricePerPack,
    packs,
    lineTotal: Math.round(p.pricePerPack * packs * 100) / 100,
    imageUrl: p.imageUrl,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("buyer");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => seedOrders());
  const [lastPlacedIds, setLastPlacedIds] = useState<string[]>([]);
  const [orderSeq, setOrderSeq] = useState(431); // next human order number
  const [productSeq, setProductSeq] = useState(1);
  const [availabilityOverrides, setAvailabilityOverrides] = useState<
    Record<string, boolean>
  >({});
  const [customProducts, setCustomProducts] = useState<SupplierProduct[]>([]);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );
  const dismissToast = useCallback(() => setToast(null), []);

  const getProduct = useCallback(
    (productId: string) =>
      customProducts.find((p) => p.id === productId) ?? productById(productId),
    [customProducts],
  );

  const isAvailable = useCallback(
    (product: SupplierProduct) =>
      availabilityOverrides[product.id] ?? product.isAvailable,
    [availabilityOverrides],
  );

  const setAvailability = useCallback((productId: string, available: boolean) => {
    setAvailabilityOverrides((prev) => ({ ...prev, [productId]: available }));
  }, []);

  const addProduct = useCallback(
    (input: NewProductInput) => {
      const id = `p-custom-${productSeq}`;
      setProductSeq((s) => s + 1);
      setCustomProducts((prev) => [
        ...prev,
        {
          id,
          supplierId: "sup-agro",
          // Unmapped, exactly like a real newly-added product — it's
          // findable by name until the canonical catalogue picks it up
          // (V1_BUILD_PROMPT.md §3, admin mapping queue).
          canonicalItemId: "",
          nameKa: input.nameKa,
          baseUnit: input.baseUnit,
          packLabel: input.packLabel,
          packQuantity: input.packQuantity,
          pricePerPack: input.pricePerPack,
          isAvailable: true,
        },
      ]);
      return id;
    },
    [productSeq],
  );

  const setPersona = useCallback((p: Persona) => setPersonaState(p), []);

  const getPacks = useCallback(
    (productId: string) => cart.find((l) => l.productId === productId)?.packs ?? 0,
    [cart],
  );

  const setPacks = useCallback((productId: string, packs: number) => {
    setCart((prev) => {
      const next = prev.filter((l) => l.productId !== productId);
      if (packs > 0) next.push({ productId, packs });
      return next;
    });
  }, []);

  const addOnePack = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const line = prev.find((l) => l.productId === productId);
        if (line)
          return prev.map((l) =>
            l.productId === productId ? { ...l, packs: l.packs + 1 } : l,
          );
        return [...prev, { productId, packs: 1 }];
      });
      const product = getProduct(productId);
      if (product) {
        setToast({ id: Date.now(), message: `დაემატა — ${product.nameKa}` });
      }
    },
    [getProduct],
  );

  /** One-tap "order this again" — merges a past order's lines into the current
   *  cart at today's prices/availability, skipping anything no longer sold.
   *  This is the habit-forming move CLAUDE.md's v1.5 roadmap names as the
   *  real switching-cost moat, pulled forward because it's cheap to build and
   *  the value is felt immediately rather than narrated. */
  const reorderItems = useCallback(
    (items: { productId: string; packs: number }[]) => {
      let added = 0;
      let skipped = 0;
      setCart((prev) => {
        const next = [...prev];
        for (const item of items) {
          const product = getProduct(item.productId);
          if (!product || !isAvailable(product)) {
            skipped++;
            continue;
          }
          added++;
          const line = next.find((l) => l.productId === item.productId);
          if (line) line.packs += item.packs;
          else next.push({ productId: item.productId, packs: item.packs });
        }
        return next;
      });
      if (added > 0) {
        setToast({
          id: Date.now(),
          message:
            skipped > 0
              ? `დაემატა ${added} პროდუქტი — ${skipped} აღარ არის ხელმისაწვდომი`
              : `დაემატა ${added} პროდუქტი კალათაში`,
        });
      }
      return { added, skipped };
    },
    [getProduct, isAvailable],
  );

  const removeLine = useCallback(
    (productId: string) =>
      setCart((prev) => prev.filter((l) => l.productId !== productId)),
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const { cartCount, cartTotal } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const l of cart) {
      const p = getProduct(l.productId);
      if (!p) continue;
      count += l.packs;
      total += p.pricePerPack * l.packs;
    }
    return { cartCount: count, cartTotal: round2(total) };
  }, [cart, getProduct]);

  const placeOrders = useCallback(
    ({
      address,
      requestedDate,
      note,
    }: {
      address: string;
      requestedDate: string;
      note?: string;
    }) => {
      // group cart by supplier
      const bySupplier = new Map<string, CartLine[]>();
      for (const l of cart) {
        const p = getProduct(l.productId);
        if (!p) continue;
        const arr = bySupplier.get(p.supplierId) ?? [];
        arr.push(l);
        bySupplier.set(p.supplierId, arr);
      }

      const created: Order[] = [];
      let seq = orderSeq;
      let created_at = Date.now();

      for (const [supplierId, lines] of bySupplier) {
        const supplier = supplierById(supplierId);
        const items = lines
          .map((l) => {
            const p = getProduct(l.productId);
            return p ? makeItem(p, l.packs) : null;
          })
          .filter((i): i is OrderItem => i !== null);
        const subtotal = round2(
          items.reduce((t, i) => t + i.lineTotal, 0),
        );
        created.push({
          id: `o-${supplierId}-${seq}`,
          number: `2026-0${seq}`,
          buyerId: BUYER.id,
          buyerName: BUYER.displayName,
          buyerTaxId: BUYER.taxId,
          supplierId,
          supplierName: supplier.displayName,
          deliveryAddress: address || BUYER_ADDRESS,
          requestedDate,
          note: note?.trim() ? note.trim() : undefined,
          status: "PLACED",
          items,
          subtotal,
          events: [
            { at: nowLabel(), label: "შეკვეთა განთავსდა", status: "PLACED" },
          ],
          createdAt: created_at++,
        });
        seq++;
      }

      setOrders((prev) => [...created, ...prev]);
      setOrderSeq(seq);
      const ids = created.map((o) => o.id);
      setLastPlacedIds(ids);
      setCart([]);
      return ids;
    },
    [cart, orderSeq, getProduct],
  );

  const confirmOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "CONFIRMED",
              events: [
                ...o.events,
                {
                  at: nowLabel(),
                  label: "მომწოდებელმა დაადასტურა",
                  status: "CONFIRMED",
                },
              ],
            }
          : o,
      ),
    );
  }, []);

  const rejectOrder = useCallback((id: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "REJECTED",
              events: [
                ...o.events,
                {
                  at: nowLabel(),
                  label: `უარყოფილია — ${reason}`,
                  status: "REJECTED",
                },
              ],
            }
          : o,
      ),
    );
  }, []);

  /** Supplier marks a confirmed order delivered — the third real lifecycle
   *  step CLAUDE.md's v1.5 roadmap names ("delivery confirmation with
   *  missing-item reporting"), not just a demo label. */
  const markDelivered = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "DELIVERED",
              events: [
                ...o.events,
                {
                  at: nowLabel(),
                  label: "მომწოდებელმა მონიშნა როგორც მიწოდებული",
                  status: "DELIVERED",
                },
              ],
            }
          : o,
      ),
    );
  }, []);

  /** Buyer confirms a delivery matched the order — closes the loop the
   *  dispute-ledger caption on the order screen otherwise only promises. */
  const confirmReceived = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              events: [
                ...o.events,
                {
                  at: nowLabel(),
                  label: "შემკვეთმა დაადასტურა — ყველაფერი მიღებულია",
                  status: "DELIVERED",
                },
              ],
            }
          : o,
      ),
    );
  }, []);

  /** Buyer flags a missing/wrong item on a delivered order. Appends to the
   *  same append-only event log both sides read — the actual dispute record
   *  CLAUDE.md §8 requires, not a support ticket that lives somewhere else. */
  const reportIssue = useCallback((id: string, note: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              events: [
                ...o.events,
                {
                  at: nowLabel(),
                  label: `ხარვეზი დაფიქსირდა — ${note}`,
                  status: "DELIVERED",
                },
              ],
            }
          : o,
      ),
    );
  }, []);

  const resetDemo = useCallback(() => {
    setPersonaState("buyer");
    setCart([]);
    setOrders(seedOrders());
    setLastPlacedIds([]);
    setOrderSeq(431);
    setAvailabilityOverrides({});
    setCustomProducts([]);
    setProductSeq(1);
    setToast(null);
  }, []);

  const value: DemoContextValue = {
    persona,
    cart,
    orders,
    lastPlacedIds,
    availabilityOverrides,
    customProducts,
    toast,
    setPersona,
    cartCount,
    cartTotal,
    getPacks,
    setPacks,
    addOnePack,
    reorderItems,
    removeLine,
    clearCart,
    placeOrders,
    confirmOrder,
    rejectOrder,
    markDelivered,
    confirmReceived,
    reportIssue,
    isAvailable,
    setAvailability,
    getProduct,
    addProduct,
    dismissToast,
    resetDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within <DemoProvider>");
  return ctx;
}
