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
import type { CartLine, Order, OrderItem } from "@/lib/mock/types";

export type Persona = "buyer" | "supplier";

interface DemoState {
  persona: Persona;
  cart: CartLine[];
  orders: Order[];
  lastPlacedIds: string[];
}

interface DemoContextValue extends DemoState {
  setPersona: (p: Persona) => void;

  cartCount: number; // total packs across all lines
  cartTotal: number; // GEL
  getPacks: (productId: string) => number;
  setPacks: (productId: string, packs: number) => void;
  addOnePack: (productId: string) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;

  placeOrders: (opts: {
    address: string;
    requestedDate: string;
    note?: string;
  }) => string[]; // returns created order ids
  confirmOrder: (id: string) => void;
  rejectOrder: (id: string, reason: string) => void;

  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function nowLabel(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `დღეს, ${hh}:${mm}`;
}

function makeItem(productId: string, packs: number): OrderItem {
  const p = productById(productId)!;
  return {
    productId,
    nameKa: p.nameKa,
    packLabel: p.packLabel,
    baseUnit: p.baseUnit,
    packQuantity: p.packQuantity,
    pricePerPack: p.pricePerPack,
    packs,
    lineTotal: Math.round(p.pricePerPack * packs * 100) / 100,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("buyer");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => seedOrders());
  const [lastPlacedIds, setLastPlacedIds] = useState<string[]>([]);
  const [orderSeq, setOrderSeq] = useState(431); // next human order number

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
    },
    [],
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
      const p = productById(l.productId);
      if (!p) continue;
      count += l.packs;
      total += p.pricePerPack * l.packs;
    }
    return { cartCount: count, cartTotal: round2(total) };
  }, [cart]);

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
        const p = productById(l.productId);
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
        const items = lines.map((l) => makeItem(l.productId, l.packs));
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
    [cart, orderSeq],
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

  const resetDemo = useCallback(() => {
    setPersonaState("buyer");
    setCart([]);
    setOrders(seedOrders());
    setLastPlacedIds([]);
    setOrderSeq(431);
  }, []);

  const value: DemoContextValue = {
    persona,
    cart,
    orders,
    lastPlacedIds,
    setPersona,
    cartCount,
    cartTotal,
    getPacks,
    setPacks,
    addOnePack,
    removeLine,
    clearCart,
    placeOrders,
    confirmOrder,
    rejectOrder,
    resetDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within <DemoProvider>");
  return ctx;
}
