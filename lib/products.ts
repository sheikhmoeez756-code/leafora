export type Category = "indoor" | "outdoor" | "low-light" | "pet-friendly";

export type Product = {
  slug: string;
  name: string;
  latin: string;
  price: number;
  rating: number;
  reviews: number;
  categories: Category[];
  bestseller: boolean;
  care: {
    water: string;
    light: string;
    humidity: string;
    petFriendly: boolean;
  };
  description: string;
  image: string;
};

export const CATEGORIES: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All Plants" },
  { key: "indoor", label: "Indoor" },
  { key: "outdoor", label: "Outdoor" },
  { key: "low-light", label: "Low Light" },
  { key: "pet-friendly", label: "Pet Friendly" },
];

export const PRODUCTS: Product[] = [
  {
    slug: "snake-plant",
    name: "Snake Plant",
    latin: "Sansevieria trifasciata",
    price: 24.99,
    rating: 4.8,
    reviews: 120,
    categories: ["indoor", "low-light"],
    bestseller: true,
    care: {
      water: "Every 2–3 weeks",
      light: "Low to indirect",
      humidity: "Low is fine",
      petFriendly: false,
    },
    description:
      "Superb hardy and all-out purifying plant. Perfect for beginners and low-light spaces — it quietly forgives forgotten waterings.",
    image: "/plants/snake-plant.jpg",
  },
  {
    slug: "zz-plant",
    name: "ZZ Plant",
    latin: "Zamioculcas zamiifolia",
    price: 22.99,
    rating: 4.7,
    reviews: 96,
    categories: ["indoor", "low-light"],
    bestseller: true,
    care: {
      water: "Every 2–3 weeks",
      light: "Low to bright",
      humidity: "Average",
      petFriendly: false,
    },
    description:
      "Glossy, sculptural, and nearly indestructible. The ZZ thrives on neglect and shrugs off dim corners.",
    image: "/plants/zz-plant.jpg",
  },
  {
    slug: "pothos",
    name: "Pothos",
    latin: "Epipremnum aureum",
    price: 19.99,
    rating: 4.9,
    reviews: 214,
    categories: ["indoor", "low-light"],
    bestseller: true,
    care: {
      water: "Weekly",
      light: "Low to indirect",
      humidity: "Average",
      petFriendly: false,
    },
    description:
      "Trailing vines that grow like a rumor. Drape it from a shelf and watch it soften every hard edge in the room.",
    image: "/plants/pothos.jpg",
  },
  {
    slug: "monstera",
    name: "Monstera",
    latin: "Monstera deliciosa",
    price: 34.99,
    rating: 4.8,
    reviews: 168,
    categories: ["indoor"],
    bestseller: false,
    care: {
      water: "Weekly",
      light: "Bright indirect",
      humidity: "Medium–high",
      petFriendly: false,
    },
    description:
      "The icon. Split leaves, big presence, and a jungle attitude that turns any corner into a statement.",
    image: "/plants/monstera.jpg",
  },
  {
    slug: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    latin: "Ficus lyrata",
    price: 49.99,
    rating: 4.5,
    reviews: 87,
    categories: ["indoor"],
    bestseller: false,
    care: {
      water: "Weekly",
      light: "Bright indirect",
      humidity: "Medium",
      petFriendly: false,
    },
    description:
      "Broad violin-shaped leaves with editorial polish. A little particular about its spot — devoted once settled.",
    image: "/plants/fiddle-leaf-fig.jpg",
  },
  {
    slug: "peace-lily",
    name: "Peace Lily",
    latin: "Spathiphyllum wallisii",
    price: 27.99,
    rating: 4.6,
    reviews: 143,
    categories: ["indoor", "low-light"],
    bestseller: false,
    care: {
      water: "Weekly",
      light: "Low to medium",
      humidity: "Medium–high",
      petFriendly: false,
    },
    description:
      "Elegant white blooms over deep green leaves. It droops dramatically when thirsty, then bounces right back.",
    image: "/plants/peace-lily.jpg",
  },
  {
    slug: "spider-plant",
    name: "Spider Plant",
    latin: "Chlorophytum comosum",
    price: 16.99,
    rating: 4.7,
    reviews: 190,
    categories: ["indoor", "pet-friendly"],
    bestseller: false,
    care: {
      water: "Weekly",
      light: "Bright indirect",
      humidity: "Average",
      petFriendly: true,
    },
    description:
      "Cheerful arching ribbons that send out baby plantlets. Safe for cats and dogs, generous with cuttings.",
    image: "/plants/spider-plant.jpg",
  },
  {
    slug: "calathea",
    name: "Calathea",
    latin: "Calathea orbifolia",
    price: 29.99,
    rating: 4.4,
    reviews: 71,
    categories: ["indoor", "pet-friendly", "low-light"],
    bestseller: false,
    care: {
      water: "Weekly, filtered",
      light: "Medium indirect",
      humidity: "High",
      petFriendly: true,
    },
    description:
      "Silver-striped leaves that fold up at night like praying hands. A diva about humidity, worth every bit of it.",
    image: "/plants/calathea.jpg",
  },
  {
    slug: "bamboo",
    name: "Bamboo",
    latin: "Bambusa vulgaris",
    price: 44.99,
    rating: 4.6,
    reviews: 64,
    categories: ["outdoor", "pet-friendly"],
    bestseller: false,
    care: {
      water: "Keep moist",
      light: "Full to part sun",
      humidity: "Medium",
      petFriendly: true,
    },
    description:
      "Fast-growing green architecture for patios and gardens. A living privacy screen that whispers in the wind.",
    image: "/plants/bamboo.jpg",
  },
  {
    slug: "ceramic-pot",
    name: "Ceramic Pot",
    latin: "Sage green, 6\"",
    price: 12.99,
    rating: 4.9,
    reviews: 302,
    categories: [],
    bestseller: false,
    care: {
      water: "—",
      light: "—",
      humidity: "—",
      petFriendly: true,
    },
    description:
      "Matte sage-glazed stoneware with a drainage hole and saucer. The quiet supporting actor every plant deserves.",
    image: "/plants/ceramic-pot.jpg",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

export const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
  { key: "name", label: "Name A–Z" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

export function isSortKey(value: string | null): value is SortKey {
  return SORTS.some((s) => s.key === value);
}

/** Returns a new array — never sorts the caller's list in place. "featured"
 *  preserves catalogue order, which is the curated one. */
export function sortProducts(items: Product[], key: SortKey): Product[] {
  const out = [...items];
  switch (key) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "rating":
      return out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "name":
      return out.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
      return out;
  }
}

/** Plants that genuinely suit the same spot: shared categories first, then a
 *  matching light requirement, with rating as the tie-break. Falls back to
 *  bestsellers so a product with no overlap still shows something useful. */
export function relatedProducts(slug: string, limit = 4): Product[] {
  const product = getProduct(slug);
  if (!product) return [];

  const scored = PRODUCTS.filter((p) => p.slug !== slug)
    .map((p) => {
      const shared = p.categories.filter((c) =>
        product.categories.includes(c)
      ).length;
      const sameLight = p.care.light === product.care.light ? 1 : 0;
      const samePets = p.care.petFriendly === product.care.petFriendly ? 0.5 : 0;
      return { p, score: shared * 2 + sameLight + samePets };
    })
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating);

  const related = scored.filter((s) => s.score > 0).map((s) => s.p);
  if (related.length >= limit) return related.slice(0, limit);

  // Top up with bestsellers rather than returning a thin row.
  const filler = PRODUCTS.filter(
    (p) => p.slug !== slug && !related.includes(p)
  ).sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating);

  return [...related, ...filler].slice(0, limit);
}
