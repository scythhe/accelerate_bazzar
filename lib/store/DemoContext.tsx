"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BUYER,
  BUYER_ADDRESS,
  productById,
  SUPPLIER_PERSONA_ID,
  seedNews,
  seedOrders,
  supplierById,
} from "@/lib/mock/data";
import type {
  CartLine,
  CatalogueNews,
  Order,
  OrderItem,
  SupplierProduct,
} from "@/lib/mock/types";

export type Persona = "buyer" | "supplier";

interface DemoState {
  /** Stored state has been read — don't decide logged-in/out before this. */
  hydrated: boolean;
  loggedIn: boolean;
  /** Canonical +995 number; kept after logout so the next login skips typing. */
  phone: string;
  /** Last delivery point used — the next order defaults to it. */
  deliveryAddress: string;
  persona: Persona;
  cart: CartLine[];
  orders: Order[];
  lastPlacedIds: string[];
  availabilityOverrides: Record<string, boolean>;
  /** Products added via a supplier's "add product" form this session, plus
   *  edited copies of seed products under their original id — the seed
   *  catalogue in lib/mock/data.ts never changes. */
  customProducts: SupplierProduct[];
  /** Products the supplier deleted from their catalogue this session. */
  removedProductIds: string[];
  news: CatalogueNews[];
  /** Feed entries since the buyer last opened it. */
  unreadNews: number;
  toast: { id: number; message: string } | null;
}

export interface NewProductInput {
  nameKa: string;
  baseUnit: SupplierProduct["baseUnit"];
  pricePerUnit: number;
  minQty: number;
  categoryLabel: string;
  sku?: string;
  /** Set when matched to the shared catalogue, which makes it comparable in
   *  search straight away; unmatched products wait for the admin mapping queue
   *  and are found by name until then. */
  canonicalItemId?: string;
  imageUrl?: string;
  inStock: boolean;
}

interface DemoContextValue extends DemoState {
  login: (phone: string) => void;
  logout: () => void;
  setDeliveryAddress: (address: string) => void;
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
    /** Only these suppliers' lines become orders; the rest stay in the cart.
     *  Omit to order everything. */
    supplierIds?: string[];
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
  /** Adds products to the supplier persona's catalogue. */
  addProducts: (inputs: NewProductInput[]) => void;
  /** Deletes a product from the catalogue, and from the buyer's cart. */
  removeProduct: (productId: string) => void;
  /** Changes a product's price and posts it to the buyers' news feed. */
  setProductPrice: (productId: string, price: number) => void;

  markNewsSeen: () => void;

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

// Stands in for the 30-day sliding session cookie (V1_BUILD_PROMPT.md §2), and
// keeps a half-built cart alive if the phone locks or the tab reloads mid-order.
const STORAGE_KEY = "accelerate.demo.v4";

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(BUYER_ADDRESS);
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
  const [removedProductIds, setRemovedProductIds] = useState<string[]>([]);
  const [news, setNews] = useState<CatalogueNews[]>(() => seedNews());
  const [newsSeenAt, setNewsSeenAt] = useState(0);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setLoggedIn(Boolean(s.loggedIn));
        setPhone(s.phone ?? "");
        setDeliveryAddress(s.deliveryAddress ?? BUYER_ADDRESS);
        setPersonaState(s.persona ?? "buyer");
        setCart(s.cart ?? []);
        setOrders(s.orders ?? seedOrders());
        setLastPlacedIds(s.lastPlacedIds ?? []);
        setOrderSeq(s.orderSeq ?? 431);
        setProductSeq(s.productSeq ?? 1);
        setAvailabilityOverrides(s.availabilityOverrides ?? {});
        setCustomProducts(s.customProducts ?? []);
        setRemovedProductIds(s.removedProductIds ?? []);
        setNews(s.news ?? seedNews());
        setNewsSeenAt(s.newsSeenAt ?? 0);
      }
    } catch {
      // Blocked or corrupt storage just means a fresh start.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          loggedIn,
          phone,
          deliveryAddress,
          persona,
          cart,
          orders,
          lastPlacedIds,
          orderSeq,
          productSeq,
          availabilityOverrides,
          customProducts,
          removedProductIds,
          news,
          newsSeenAt,
        }),
      );
    } catch {
      // Storage full or blocked — the session just won't survive a reload.
    }
  }, [
    hydrated,
    loggedIn,
    phone,
    deliveryAddress,
    persona,
    cart,
    orders,
    lastPlacedIds,
    orderSeq,
    productSeq,
    availabilityOverrides,
    customProducts,
    removedProductIds,
    news,
    newsSeenAt,
  ]);

  const login = useCallback((nextPhone: string) => {
    setPhone(nextPhone);
    setLoggedIn(true);
  }, []);

  const logout = useCallback(() => setLoggedIn(false), []);

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

  const addProducts = useCallback(
    (inputs: NewProductInput[]) => {
      const made = inputs.map(
        (input, i): SupplierProduct => ({
          id: `p-custom-${productSeq + i}`,
          supplierId: SUPPLIER_PERSONA_ID,
          canonicalItemId: input.canonicalItemId ?? "",
          nameKa: input.nameKa,
          baseUnit: input.baseUnit,
          packLabel: `1 ${input.baseUnit}`,
          packQuantity: 1,
          pricePerPack: input.pricePerUnit,
          minQty: input.minQty,
          isAvailable: input.inStock,
          imageUrl: input.imageUrl,
          sku: input.sku,
          categoryLabel: input.categoryLabel,
        }),
      );
      setProductSeq((s) => s + made.length);
      setCustomProducts((prev) => [...made, ...prev]);
      const now = Date.now();
      setNews((prev) => [
        ...made
          .filter((p) => p.isAvailable)
          .map(
            (p, i): CatalogueNews => ({
              id: `n-${p.id}`,
              supplierId: p.supplierId,
              productId: p.id,
              kind: "NEW_PRODUCT",
              price: p.pricePerPack,
              at: nowLabel(),
              createdAt: now + i,
            }),
          ),
        ...prev,
      ]);
      setToast({
        id: Date.now(),
        message:
          made.length === 1
            ? `დაემატა — ${made[0].nameKa}`
            : `დაემატა ${made.length} პროდუქტი`,
      });
    },
    [productSeq],
  );

  const removeProduct = useCallback((productId: string) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== productId));
    setRemovedProductIds((prev) => [...prev, productId]);
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setProductPrice = useCallback(
    (productId: string, price: number) => {
      const product = getProduct(productId);
      if (!product || product.pricePerPack === price) return;
      const edited = { ...product, pricePerPack: price };
      setCustomProducts((prev) =>
        prev.some((p) => p.id === productId)
          ? prev.map((p) => (p.id === productId ? edited : p))
          : [...prev, edited],
      );
      const now = Date.now();
      setNews((prev) => [
        {
          id: `n-${productId}-${now}`,
          supplierId: product.supplierId,
          productId,
          kind: "PRICE_CHANGE",
          price,
          oldPrice: product.pricePerPack,
          at: nowLabel(),
          createdAt: now,
        },
        ...prev,
      ]);
      setToast({ id: now, message: `ფასი შეიცვალა — ${product.nameKa}` });
    },
    [getProduct],
  );

  const markNewsSeen = useCallback(() => setNewsSeenAt(Date.now()), []);

  const unreadNews = useMemo(
    () =>
      news.filter(
        (n) =>
          n.createdAt > newsSeenAt && !removedProductIds.includes(n.productId),
      ).length,
    [news, newsSeenAt, removedProductIds],
  );

  const setPersona = useCallback((p: Persona) => setPersonaState(p), []);

  const getPacks = useCallback(
    (productId: string) => cart.find((l) => l.productId === productId)?.packs ?? 0,
    [cart],
  );

  const setPacks = useCallback((productId: string, packs: number) => {
    setCart((prev) => {
      if (packs <= 0) return prev.filter((l) => l.productId !== productId);
      // Update in place — a line (and its supplier's card) mustn't jump to the
      // bottom of the cart while its quantity is being edited.
      return prev.some((l) => l.productId === productId)
        ? prev.map((l) => (l.productId === productId ? { ...l, packs } : l))
        : [...prev, { productId, packs }];
    });
  }, []);

  const addOnePack = useCallback(
    (productId: string) => {
      const product = getProduct(productId);
      const firstAdd = product?.minQty ?? 1;
      setCart((prev) => {
        const line = prev.find((l) => l.productId === productId);
        if (line)
          return prev.map((l) =>
            l.productId === productId ? { ...l, packs: l.packs + 1 } : l,
          );
        return [...prev, { productId, packs: firstAdd }];
      });
      if (product) {
        setToast({
          id: Date.now(),
          message: `დაემატა ${firstAdd} ${product.baseUnit} — ${product.nameKa}`,
        });
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
      const sellable = items.filter((item) => {
        const product = getProduct(item.productId);
        return product && isAvailable(product);
      });
      const added = sellable.length;
      const skipped = items.length - added;
      setCart((prev) => {
        const next = prev.map((l) => ({ ...l }));
        for (const item of sellable) {
          // The minimum may have gone up since the original order.
          const packs = Math.max(
            item.packs,
            getProduct(item.productId)?.minQty ?? 1,
          );
          const line = next.find((l) => l.productId === item.productId);
          if (line) line.packs += packs;
          else next.push({ productId: item.productId, packs });
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
      supplierIds,
    }: {
      address: string;
      requestedDate: string;
      note?: string;
      supplierIds?: string[];
    }) => {
      // group cart by supplier
      const bySupplier = new Map<string, CartLine[]>();
      const remaining: CartLine[] = [];
      for (const l of cart) {
        const p = getProduct(l.productId);
        if (!p) continue;
        if (supplierIds && !supplierIds.includes(p.supplierId)) {
          remaining.push(l);
          continue;
        }
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
      setDeliveryAddress(address);
      setCart(remaining);
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
    setLoggedIn(false);
    setPhone("");
    setDeliveryAddress(BUYER_ADDRESS);
    setPersonaState("buyer");
    setCart([]);
    setOrders(seedOrders());
    setLastPlacedIds([]);
    setOrderSeq(431);
    setAvailabilityOverrides({});
    setCustomProducts([]);
    setRemovedProductIds([]);
    setNews(seedNews());
    setNewsSeenAt(0);
    setProductSeq(1);
    setToast(null);
  }, []);

  const value: DemoContextValue = {
    hydrated,
    loggedIn,
    phone,
    deliveryAddress,
    login,
    logout,
    setDeliveryAddress,
    persona,
    cart,
    orders,
    lastPlacedIds,
    availabilityOverrides,
    customProducts,
    removedProductIds,
    news,
    unreadNews,
    setProductPrice,
    markNewsSeen,
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
    addProducts,
    removeProduct,
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
