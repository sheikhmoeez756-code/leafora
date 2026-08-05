"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { PlusIcon, StarIcon } from "@/components/icons";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <Link
      href={`/plant/${product.slug}`}
      className="glass group block rounded-3xl p-3 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-forest-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="glass-deep absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-gold-300">
          <StarIcon width={11} height={11} /> {product.rating.toFixed(1)}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2 px-1 pt-3 pb-1">
        <div className="min-w-0">
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
        <button
          aria-label={`Add ${product.name} to cart`}
          onClick={(e) => {
            e.preventDefault();
            add(product.slug);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-50 text-forest-900 transition-transform hover:scale-105 active:scale-95"
        >
          <PlusIcon width={16} height={16} />
        </button>
      </div>
    </Link>
  );
}
