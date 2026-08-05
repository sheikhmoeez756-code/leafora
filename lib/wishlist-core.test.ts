import { describe, expect, it } from "vitest";
import {
  EMPTY_WISHLIST,
  parseStoredWishlist,
  wishlistReducer,
} from "./wishlist-core";

const hydrated = (slugs: string[] = []) => ({ slugs, hydrated: true });

describe("wishlistReducer", () => {
  it("toggle adds then removes", () => {
    let s = wishlistReducer(hydrated(), { type: "toggle", slug: "monstera" });
    expect(s.slugs).toEqual(["monstera"]);
    s = wishlistReducer(s, { type: "toggle", slug: "monstera" });
    expect(s.slugs).toEqual([]);
  });

  it("preserves insertion order", () => {
    let s = hydrated();
    for (const slug of ["pothos", "monstera", "bamboo"]) {
      s = wishlistReducer(s, { type: "toggle", slug });
    }
    expect(s.slugs).toEqual(["pothos", "monstera", "bamboo"]);
  });

  it("remove is a no-op for something not saved", () => {
    const s = wishlistReducer(hydrated(["pothos"]), {
      type: "remove",
      slug: "monstera",
    });
    expect(s.slugs).toEqual(["pothos"]);
  });

  it("clear empties but keeps hydration", () => {
    const s = wishlistReducer(hydrated(["pothos"]), { type: "clear" });
    expect(s).toEqual({ slugs: [], hydrated: true });
  });

  it("hydrate always marks hydrated", () => {
    const s = wishlistReducer(EMPTY_WISHLIST, { type: "hydrate", slugs: [] });
    expect(s.hydrated).toBe(true);
  });
});

describe("parseStoredWishlist", () => {
  it("returns empty for null, junk and non-arrays", () => {
    for (const raw of [null, "", "{{{", "null", '{"a":1}']) {
      expect(parseStoredWishlist(raw)).toEqual([]);
    }
  });

  it("drops unknown slugs, non-strings and duplicates", () => {
    const raw = JSON.stringify([
      "monstera",
      "monstera",
      "not-a-plant",
      42,
      null,
      "pothos",
    ]);
    expect(parseStoredWishlist(raw)).toEqual(["monstera", "pothos"]);
  });
});
