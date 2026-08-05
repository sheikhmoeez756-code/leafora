"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { getProduct } from "./products";

export type CartItem = { slug: string; qty: number };

type CartState = {
  items: CartItem[];
  promo: string | null; // applied promo code
};

type CartAction =
  | { type: "add"; slug: string; qty?: number }
  | { type: "remove"; slug: string }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "applyPromo"; code: string }
  | { type: "clearPromo" }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

const PROMO_CODES: Record<string, number> = {
  LEAF10: 0.1,
};

export const SHIPPING_FLAT = 4.99;

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.items.find((i) => i.slug === action.slug);
      const items = existing
        ? state.items.map((i) =>
            i.slug === action.slug ? { ...i, qty: i.qty + qty } : i
          )
        : [...state.items, { slug: action.slug, qty }];
      return { ...state, items };
    }
    case "remove":
      return {
        ...state,
        items: state.items.filter((i) => i.slug !== action.slug),
      };
    case "setQty": {
      if (action.qty < 1) {
        return {
          ...state,
          items: state.items.filter((i) => i.slug !== action.slug),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.slug === action.slug ? { ...i, qty: action.qty } : i
        ),
      };
    }
    case "applyPromo":
      return { ...state, promo: action.code };
    case "clearPromo":
      return { ...state, promo: null };
    case "clear":
      return { items: [], promo: null };
    case "hydrate":
      return action.state;
  }
}

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
  const [state, dispatch] = useReducer(reducer, { items: [], promo: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (Array.isArray(parsed.items)) {
          dispatch({
            type: "hydrate",
            state: {
              items: parsed.items.filter((i) => getProduct(i.slug)),
              promo:
                parsed.promo && PROMO_CODES[parsed.promo] ? parsed.promo : null,
            },
          });
        }
      }
    } catch {
      // corrupted storage — start fresh
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode) — cart just won't persist
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce((sum, i) => {
      const p = getProduct(i.slug);
      return p ? sum + p.price * i.qty : sum;
    }, 0);
    const count = state.items.reduce((sum, i) => sum + i.qty, 0);
    const discount = state.promo
      ? subtotal * (PROMO_CODES[state.promo] ?? 0)
      : 0;
    const shipping = state.items.length ? SHIPPING_FLAT : 0;
    return {
      items: state.items,
      count,
      subtotal,
      shipping,
      discount,
      total: subtotal - discount + shipping,
      promo: state.promo,
      add: (slug, qty) => dispatch({ type: "add", slug, qty }),
      remove: (slug) => dispatch({ type: "remove", slug }),
      setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase();
        if (!PROMO_CODES[normalized]) return false;
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
