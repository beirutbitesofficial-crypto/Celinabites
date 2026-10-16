"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type Item, type Lang, findItem, money } from "./menu";
import { site } from "./site";

export type Line = {
  key: string;
  id: string;
  /** Index into item.variants, when the item has them. */
  variant?: number;
  price: number;
  qty: number;
};

export type OrderType = "delivery" | "pickup";
export type Customer = { name: string; phone: string; address: string; notes: string };

type Cart = {
  lines: Line[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, variant?: number) => void;
  setQty: (key: string, qty: number) => void;
  qtyOf: (id: string) => number;
  clear: () => void;
  /** Bumped on every add — the cart pill uses it to bounce. */
  pulse: number;
};

const CartContext = createContext<Cart | null>(null);
const STORAGE = "celinabites.cart.v1";

function priceFor(id: string, variant?: number) {
  const item = findItem(id);
  if (!item) return null;
  if (item.variants) {
    const v = variant === undefined ? undefined : item.variants[variant];
    return v ? { item, price: v.price } : null;
  }
  return { item, price: item.price ?? 0 };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Restore (per-device convenience only; ignore if storage is blocked).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return;
      const saved = JSON.parse(raw) as Line[];
      // Re-price from the menu so stale prices never survive.
      setLines(
        saved.flatMap((l) => {
          const p = priceFor(l.id, l.variant);
          return p && l.qty > 0 ? [{ ...l, price: p.price }] : [];
        })
      );
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((id: string, variant?: number) => {
    const p = priceFor(id, variant);
    if (!p) return;
    const key = variant === undefined ? id : `${id}::${variant}`;
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      if (found) return ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...ls, { key, id, variant, price: p.price, qty: 1 }];
    });
    setPulse((n) => n + 1);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<Cart>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return {
      lines,
      count,
      total,
      open,
      setOpen,
      add,
      setQty,
      qtyOf: (id) => lines.filter((l) => l.id === id).reduce((n, l) => n + l.qty, 0),
      clear: () => setLines([]),
      pulse,
    };
  }, [lines, open, add, setQty, pulse]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** "Zaatar (Mashrouha)" in the visitor's language. */
export function lineLabel(item: Item, variant: number | undefined, lang: Lang) {
  const v = variant === undefined ? undefined : item.variants?.[variant];
  return { name: item.name[lang], choice: v?.label[lang] };
}

/** The WhatsApp message the shop receives — always in Arabic with the English name alongside, so staff read it the same way. */
export function orderMessage(lines: Line[], total: number, type: OrderType, c: Customer) {
  const rows = lines.map((l) => {
    const item = findItem(l.id)!;
    const v = l.variant === undefined ? undefined : item.variants?.[l.variant];
    const choice = v ? ` (${v.label.ar} / ${v.label.en})` : "";
    return `• ${l.qty} × ${item.name.ar} — ${item.name.en}${choice} = ${money(l.qty * l.price, "en")}`;
  });
  return [
    `مرحبا ${site.nameAr}! طلب ${type === "delivery" ? "توصيل" : "استلام"} جديد`,
    `Hello ${site.name}! New ${type} order:`,
    "",
    ...rows,
    "",
    `المجموع / Total: ${money(total, "en")}`,
    "",
    `الاسم / Name: ${c.name}`,
    `التلفون / Phone: ${c.phone}`,
    type === "delivery" ? `العنوان / Address: ${c.address}` : "استلام من المحل / Pickup from the shop",
    c.notes ? `ملاحظات / Notes: ${c.notes}` : "",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n")
    .trim();
}
