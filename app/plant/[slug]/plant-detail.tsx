"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { PillButton } from "@/components/ui";
import {
  ArrowLeftIcon,
  CartIcon,
  CheckIcon,
  DropIcon,
  HeartIcon,
  HumidityIcon,
  PawIcon,
  StarIcon,
  SunIcon,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

function CareStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}) {
  return (
    <div className="glass flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3.5 text-center">
      <Icon width={18} height={18} className="text-gold-300" />
      <span className="text-[10px] tracking-wide text-sage-400 uppercase">
        {label}
      </span>
      <span className="text-[11px] leading-tight text-cream-100">{value}</span>
    </div>
  );
}

export function PlantDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const liked = wishlist.has(product.slug);

  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  function handleAdd() {
    add(product.slug);
    setAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      <Backdrop />
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 pt-5 pb-36 md:grid md:grid-cols-2 md:gap-10 md:pt-10 md:pb-16">
        {/* Image */}
        <div className="anim-bloom relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-forest-800 md:aspect-[4/5]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40rem"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-forest-950/20" />
          </div>

          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="glass-deep absolute top-4 left-4 rounded-full p-2.5 transition hover:bg-white/10"
          >
            <ArrowLeftIcon width={18} height={18} />
          </button>
          <button
            aria-label={
              liked
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={liked}
            onClick={() => wishlist.toggle(product.slug)}
            className={`glass-deep absolute top-4 right-4 rounded-full p-2.5 transition hover:bg-white/10 ${
              liked ? "text-gold-300" : ""
            }`}
          >
            <HeartIcon
              width={18}
              height={18}
              fill={liked ? "currentColor" : "none"}
            />
          </button>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="glass-deep flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-gold-300">
              <StarIcon width={12} height={12} /> {product.rating.toFixed(1)}{" "}
              <span className="text-sage-300">({product.reviews})</span>
            </span>
            <span className="glass-deep flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-sage-200">
              <SunIcon width={13} height={13} /> {product.care.light}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 md:mt-0 md:flex md:flex-col md:justify-center">
          <h1 className="anim-rise text-display text-3xl [--d:0.1s] md:text-5xl">
            {product.name}
          </h1>
          <p className="anim-rise mt-1 text-sm text-sage-400 italic [--d:0.18s]">
            {product.latin}
          </p>

          <p className="anim-rise mt-4 text-sm leading-6 text-sage-200 [--d:0.26s] md:text-base md:leading-7">
            {product.description}
          </p>

          <div className="anim-stagger mt-6 grid grid-cols-4 gap-2.5 md:gap-3">
            <CareStat icon={DropIcon} label="Water" value={product.care.water} />
            <CareStat icon={SunIcon} label="Light" value={product.care.light} />
            <CareStat
              icon={HumidityIcon}
              label="Humidity"
              value={product.care.humidity}
            />
            <CareStat
              icon={PawIcon}
              label="Pets"
              value={product.care.petFriendly ? "Pet friendly" : "Keep away"}
            />
          </div>

          {/* Desktop price + CTA (mobile uses the fixed bar below) */}
          <div className="anim-rise mt-8 hidden items-center gap-5 [--d:0.45s] md:flex">
            <span className="text-display text-3xl text-gold-300">
              {formatPrice(product.price)}
            </span>
            <PillButton onClick={handleAdd} className="flex-1 py-4">
              <span key={String(added)} className="anim-pop flex items-center gap-2">
                {added ? (
                  <>
                    Added <CheckIcon width={17} height={17} />
                  </>
                ) : (
                  <>
                    Add to Cart <CartIcon width={17} height={17} />
                  </>
                )}
              </span>
            </PillButton>
          </div>
        </div>

        {/* Mobile fixed price bar */}
        <div className="anim-rise glass-deep fixed inset-x-3 bottom-3 z-30 flex items-center gap-4 rounded-3xl p-3 pl-6 [--d:0.35s] md:hidden">
          <span className="text-display text-2xl text-gold-300">
            {formatPrice(product.price)}
          </span>
          <PillButton onClick={handleAdd} className="flex-1 py-3.5">
            <span key={String(added)} className="anim-pop flex items-center gap-2">
              {added ? (
                <>
                  Added <CheckIcon width={16} height={16} />
                </>
              ) : (
                <>
                  Add to Cart <CartIcon width={16} height={16} />
                </>
              )}
            </span>
          </PillButton>
        </div>
      </main>
    </>
  );
}
