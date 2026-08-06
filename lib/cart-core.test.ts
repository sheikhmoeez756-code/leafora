import { describe, expect, it } from "vitest";
import {
  EMPTY_CART,
  SHIPPING_FLAT,
  cartReducer,
  cartTotals,
  parseStoredCart,
  promoRate,
  type CartState,
} from "./cart-core";

const hydrated = (over: Partial<CartState> = {}): CartState => ({
  ...EMPTY_CART,
  hydrated: true,
  ...over,
});

describe("promoRate", () => {
  it("returns the rate for a known code", () => {
    expect(promoRate("LEAF10")).toBe(0.1);
  });

  it("returns 0 for unknown codes and null", () => {
    expect(promoRate("NOPE")).toBe(0);
    expect(promoRate(null)).toBe(0);
    expect(promoRate("")).toBe(0);
  });

  it("does not match inherited Object keys", () => {
    // A bare PROMO_CODES[code] lookup would return Object.prototype.constructor
    // here, and `subtotal * fn` is NaN.
    for (const key of ["constructor", "toString", "hasOwnProperty", "__proto__"]) {
      expect(promoRate(key)).toBe(0);
    }
  });

  it("is case sensitive — callers normalize first", () => {
    expect(promoRate("leaf10")).toBe(0);
  });
});

describe("cartReducer", () => {
  it("adds a new item and increments an existing one", () => {
    let s = cartReducer(hydrated(), { type: "add", slug: "monstera" });
    expect(s.items).toEqual([{ slug: "monstera", qty: 1 }]);
    s = cartReducer(s, { type: "add", slug: "monstera", qty: 2 });
    expect(s.items).toEqual([{ slug: "monstera", qty: 3 }]);
  });

  it("removes an item", () => {
    const s = cartReducer(hydrated({ items: [{ slug: "pothos", qty: 2 }] }), {
      type: "remove",
      slug: "pothos",
    });
    expect(s.items).toEqual([]);
  });

  it("drops the line when setQty goes below 1", () => {
    const s = cartReducer(hydrated({ items: [{ slug: "pothos", qty: 1 }] }), {
      type: "setQty",
      slug: "pothos",
      qty: 0,
    });
    expect(s.items).toEqual([]);
  });

  it("clear empties items and promo but preserves hydration", () => {
    const s = cartReducer(
      hydrated({ items: [{ slug: "pothos", qty: 1 }], promo: "LEAF10" }),
      { type: "clear" }
    );
    expect(s).toEqual({ items: [], promo: null, hydrated: true });
  });

  it("hydrate always marks the cart hydrated", () => {
    const s = cartReducer(EMPTY_CART, {
      type: "hydrate",
      state: { items: [], promo: null },
    });
    // This is what unblocks writes; if it stayed false the cart would never persist.
    expect(s.hydrated).toBe(true);
  });

  it("never mutates the previous state", () => {
    const before = hydrated({ items: [{ slug: "pothos", qty: 1 }] });
    const snapshot = structuredClone(before);
    cartReducer(before, { type: "add", slug: "pothos" });
    cartReducer(before, { type: "remove", slug: "pothos" });
    expect(before).toEqual(snapshot);
  });
});

describe("parseStoredCart", () => {
  it("returns an empty cart for null, junk and non-arrays", () => {
    for (const raw of [null, "", "{{{", "null", '{"items":"nope"}', "[]"]) {
      expect(parseStoredCart(raw)).toEqual({ items: [], promo: null });
    }
  });

  it("keeps valid lines and drops everything else", () => {
    const raw = JSON.stringify({
      items: [
        { slug: "monstera", qty: 2 },
        { slug: "pothos", qty: -5 }, // negative
        { slug: "pothos", qty: 0 }, // zero
        { slug: "pothos", qty: 1.5 }, // non-integer
        { slug: "pothos", qty: "3" }, // string — would concat on next add
        { slug: "not-a-plant", qty: 1 }, // unknown slug
        null,
      ],
      promo: null,
    });
    expect(parseStoredCart(raw).items).toEqual([{ slug: "monstera", qty: 2 }]);
  });

  it("normalizes a valid promo and rejects an invalid one", () => {
    expect(parseStoredCart('{"items":[],"promo":" leaf10 "}').promo).toBe("LEAF10");
    expect(parseStoredCart('{"items":[],"promo":"BOGUS"}').promo).toBe(null);
  });

  it("rejects a prototype-chain promo", () => {
    // The bug this guards: "constructor" used to hydrate as a live promo.
    expect(parseStoredCart('{"items":[],"promo":"constructor"}').promo).toBe(null);
  });
});

describe("cartTotals", () => {
  it("is all zeroes and no shipping for an empty cart", () => {
    expect(cartTotals([], null)).toEqual({
      count: 0,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
    });
  });

  it("sums line items and adds flat shipping", () => {
    const t = cartTotals(
      [
        { slug: "snake-plant", qty: 1 }, // 24.99
        { slug: "monstera", qty: 1 }, // 34.99
      ],
      null
    );
    expect(t.count).toBe(2);
    expect(t.subtotal).toBeCloseTo(59.98, 2);
    expect(t.shipping).toBe(SHIPPING_FLAT);
    expect(t.total).toBeCloseTo(64.97, 2);
  });

  it("applies a percentage discount before shipping", () => {
    const t = cartTotals(
      [
        { slug: "snake-plant", qty: 1 },
        { slug: "monstera", qty: 1 },
      ],
      "LEAF10"
    );
    expect(t.discount).toBeCloseTo(6.0, 2);
    expect(t.total).toBeCloseTo(58.97, 2);
  });

  it("multiplies by quantity", () => {
    const t = cartTotals([{ slug: "monstera", qty: 2 }], null);
    expect(t.count).toBe(2);
    expect(t.subtotal).toBeCloseTo(69.98, 2);
    expect(t.total).toBeCloseTo(74.97, 2);
  });

  it("ignores unknown slugs rather than producing NaN", () => {
    const t = cartTotals([{ slug: "ghost-plant", qty: 1 }], null);
    expect(t.subtotal).toBe(0);
    expect(Number.isNaN(t.total)).toBe(false);
  });

  it("never yields NaN for a poisoned promo", () => {
    const t = cartTotals([{ slug: "monstera", qty: 1 }], "constructor");
    expect(t.discount).toBe(0);
    expect(Number.isNaN(t.total)).toBe(false);
    expect(t.total).toBeCloseTo(39.98, 2);
  });
});
