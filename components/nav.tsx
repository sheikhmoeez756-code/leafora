"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import {
  CartIcon,
  GridIcon,
  HeartIcon,
  HomeIcon,
  LeafIcon,
  UserIcon,
} from "@/components/icons";

export function CartBadge({ className = "-top-1.5 -right-1.5" }: { className?: string }) {
  const { count } = useCart();
  if (!count) return null;
  return (
    <span
      key={count}
      className={`anim-pop absolute flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-forest-950 ${className}`}
    >
      {count}
      <span className="sr-only"> items in cart</span>
    </span>
  );
}

function WishlistBadge({ className = "-top-1.5 -right-1.5" }: { className?: string }) {
  const { count } = useWishlist();
  if (!count) return null;
  return (
    <span
      key={count}
      className={`anim-pop absolute flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-forest-950 ${className}`}
    >
      {count}
      <span className="sr-only"> plants saved</span>
    </span>
  );
}

const tabs = [
  { href: "/shop", label: "Home", icon: HomeIcon },
  { href: "/shop#plants", label: "Plants", icon: GridIcon },
  { href: "/cart", label: "Cart", icon: CartIcon, badge: "cart" as const },
  { href: "/wishlist", label: "Wishlist", icon: HeartIcon, badge: "wishlist" as const },
  { href: "/profile", label: "Profile", icon: UserIcon, disabled: true },
];

/** Mobile bottom tab bar — hidden on md+ where the top navbar takes over. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="glass-deep fixed inset-x-3 bottom-3 z-40 rounded-3xl md:hidden">
      <ul className="flex items-center justify-around px-2 py-2.5">
        {tabs.map(({ href, label, icon: Icon, badge, disabled }) => {
          const active = pathname === href.split("#")[0] && label !== "Plants";
          const cls = `flex flex-col items-center gap-0.5 px-2 text-[10px] transition-colors ${
            active
              ? "text-gold-300"
              : disabled
                ? "text-sage-400/40"
                : "text-sage-300 hover:text-cream-50"
          }`;
          const inner = (
            <>
              <span className="relative">
                <Icon width={22} height={22} />
                {badge === "cart" && <CartBadge />}
                {badge === "wishlist" && <WishlistBadge />}
              </span>
              {label}
            </>
          );
          return (
            <li key={label}>
              {/* Unbuilt sections render as inert text — an href="#" link stays
                  focusable and jumps to the top of the page when activated. */}
              {disabled ? (
                <span className={cls} aria-disabled title="Coming soon">
                  {inner}
                </span>
              ) : (
                <Link href={href} className={cls}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Desktop top navbar — hidden on small screens. */
export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 hidden md:block">
      <div className="glass-deep mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
        <Link href="/shop" className="flex items-center gap-2">
          <LeafIcon className="text-gold-300" width={22} height={22} />
          <span className="text-display text-xl tracking-wide">Leafora</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-sage-300">
          <Link
            href="/shop"
            className={pathname === "/shop" ? "text-cream-50" : "hover:text-cream-50"}
          >
            Shop
          </Link>
          <Link
            href="/shop#plants"
            className="hover:text-cream-50"
          >
            Plants
          </Link>
          <Link
            href="/care"
            className={pathname === "/care" ? "text-cream-50" : "hover:text-cream-50"}
          >
            Care
          </Link>
          <Link
            href="/wishlist"
            className={`relative ${pathname === "/wishlist" ? "text-cream-50" : "hover:text-cream-50"}`}
            aria-label="Wishlist"
          >
            <HeartIcon width={22} height={22} />
            <WishlistBadge />
          </Link>
          <Link
            href="/cart"
            className={`relative ${pathname === "/cart" ? "text-cream-50" : "hover:text-cream-50"}`}
            aria-label="Cart"
          >
            <CartIcon width={22} height={22} />
            <CartBadge />
          </Link>
        </nav>
      </div>
    </header>
  );
}
