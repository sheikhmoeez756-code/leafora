import { describe, expect, it } from "vitest";
import {
  PRODUCTS,
  formatPrice,
  getProduct,
  isSortKey,
  relatedProducts,
  sortProducts,
} from "./products";

describe("formatPrice", () => {
  it("always shows two decimals", () => {
    expect(formatPrice(24.99)).toBe("$24.99");
    expect(formatPrice(25)).toBe("$25.00");
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("sortProducts", () => {
  it("never mutates the input", () => {
    const input = [...PRODUCTS];
    const order = input.map((p) => p.slug);
    sortProducts(input, "price-asc");
    expect(input.map((p) => p.slug)).toEqual(order);
  });

  it("keeps catalogue order for featured", () => {
    expect(sortProducts(PRODUCTS, "featured").map((p) => p.slug)).toEqual(
      PRODUCTS.map((p) => p.slug)
    );
  });

  it("sorts by price in both directions", () => {
    const asc = sortProducts(PRODUCTS, "price-asc").map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = sortProducts(PRODUCTS, "price-desc").map((p) => p.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("sorts by rating, breaking ties on review count", () => {
    const sorted = sortProducts(PRODUCTS, "rating");
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      expect(
        prev.rating > cur.rating ||
          (prev.rating === cur.rating && prev.reviews >= cur.reviews)
      ).toBe(true);
    }
  });

  it("sorts by name alphabetically", () => {
    const names = sortProducts(PRODUCTS, "name").map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("keeps every product whatever the sort", () => {
    for (const key of ["featured", "price-asc", "price-desc", "rating", "name"] as const) {
      expect(sortProducts(PRODUCTS, key)).toHaveLength(PRODUCTS.length);
    }
  });
});

describe("isSortKey", () => {
  it("accepts known keys and rejects anything else", () => {
    expect(isSortKey("price-asc")).toBe(true);
    expect(isSortKey("featured")).toBe(true);
    expect(isSortKey("nonsense")).toBe(false);
    expect(isSortKey(null)).toBe(false);
  });
});

describe("relatedProducts", () => {
  it("returns nothing for an unknown slug", () => {
    expect(relatedProducts("not-a-plant")).toEqual([]);
  });

  it("never includes the product itself", () => {
    for (const p of PRODUCTS) {
      expect(relatedProducts(p.slug).some((r) => r.slug === p.slug)).toBe(false);
    }
  });

  it("returns the requested number for every product", () => {
    for (const p of PRODUCTS) {
      expect(relatedProducts(p.slug, 4)).toHaveLength(4);
    }
  });

  it("prefers plants sharing a category", () => {
    // Snake Plant is indoor + low-light; the top match should share both.
    const top = relatedProducts("snake-plant", 1)[0];
    const snake = getProduct("snake-plant")!;
    const shared = top.categories.filter((c) => snake.categories.includes(c));
    expect(shared.length).toBeGreaterThan(0);
  });

  it("still fills the row for a product with no shared categories", () => {
    // The ceramic pot has an empty categories array.
    const related = relatedProducts("ceramic-pot", 4);
    expect(related).toHaveLength(4);
    expect(new Set(related.map((r) => r.slug)).size).toBe(4);
  });

  it("returns no duplicates", () => {
    for (const p of PRODUCTS) {
      const slugs = relatedProducts(p.slug, 4).map((r) => r.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});
