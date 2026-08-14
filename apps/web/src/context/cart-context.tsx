"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { useMounted } from "@/hooks/use-mounted";
import * as cartStore from "@/lib/cart-store";
import type { CartLine } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export interface CartItem extends CartLine {
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const emptyLines: CartLine[] = [];
const noLinesSnapshot = () => emptyLines;

export function CartProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getLines, noLinesSnapshot);

  const items = useMemo<CartItem[]>(() => {
    if (!mounted) return [];
    return lines.map((line) => ({ ...line, lineTotal: line.price * line.quantity }));
  }, [mounted, lines]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const addItem = useCallback((product: Product, quantity = 1) => {
    cartStore.addLine(
      {
        productId: product.id,
        slug: product.slug,
        nameFa: product.nameFa,
        nameEn: product.nameEn,
        unitFa: product.unitFa,
        unitEn: product.unitEn,
        price: product.price,
        image: product.images[0] ?? null,
      },
      quantity,
    );
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    cartStore.setLineQuantity(productId, quantity);
  }, []);

  const removeItem = useCallback((productId: string) => {
    cartStore.removeLine(productId);
  }, []);

  const clear = useCallback(() => {
    cartStore.clearCart();
  }, []);

  return (
    <CartContext.Provider value={{ items, count, subtotal, addItem, setQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
