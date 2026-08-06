"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { BottomNav, TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { GlassCard, PillButton, PillLink } from "@/components/ui";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LeafIcon,
} from "@/components/icons";

const inputCls =
  "glass w-full rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-sage-400 focus:border-gold-400/50";

/** Placeholders vanish once a field has content, so every input keeps a real
 *  (visually hidden) label attached to it. */
function Field({
  id,
  label,
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input id={id} placeholder={label} className={inputCls} {...rest} />
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setOrderTotal(cart.total);
    cart.clear();
    setPlaced(true);
  }

  if (placed) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-5">
        <Backdrop />
        <GlassCard className="anim-bloom w-full max-w-md p-10 text-center">
          <div className="anim-pop glass mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-gold-300">
            <CheckIcon width={28} height={28} />
          </div>
          <h1 className="text-display text-3xl">Order placed 🌿</h1>
          <p className="mt-3 text-sm leading-6 text-sage-300">
            Thank you! Your plants are getting a final misting and will be on
            their way soon. ({formatPrice(orderTotal)} — demo order, nothing
            was charged.)
          </p>
          <PillLink href="/shop" className="mt-8 w-full">
            Back to the Shop <ArrowRightIcon width={16} height={16} />
          </PillLink>
        </GlassCard>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-5">
        <Backdrop />
        <GlassCard className="w-full max-w-md p-10 text-center">
          <LeafIcon width={32} height={32} className="mx-auto text-sage-400" />
          <p className="mt-4 text-sm text-sage-300">
            Nothing to check out yet — your cart is empty.
          </p>
          <PillLink href="/shop" className="mt-6 w-full">
            Browse Plants <ArrowRightIcon width={16} height={16} />
          </PillLink>
        </GlassCard>
      </main>
    );
  }

  return (
    <>
      <Backdrop />
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:pt-10 md:pb-16">
        <header className="mb-6 flex items-center justify-between md:hidden">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="glass rounded-full p-2.5"
          >
            <ArrowLeftIcon width={18} height={18} />
          </button>
          <h1 className="text-display text-xl">Checkout</h1>
          <span className="w-10" />
        </header>
        <h1 className="text-display mb-6 hidden text-3xl md:block">Checkout</h1>

        <form
          onSubmit={placeOrder}
          className="md:grid md:grid-cols-[1fr_22rem] md:items-start md:gap-8"
        >
          {/* Delivery details */}
          <div className="anim-rise space-y-3">
            <h2 className="text-display px-1 text-lg">Delivery Details</h2>
            <Field id="co-name" label="Full name" required autoComplete="name" />
            <Field
              id="co-email"
              label="Email"
              type="email"
              required
              autoComplete="email"
            />
            <Field
              id="co-street"
              label="Street address"
              required
              autoComplete="street-address"
            />
            <div className="grid grid-cols-2 gap-3">
              <Field id="co-city" label="City" required autoComplete="address-level2" />
              <Field
                id="co-postal"
                label="Postal code"
                required
                autoComplete="postal-code"
              />
            </div>
            <div>
              <label htmlFor="co-notes" className="sr-only">
                Delivery notes (optional)
              </label>
              <textarea
                id="co-notes"
                placeholder="Delivery notes (optional) — e.g. “leave with the neighbor’s ficus”"
                rows={3}
                className={`${inputCls} resize-none rounded-2xl`}
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="anim-rise mt-8 space-y-4 [--d:0.15s] md:mt-0">
            <GlassCard className="p-5">
              <h2 className="text-display mb-4 text-lg">Order Summary</h2>
              <ul className="space-y-3">
                {cart.items.map(({ slug, qty }) => {
                  const p = getProduct(slug);
                  if (!p) return null;
                  return (
                    <li key={slug} className="flex items-center gap-3 text-sm">
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-forest-800">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {p.name}{" "}
                        <span className="text-sage-400">× {qty}</span>
                      </span>
                      <span className="text-cream-100">
                        {formatPrice(p.price * qty)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="my-4 border-t border-white/10" />
              <div className="space-y-2 text-sm text-sage-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-cream-50">{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount ({cart.promo})</span>
                    <span className="text-gold-300">−{formatPrice(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-cream-50">{formatPrice(cart.shipping)}</span>
                </div>
                <div className="flex justify-between pt-1 text-base text-cream-50">
                  <span>Total</span>
                  <span className="text-display text-lg text-gold-300">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>
            </GlassCard>

            <PillButton type="submit" className="w-full py-4">
              Place Order <ArrowRightIcon width={17} height={17} />
            </PillButton>
            <p className="text-center text-[11px] text-sage-400">
              Demo checkout — no payment is collected.
            </p>
          </div>
        </form>
      </main>
      <BottomNav />
    </>
  );
}
