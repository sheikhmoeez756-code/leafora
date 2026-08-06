import type { Metadata } from "next";
import { Suspense } from "react";
import { Backdrop } from "@/components/backdrop";
import { TopNav } from "@/components/nav";
import { ShopBrowser } from "./shop-browser";

export const metadata: Metadata = {
  title: "Shop — Leafora",
  description:
    "Every plant we sell, filterable by light level, watering habits and pet safety.",
  alternates: { canonical: "/shop" },
};

/** useSearchParams needs a Suspense boundary for the page to stay
 *  prerenderable, so the browser lives in its own client component. */
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <>
          <Backdrop />
          <TopNav />
          <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:pt-8">
            <div className="glass h-12 animate-pulse rounded-full" />
            <div className="glass mt-5 h-44 animate-pulse rounded-3xl" />
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="glass aspect-[3/4] animate-pulse rounded-3xl" />
              ))}
            </div>
          </main>
        </>
      }
    >
      <ShopBrowser />
    </Suspense>
  );
}
