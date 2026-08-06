import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { GlassCard, PillLink } from "@/components/ui";
import { ArrowRightIcon, LeafIcon } from "@/components/icons";

// Next already emits `<meta name="robots" content="noindex">` for not-found
// pages, so declaring it here only duplicates the tag.
export const metadata: Metadata = {
  title: "Page not found — Leafora",
};

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center p-5">
      <Backdrop />
      <GlassCard className="anim-bloom w-full max-w-md p-10 text-center">
        <div className="anim-float mx-auto mb-6 flex h-14 w-14 items-center justify-center">
          <LeafIcon width={30} height={30} className="text-gold-300" />
        </div>
        <p className="text-display text-5xl text-gold-300">404</p>
        <h1 className="text-display mt-3 text-2xl">This one didn’t take root</h1>
        <p className="mt-3 text-sm leading-6 text-sage-300">
          The page you’re after has been moved or never existed. The collection is
          still where you left it.
        </p>
        <PillLink href="/shop" className="mt-8 w-full">
          Browse the collection <ArrowRightIcon width={16} height={16} />
        </PillLink>
        <p className="mt-5 text-xs text-sage-400">
          Or read the{" "}
          <Link href="/care" className="text-gold-300 hover:text-gold-400">
            care guide
          </Link>{" "}
          ·{" "}
          <Link href="/faq" className="text-gold-300 hover:text-gold-400">
            FAQ
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
