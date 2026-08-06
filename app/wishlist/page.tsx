"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProduct } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist-context";
import { ProductCard } from "@/components/product-card";
import { BottomNav, TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { Footer } from "@/components/footer";
import { GlassCard, PillLink } from "@/components/ui";
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon } from "@/components/icons";

export default function WishlistPage() {
  const router = useRouter();
  const wishlist = useWishlist();
  const products = wishlist.slugs
    .map((slug) => getProduct(slug))
    .filter((p) => p !== undefined);

  return (
    <>
      <Backdrop />
      <TopNav />
      <main id="main" className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:pt-10 md:pb-16">
        {/* Mobile header */}
        <header className="mb-6 flex items-center justify-between md:hidden">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="glass rounded-full p-2.5"
          >
            <ArrowLeftIcon width={18} height={18} />
          </button>
          <h1 className="text-display text-xl">Wishlist</h1>
          <span className="w-10" />
        </header>

        <div className="mb-6 hidden items-baseline justify-between md:flex">
          <h1 className="text-display text-3xl">Wishlist</h1>
          {products.length > 0 && (
            <button
              onClick={wishlist.clear}
              className="text-xs text-sage-300 transition hover:text-cream-50"
            >
              Clear all
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <GlassCard className="anim-bloom flex flex-col items-center gap-4 p-12 text-center">
            <HeartIcon width={32} height={32} className="text-sage-400" />
            <p className="text-sm text-sage-300">
              Nothing saved yet — tap the heart on any plant to keep it here.
            </p>
            <PillLink href="/shop" className="mt-2">
              Browse Plants <ArrowRightIcon width={16} height={16} />
            </PillLink>
          </GlassCard>
        ) : (
          <>
            <p className="mb-4 text-sm text-sage-300">
              {products.length} saved {products.length === 1 ? "plant" : "plants"}
            </p>
            <div className="anim-stagger grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <button
                onClick={wishlist.clear}
                className="text-xs text-sage-300 transition hover:text-cream-50"
              >
                Clear all
              </button>
            </div>
            <p className="mt-8 text-center text-xs text-sage-400">
              Looking for something else?{" "}
              <Link href="/shop" className="text-gold-300 hover:text-gold-400">
                Back to the shop
              </Link>
            </p>
          </>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
