"use client";

import { useEffect } from "react";
import { Backdrop } from "@/components/backdrop";
import { GlassCard, PillButton, PillLink } from "@/components/ui";
import { ArrowRightIcon, LeafIcon } from "@/components/icons";

/** Route-level error boundary. `reset` re-renders the segment, which is enough
 *  for a transient failure; the link out is for when it isn't. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // No error reporting service in a demo — the console is the destination.
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex min-h-dvh items-center justify-center p-5">
      <Backdrop />
      <GlassCard className="anim-bloom w-full max-w-md p-10 text-center">
        <LeafIcon width={30} height={30} className="mx-auto text-gold-300" />
        <h1 className="text-display mt-5 text-2xl">Something wilted</h1>
        <p className="mt-3 text-sm leading-6 text-sage-300">
          This page hit an unexpected error. Trying again often clears it — your
          cart and wishlist are untouched.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <PillButton onClick={reset} className="w-full py-3.5">
            Try again
          </PillButton>
          <PillLink href="/shop" variant="glass" className="w-full py-3.5">
            Back to the shop <ArrowRightIcon width={16} height={16} />
          </PillLink>
        </div>

        {error.digest && (
          <p className="mt-6 font-mono text-[11px] text-sage-400">
            Reference: {error.digest}
          </p>
        )}
      </GlassCard>
    </main>
  );
}
