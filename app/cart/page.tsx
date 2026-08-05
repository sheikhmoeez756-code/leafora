"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { BottomNav, TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { GlassCard, PillLink } from "@/components/ui";
import { QuantityStepper } from "@/components/quantity-stepper";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LeafIcon,
  TrashIcon,
} from "@/components/icons";

export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const [code, setCode] = useState("");
  const [promoState, setPromoState] = useState<"idle" | "ok" | "bad">("idle");

  function applyPromo() {
    if (!code.trim()) return;
    const ok = cart.applyPromo(code);
    setPromoState(ok ? "ok" : "bad");
    if (ok) setCode("");
  }

  return (
    <>
      <Backdrop />
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:pt-10 md:pb-16">
        {/* Mobile header */}
        <header className="mb-6 flex items-center justify-between md:hidden">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="glass rounded-full p-2.5"
          >
            <ArrowLeftIcon width={18} height={18} />
          </button>
          <h1 className="text-display text-xl">My Cart</h1>
          <span className="w-10" />
        </header>
        <h1 className="text-display mb-6 hidden text-3xl md:block">My Cart</h1>

        {cart.items.length === 0 ? (
          <GlassCard className="anim-bloom flex flex-col items-center gap-4 p-12 text-center">
            <LeafIcon width={32} height={32} className="text-sage-400" />
            <p className="text-sm text-sage-300">
              Your cart is empty — your future jungle awaits.
            </p>
            <PillLink href="/shop" className="mt-2">
              Browse Plants <ArrowRightIcon width={16} height={16} />
            </PillLink>
          </GlassCard>
        ) : (
          <div className="md:grid md:grid-cols-[1fr_22rem] md:items-start md:gap-8">
            {/* Line items */}
            <ul className="anim-stagger space-y-3">
              {cart.items.map(({ slug, qty }) => {
                const p = getProduct(slug);
                if (!p) return null;
                return (
                  <li key={slug}>
                    <GlassCard className="flex items-center gap-4 p-3">
                      <Link
                        href={`/plant/${slug}`}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-forest-800"
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="truncate text-[11px] text-sage-400 italic">
                          {p.latin}
                        </p>
                        <p className="pt-1 text-sm text-gold-300">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2.5 pr-1">
                        <button
                          aria-label={`Remove ${p.name}`}
                          onClick={() => cart.remove(slug)}
                          className="text-sage-400 transition hover:text-cream-50"
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                        <QuantityStepper
                          small
                          qty={qty}
                          onChange={(n) => cart.setQty(slug, n)}
                        />
                      </div>
                    </GlassCard>
                  </li>
                );
              })}
            </ul>

            {/* Summary */}
            <div className="anim-rise mt-6 space-y-4 [--d:0.2s] md:mt-0">
              <GlassCard className="p-4">
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setPromoState("idle");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    placeholder="Promo Code"
                    className="glass w-full rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-sage-400"
                  />
                  <button
                    onClick={applyPromo}
                    className="rounded-full bg-gold-400 px-5 text-sm font-medium text-forest-950 transition hover:bg-gold-300"
                  >
                    Apply
                  </button>
                </div>
                {cart.promo && (
                  <p className="flex items-center gap-1.5 pt-2.5 pl-2 text-xs text-gold-300">
                    <CheckIcon width={13} height={13} /> {cart.promo} applied —
                    10% off
                  </p>
                )}
                {promoState === "bad" && (
                  <p className="pt-2.5 pl-2 text-xs text-red-300">
                    That code isn&apos;t valid. Psst — try LEAF10.
                  </p>
                )}
              </GlassCard>

              <GlassCard className="space-y-2.5 p-5 text-sm">
                <div className="flex justify-between text-sage-300">
                  <span>Subtotal</span>
                  <span className="text-cream-50">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sage-300">
                    <span>Discount</span>
                    <span className="text-gold-300">
                      −{formatPrice(cart.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sage-300">
                  <span>Shipping</span>
                  <span className="text-cream-50">
                    {formatPrice(cart.shipping)}
                  </span>
                </div>
                <div className="my-2 border-t border-white/10" />
                <div className="flex justify-between text-base">
                  <span>Total</span>
                  <span className="text-display text-lg text-gold-300">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </GlassCard>

              <PillLink href="/checkout" className="w-full py-4">
                Proceed to Checkout <ArrowRightIcon width={17} height={17} />
              </PillLink>
              <p className="text-center text-[11px] text-sage-400">
                🔒 Secure checkout — demo only, no payment taken
              </p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
