"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { BottomNav, CartBadge, TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { GlassCard, PillLink } from "@/components/ui";
import {
  ArrowRightIcon,
  CartIcon,
  CheckIcon,
  DropIcon,
  LeafIcon,
  PawIcon,
  SearchIcon,
  SunIcon,
} from "@/components/icons";

const PROMISES = [
  {
    icon: CheckIcon,
    title: "30-day guarantee",
    body: "If a plant struggles in its first month despite the care guide, we replace it once.",
  },
  {
    icon: LeafIcon,
    title: "Packed upright",
    body: "Braced pots, covered soil, sleeved leaves — so it arrives the shape it left.",
  },
  {
    icon: PawIcon,
    title: "Labelled for pets",
    body: "Every plant states whether it's safe around cats and dogs, before you buy.",
  },
];

const CATEGORY_KEYS = new Set(CATEGORIES.map((c) => c.key));

function isCategory(value: string | null): value is Category | "all" {
  return value !== null && CATEGORY_KEYS.has(value as Category | "all");
}

export function ShopBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // The URL is the source of truth, so a filtered view can be linked,
  // bookmarked and stepped back through.
  const category: Category | "all" = isCategory(params.get("c"))
    ? (params.get("c") as Category | "all")
    : "all";
  const urlQuery = params.get("q") ?? "";

  // The input stays local so typing never waits on a navigation; the URL
  // catches up shortly after.
  const [query, setQuery] = useState(urlQuery);
  const lastPushed = useRef(urlQuery);

  // Reflect back/forward navigation back into the field.
  useEffect(() => {
    if (urlQuery !== lastPushed.current) {
      lastPushed.current = urlQuery;
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  /** Choosing a category is a deliberate step the shopper may want to undo, so
   *  it goes into history. Typing is debounced and continuous — pushing there
   *  would bury the previous page under one entry per keystroke. */
  function writeParams(
    next: { q?: string; c?: Category | "all" },
    history: "push" | "replace"
  ) {
    const sp = new URLSearchParams(params.toString());
    const q = next.q ?? query;
    const c = next.c ?? category;
    if (q.trim()) sp.set("q", q.trim());
    else sp.delete("q");
    if (c !== "all") sp.set("c", c);
    else sp.delete("c");
    const search = sp.toString();
    lastPushed.current = q.trim();
    const url = search ? `${pathname}?${search}` : pathname;
    if (history === "push") router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
  }

  // Debounced so a keystroke doesn't trigger a navigation each time.
  useEffect(() => {
    if (query.trim() === urlQuery) return;
    const t = setTimeout(() => writeParams({ q: query }, "replace"), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const inCategory =
        category === "all" || p.categories.includes(category as Category);
      // Match the category labels too, so "low light" / "pet friendly" find
      // something instead of returning the empty state.
      const labels = p.categories
        .map((c) => CATEGORIES.find((x) => x.key === c)?.label ?? "")
        .join(" ")
        .toLowerCase();
      const matches =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.latin.toLowerCase().includes(q) ||
        labels.includes(q);
      return inCategory && matches;
    });
  }, [query, category]);

  const bestSellers = filtered.filter((p) => p.bestseller);
  const rest = filtered.filter((p) => !p.bestseller);
  const showSections = !query && category === "all";

  return (
    <>
      <Backdrop />
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:pt-8 md:pb-16">
        {/* Mobile header */}
        <header className="anim-rise mb-5 flex items-center justify-between md:hidden">
          <span className="flex items-center gap-2">
            <LeafIcon width={20} height={20} className="text-gold-300" />
            <span className="text-display text-xl tracking-wide">Leafora</span>
          </span>
          <Link href="/cart" aria-label="Cart" className="glass relative rounded-full p-2.5">
            <CartIcon width={19} height={19} />
            <CartBadge className="-top-1 -right-1" />
          </Link>
        </header>

        {/* Search */}
        <div className="anim-rise glass flex items-center gap-3 rounded-full px-5 py-3 [--d:0.08s] focus-within:border-gold-400/60 md:mt-2">
          <SearchIcon width={18} height={18} className="shrink-0 text-sage-300" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search plants and pots"
            placeholder="Search plants, pots…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-sage-400"
          />
        </div>

        {/* Promo banner */}
        <section className="anim-bloom glass relative mt-5 overflow-hidden rounded-3xl [--d:0.15s]">
          <div className="flex items-stretch">
            <div className="flex-1 p-6 md:p-10">
              <h2 className="text-display max-w-55 text-3xl leading-tight md:max-w-none md:text-4xl">
                Bring Greenery to&nbsp;Life
              </h2>
              <p className="mt-2 max-w-60 text-xs leading-5 text-sage-300 md:max-w-sm md:text-sm">
                Curated plants for every space and every plant parent.
              </p>
              <PillLink href="#plants" variant="gold" className="mt-5 px-5 py-2 text-xs md:text-sm">
                Shop Now
              </PillLink>
            </div>
            <div className="relative w-32 md:w-72">
              <Image
                src="/plants/monstera.jpg"
                alt="Monstera"
                fill
                sizes="(max-width: 768px) 128px, 288px"
                className="object-cover [mask-image:linear-gradient(to_right,transparent,black_30%)]"
              />
            </div>
          </div>
        </section>

        {/* Category chips */}
        <div className="anim-rise scrollbar-none -mx-4 mt-6 flex gap-2.5 overflow-x-auto px-4 pb-1 [--d:0.25s] md:mx-0 md:px-0">
          {CATEGORIES.map(({ key, label }) => {
            const active = category === key;
            return (
              <button
                key={key}
                onClick={() => writeParams({ c: key }, "push")}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-4 py-2 text-xs transition md:text-sm ${
                  active
                    ? "bg-cream-50 font-medium text-forest-900"
                    : "glass text-sage-200 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Best sellers */}
        {showSections && bestSellers.length > 0 && (
          <section className="mt-7">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-display text-xl">Best Sellers</h3>
              <Link
                href="#plants"
                className="text-xs text-gold-300 hover:text-gold-400"
              >
                View All
              </Link>
            </div>
            <div className="anim-stagger grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {bestSellers.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* All plants */}
        <section id="plants" className="mt-7 scroll-mt-24">
          {showSections && <h3 className="text-display mb-3 text-xl">Our Collection</h3>}
          {filtered.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center text-sm text-sage-300">
              No plants match your search — try something leafier. 🌿
              <button
                onClick={() => {
                  setQuery("");
                  writeParams({ q: "", c: "all" }, "push");
                }}
                className="mt-4 block w-full text-xs text-gold-300 hover:text-gold-400"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              key={category}
              className="anim-stagger grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
            >
              {(showSections ? rest : filtered).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Everything below is browsing context, not results — hidden while the
            shopper is actively searching or filtering. */}
        {showSections && (
          <div className="mt-16 flex flex-col gap-14">
            <section className="anim-stagger grid gap-4 md:grid-cols-3">
              {PROMISES.map(({ icon: Icon, title, body }) => (
                <GlassCard key={title} className="p-6">
                  <Icon width={20} height={20} className="text-gold-300" />
                  <h3 className="text-display mt-3 text-lg">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-sage-300">{body}</p>
                </GlassCard>
              ))}
            </section>

            <section className="glass anim-rise overflow-hidden rounded-3xl">
              <div className="grid items-center gap-6 p-8 md:grid-cols-[1.3fr_1fr] md:p-12">
                <div>
                  <p className="text-xs tracking-[0.18em] text-sage-400 uppercase">
                    Care guide
                  </p>
                  <h2 className="text-display mt-2 text-2xl md:text-3xl">
                    Start with the spot, not the plant
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-sage-300">
                    Most houseplants die of attention rather than neglect. Work out
                    how much light your corner actually gets, then pick something
                    that wants exactly that.
                  </p>
                  <PillLink href="/care" className="mt-6">
                    Read the care guide <ArrowRightIcon width={16} height={16} />
                  </PillLink>
                </div>

                <ul className="grid grid-cols-3 gap-3 md:grid-cols-1">
                  {[
                    { icon: SunIcon, label: "Light levels", href: "/care#light" },
                    { icon: DropIcon, label: "Watering", href: "/care#water" },
                    { icon: PawIcon, label: "Pet safety", href: "/care#pets" },
                  ].map(({ icon: Icon, label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="glass flex flex-col items-center gap-2 rounded-2xl px-3 py-4 text-center text-xs transition hover:bg-white/10 md:flex-row md:gap-3 md:px-5 md:text-left md:text-sm"
                      >
                        <Icon width={18} height={18} className="shrink-0 text-gold-300" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <Newsletter />
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
