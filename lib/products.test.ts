import { describe, expect, it } from "vitest";
import { PRODUCTS, formatPrice, getProduct, relatedProducts } from "./products";

describe("formatPrice", () => {
  it("always shows two decimals", () => {
    expect(formatPrice(24.99)).toBe("$24.99");
    expect(formatPrice(25)).toBe("$25.00");
    expect(formatPrice(0)).toBe("$0.00");
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
