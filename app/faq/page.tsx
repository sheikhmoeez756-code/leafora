import type { Metadata } from "next";
import Link from "next/link";
import { SHIPPING_FLAT } from "@/lib/cart-core";
import { formatPrice } from "@/lib/products";
import { BottomNav, TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { Footer } from "@/components/footer";
import { GlassCard, PillLink } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "FAQ, Delivery & Returns — Leafora",
  description:
    "How plants are packed and delivered, what the 30-day guarantee covers, and how returns work.",
  alternates: { canonical: "/faq" },
};

type QA = { q: string; a: React.ReactNode };

const DELIVERY: QA[] = [
  {
    q: "How much is delivery?",
    a: (
      <>
        A flat {formatPrice(SHIPPING_FLAT)} on every order, however many plants are
        in it. It’s shown in the cart before you check out — no surprises at the
        final step.
      </>
    ),
  },
  {
    q: "How long does it take?",
    a: "Two to four working days. Plants are picked and packed the morning they ship, so they spend as little time in a box as possible.",
  },
  {
    q: "How are plants packed?",
    a: "Upright, with the pot braced so the rootball can't shift, and the soil surface covered so it doesn't empty into the box. Larger plants travel with their leaves loosely sleeved.",
  },
  {
    q: "Do you deliver outside the UK?",
    a: "Not currently. Live plants need phytosanitary paperwork that varies by country, and we'd rather not ship something that gets held at a border.",
  },
];

const RETURNS: QA[] = [
  {
    q: "My plant arrived damaged.",
    a: (
      <>
        Send a photo within 48 hours and we’ll replace it or refund it — your
        choice. Don’t send it back; a damaged plant rarely survives a second
        journey.
      </>
    ),
  },
  {
    q: "Can I return a plant I've changed my mind about?",
    a: "Within 14 days, unopened and unpotted, yes. Once a plant has been repotted we can't resell it, so at that point the guarantee below is the better route.",
  },
  {
    q: "What about the pots?",
    a: "Unused pots can go back within 30 days in their original packaging. Ceramics are fragile — reuse the box they arrived in if you can.",
  },
];

const GUARANTEE: QA[] = [
  {
    q: "What does the 30-day guarantee cover?",
    a: "If a plant declines in its first 30 days despite following the care guide, we'll replace it once. It covers plants that arrive stressed and don't recover — not ones that dry out on a windowsill for a fortnight.",
  },
  {
    q: "My plant is dropping leaves. Is that normal?",
    a: (
      <>
        Usually, yes. Plants drop a few leaves adjusting to a new room’s light and
        humidity — it often settles within a fortnight. The{" "}
        <Link href="/care" className="text-gold-300 hover:text-gold-400">
          care guide
        </Link>{" "}
        covers what each plant actually needs.
      </>
    ),
  },
  {
    q: "Are your plants safe for cats and dogs?",
    a: (
      <>
        Some are. Every product page states it, and the{" "}
        <Link href="/care#pets" className="text-gold-300 hover:text-gold-400">
          pet safety section
        </Link>{" "}
        lists which is which.
      </>
    ),
  },
];

function Group({ id, title, lede, items }: { id: string; title: string; lede: string; items: QA[] }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-display text-2xl md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-300">{lede}</p>
      <div className="anim-stagger mt-6 flex flex-col gap-3">
        {items.map(({ q, a }) => (
          <GlassCard key={q} className="p-0">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium">
                {q}
                <span
                  aria-hidden
                  className="shrink-0 text-gold-300 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-6 text-sage-300">{a}</p>
            </details>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export default function FaqPage() {
  return (
    <>
      <Backdrop />
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 pt-8 pb-16 md:pt-12">
        <header className="anim-rise max-w-2xl">
          <p className="text-xs tracking-[0.18em] text-sage-400 uppercase">Help</p>
          <h1 className="text-display mt-2 text-4xl md:text-5xl">
            Questions, answered
          </h1>
          <p className="mt-4 text-sm leading-7 text-sage-200 md:text-base">
            Delivery, returns and what happens when a plant doesn’t settle in.
          </p>
        </header>

        <GlassCard className="anim-rise mt-8 border-gold-400/25 p-5 text-sm leading-6 text-sage-200 [--d:0.1s]">
          <strong className="text-cream-50">This is a portfolio demo.</strong>{" "}
          Leafora isn’t a real shop — nothing here can be ordered, no payment is
          ever taken, and the policies below describe how it would work rather than
          a service you can buy.
        </GlassCard>

        <div className="mt-12 flex flex-col gap-14">
          <Group
            id="delivery"
            title="Delivery"
            lede="How plants get from us to you, and what it costs."
            items={DELIVERY}
          />
          <Group
            id="returns"
            title="Returns"
            lede="Living things don't travel twice well, so returns work a little differently here."
            items={RETURNS}
          />
          <Group
            id="guarantee"
            title="Plant guarantee"
            lede="The first month is when a plant is most likely to struggle."
            items={GUARANTEE}
          />
        </div>

        <GlassCard className="anim-rise mt-16 flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="text-display text-2xl">Still deciding?</h2>
          <p className="max-w-md text-sm leading-6 text-sage-300">
            Start from the spot you want to fill — light level, watering habits and
            whether you have pets.
          </p>
          <PillLink href="/care" className="mt-1">
            Read the care guide <ArrowRightIcon width={16} height={16} />
          </PillLink>
        </GlassCard>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
