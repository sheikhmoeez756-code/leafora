"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { blurProps } from "@/lib/blur-data";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { HeartIcon, PlusIcon, StarIcon } from "@/components/icons";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const liked = wishlist.has(product.slug);
  return (
    // The add button sits alongside the link rather than inside it — an <a> may
    // not contain interactive content, and nesting one forced a preventDefault
    // to stop the card navigating on every add.
    <div className="glass group relative rounded-3xl p-3 transition-transform duration-200 hover:-translate-y-1">
      <Link href={`/plant/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-forest-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            {...blurProps(product.image)}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="glass-deep absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-gold-300">
            <StarIcon width={11} height={11} /> {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="min-w-0 px-1 pt-3 pb-1 pr-11">
          <p className="truncate text-sm font-medium text-cream-50">
            {product.name}
          </p>
          <p className="truncate text-[11px] text-sage-400 italic">
            {product.latin}
          </p>
          <p className="pt-1 text-sm text-gold-300">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
      <button
        aria-label={
          liked
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={liked}
        onClick={() => wishlist.toggle(product.slug)}
        className={`glass-deep absolute top-5 right-5 rounded-full p-1.5 transition hover:bg-white/10 ${
          liked ? "text-gold-300" : "text-cream-50/70"
        }`}
      >
        <HeartIcon
          width={15}
          height={15}
          fill={liked ? "currentColor" : "none"}
        />
      </button>
      <button
        aria-label={`Add ${product.name} to cart`}
        onClick={() => add(product.slug)}
        className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-cream-50 text-forest-900 transition-transform hover:scale-105 active:scale-95"
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
