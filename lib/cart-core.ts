/** Pure cart logic — no React, no browser APIs, so it can be unit tested
 *  directly with `node --test`. The provider in cart-context.tsx is a thin
 *  wrapper around everything here. */

import { getProduct } from "./products";

export type CartItem = { slug: string; qty: number };

export type CartState = {
  items: CartItem[];
  promo: string | null; // applied promo code
  /** False until localStorage has been read. Nothing is written back before
   *  this flips, otherwise the empty initial state overwrites a saved cart. */
  hydrated: boolean;
};

export type StoredCart = Pick<CartState, "items" | "promo">;

export type CartAction =
  | { type: "add"; slug: string; qty?: number }
  | { type: "remove"; slug: string }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "applyPromo"; code: string }
  | { type: "clearPromo" }
  | { type: "clear" }
  | { type: "hydrate"; state: StoredCart };

const PROMO_CODES: Record<string, number> = {
  LEAF10: 0.1,
};

export const SHIPPING_FLAT = 4.99;

export const EMPTY_CART: CartState = { items: [], promo: null, hydrated: false };

/** Own-property lookup — a bare `PROMO_CODES[code]` also matches inherited
 *  keys like "constructor", which would apply a function as the discount. */
export function promoRate(code: string | null): number {
  if (!code || !Object.hasOwn(PROMO_CODES, code)) return 0;
  return PROMO_CODES[code];
}

export function normalizePromo(code: string): string {
  return code.trim().toUpperCase();
}

export function cartReducer(state: CartState, action: CartAction): CartState {
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
      return { ...state, items: [], promo: null };
    case "hydrate":
      return { ...action.state, hydrated: true };
  }
}

/** localStorage is user-editable, so nothing out of it is trusted: unknown
 *  slugs and non-positive-integer quantities are dropped, and the promo is
 *  re-validated (and case-normalized) rather than taken at face value. */
export function parseStoredCart(raw: string | null): StoredCart {
  const empty: StoredCart = { items: [], promo: null };
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredCart>;
    if (!Array.isArray(parsed.items)) return empty;
    const promo = parsed.promo ? normalizePromo(parsed.promo) : null;
    return {
      items: parsed.items.filter(
        (i) =>
          i != null &&
          typeof i.slug === "string" &&
          getProduct(i.slug) !== undefined &&
          Number.isInteger(i.qty) &&
          i.qty > 0
      ),
      promo: promoRate(promo) ? promo : null,
    };
  } catch {
    return empty; // corrupted storage — start fresh
  }
}

export type CartTotals = {
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export function cartTotals(items: CartItem[], promo: string | null): CartTotals {
  const subtotal = items.reduce((sum, i) => {
    const p = getProduct(i.slug);
    return p ? sum + p.price * i.qty : sum;
  }, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const discount = subtotal * promoRate(promo);
  const shipping = items.length ? SHIPPING_FLAT : 0;
  return { count, subtotal, discount, shipping, total: subtotal - discount + shipping };
}
