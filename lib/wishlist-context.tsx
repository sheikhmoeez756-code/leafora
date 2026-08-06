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
  EMPTY_WISHLIST,
  parseStoredWishlist,
  wishlistReducer,
} from "./wishlist-core";

type WishlistContextValue = {
  slugs: string[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "leafora-wishlist-v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, EMPTY_WISHLIST);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable (private mode) — fall through with nothing
    }
    dispatch({ type: "hydrate", slugs: parseStoredWishlist(raw) });
  }, []);

  // Another tab changed the wishlist. `storage` only fires in *other* tabs.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      dispatch({ type: "hydrate", slugs: parseStoredWishlist(e.newValue) });
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.slugs));
    } catch {
      // storage unavailable (private mode) — wishlist just won't persist
    }
  }, [state]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      slugs: state.slugs,
      count: state.slugs.length,
      has: (slug) => state.slugs.includes(slug),
      toggle: (slug) => dispatch({ type: "toggle", slug }),
      remove: (slug) => dispatch({ type: "remove", slug }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state.slugs]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
