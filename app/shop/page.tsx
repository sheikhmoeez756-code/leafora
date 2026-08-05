"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { BottomNav, TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { PillLink } from "@/components/ui";
import { CartIcon, LeafIcon, SearchIcon } from "@/components/icons";
import { useCart } from "@/lib/cart-context";

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const { count } = useCart();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const inCategory =
        category === "all" || p.categories.includes(category as Category);
      const matches =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.latin.toLowerCase().includes(q);
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
            {count > 0 && (
              <span
                key={count}
                className="anim-pop absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-forest-950"
              >
                {count}
              </span>
            )}
          </Link>
        </header>

        {/* Search */}
        <div className="anim-rise glass flex items-center gap-3 rounded-full px-5 py-3 [--d:0.08s] md:mt-2">
          <SearchIcon width={18} height={18} className="shrink-0 text-sage-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
                onClick={() => setCategory(key)}
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
              <button
                onClick={() => setCategory("indoor")}
                className="text-xs text-gold-300 hover:text-gold-400"
              >
                View All
              </button>
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
      </main>
      <BottomNav />
    </>
  );
}
