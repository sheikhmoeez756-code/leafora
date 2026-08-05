"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  EMPTY_CART,
  cartReducer,
  cartTotals,
  normalizePromo,
  parseStoredCart,
  promoRate,
  type CartItem,
  type StoredCart,
} from "./cart-core";

export { SHIPPING_FLAT, promoRate } from "./cart-core";
export type { CartItem } from "./cart-core";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promo: string | null;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "leafora-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable (private mode) — fall through with nothing
    }
    // Dispatched unconditionally: this is also what marks the cart hydrated
    // and unblocks writes.
    dispatch({ type: "hydrate", state: parseStoredCart(raw) });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return; // never write over a saved cart with the empty default
    try {
      const stored: StoredCart = { items: state.items, promo: state.promo };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // storage unavailable (private mode) — cart just won't persist
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const totals = cartTotals(state.items, state.promo);
    return {
      items: state.items,
      ...totals,
      promo: state.promo,
      add: (slug, qty) => dispatch({ type: "add", slug, qty }),
      remove: (slug) => dispatch({ type: "remove", slug }),
      setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
      applyPromo: (code) => {
        const normalized = normalizePromo(code);
        if (!promoRate(normalized)) return false;
        dispatch({ type: "applyPromo", code: normalized });
        return true;
      },
      clearPromo: () => dispatch({ type: "clearPromo" }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
