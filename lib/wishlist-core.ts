/** Pure wishlist logic — no React, no browser APIs. */

import { getProduct } from "./products";

export type WishlistState = {
  slugs: string[];
  /** Mirrors the cart: nothing is written back until storage has been read,
   *  so the empty default can never overwrite a saved list. */
  hydrated: boolean;
};

export type WishlistAction =
  | { type: "toggle"; slug: string }
  | { type: "remove"; slug: string }
  | { type: "clear" }
  | { type: "hydrate"; slugs: string[] };

export const EMPTY_WISHLIST: WishlistState = { slugs: [], hydrated: false };

export function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "toggle":
      return {
        ...state,
        slugs: state.slugs.includes(action.slug)
          ? state.slugs.filter((s) => s !== action.slug)
          : [...state.slugs, action.slug],
      };
    case "remove":
      return { ...state, slugs: state.slugs.filter((s) => s !== action.slug) };
    case "clear":
      return { ...state, slugs: [] };
    case "hydrate":
      return { slugs: action.slugs, hydrated: true };
  }
}

/** Storage is user-editable — keep only strings that name a product we still
 *  sell, deduped and in their original order. */
export function parseStoredWishlist(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [
      ...new Set(
        parsed.filter(
          (s): s is string => typeof s === "string" && getProduct(s) !== undefined
        )
      ),
    ];
  } catch {
    return [];
  }
}
