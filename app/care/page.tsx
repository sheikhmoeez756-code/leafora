import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import {
  LIGHT_GROUPS,
  WATER_GROUPS,
  inGroup,
  petFriendly,
  populated,
  toxicToPets,
  type CareGroup,
} from "@/lib/care";
import { BottomNav, TopNav } from "@/components/nav";
import { Backdrop } from "@/components/backdrop";
import { Footer } from "@/components/footer";
import { GlassCard, PillLink } from "@/components/ui";
import {
  ArrowRightIcon,
  DropIcon,
  HumidityIcon,
  PawIcon,
  SunIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Plant Care Guide — Leafora",
  description:
    "How much light, how often to water, and which plants are safe around cats and dogs — a short guide to every plant we sell.",
  alternates: { canonical: "/care" },
};

function PlantChips({ group }: { group: CareGroup }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {inGroup(group).map((p) => (
        <li key={p.slug}>
          <Link
            href={`/plant/${p.slug}`}
            className="glass flex items-center gap-2 rounded-full py-1 pr-3.5 pl-1 text-xs transition hover:bg-white/10"
          >
            <span className="relative h-6 w-6 overflow-hidden rounded-full bg-forest-800">
              <Image src={p.image} alt="" fill sizes="24px" className="object-cover" />
            </span>
            {p.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Section({
  id,
  icon: Icon,
  title,
  lede,
  groups,
}: {
  id: string;
  icon: typeof SunIcon;
  title: string;
  lede: string;
  groups: CareGroup[];
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <Icon width={22} height={22} className="text-gold-300" />
        <h2 className="text-display text-2xl md:text-3xl">{title}</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-300">{lede}</p>

      <div className="anim-stagger mt-6 grid gap-4 md:grid-cols-2">
        {populated(groups).map((g) => (
          <GlassCard key={g.key} className="p-6">
            <h3 className="text-display text-lg">{g.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-sage-300">{g.blurb}</p>
            <PlantChips group={g} />
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export default function CarePage() {
  const safe = petFriendly();
  const toxic = toxicToPets();

  return (
    <>
      <Backdrop />
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 pt-8 pb-16 md:pt-12">
        <header className="anim-rise max-w-2xl">
          <p className="text-xs tracking-[0.18em] text-sage-400 uppercase">
            Plant care
          </p>
          <h1 className="text-display mt-2 text-4xl md:text-5xl">
            Keeping them alive
          </h1>
          <p className="mt-4 text-sm leading-7 text-sage-200 md:text-base">
            Most houseplants die of attention, not neglect. Below is every plant we
            sell, grouped by what it actually needs — find the spot you have, then
            pick a plant that suits it, rather than the other way round.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-14">
          <Section
            id="light"
            icon={SunIcon}
            title="Light"
            lede="The single biggest factor. Before buying, stand where the plant will live and look at the window — that tells you more than any label."
            groups={LIGHT_GROUPS}
          />

          <Section
            id="water"
            icon={DropIcon}
            title="Water"
            lede="Overwatering is the most common cause of death. When in doubt, wait another few days — a thirsty plant recovers, a drowned one usually doesn't."
            groups={WATER_GROUPS}
          />

          <section id="humidity" className="scroll-mt-24">
            <div className="flex items-center gap-3">
              <HumidityIcon width={22} height={22} className="text-gold-300" />
              <h2 className="text-display text-2xl md:text-3xl">Humidity</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-300">
              Central heating dries a room out badly in winter. Grouping plants
              together raises the humidity around them, and a pebble tray under the
              pot does more than misting.
            </p>
            <div className="anim-stagger mt-6 grid gap-4 md:grid-cols-3">
              {["Low is fine", "Average", "Medium", "Medium–high", "High"]
                .map((level) => ({
                  level,
                  plants: inGroup({
                    key: level,
                    title: level,
                    blurb: "",
                    match: (p) => p.care.humidity === level,
                  }),
                }))
                .filter((r) => r.plants.length > 0)
                .map(({ level, plants }) => (
                  <GlassCard key={level} className="p-5">
                    <h3 className="text-sm font-medium">{level}</h3>
                    <p className="mt-2 text-xs leading-5 text-sage-400">
                      {plants.map((p) => p.name).join(" · ")}
                    </p>
                  </GlassCard>
                ))}
            </div>
          </section>

          <section id="pets" className="scroll-mt-24">
            <div className="flex items-center gap-3">
              <PawIcon width={22} height={22} className="text-gold-300" />
              <h2 className="text-display text-2xl md:text-3xl">Pets</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-300">
              Cats and dogs chew. If yours does, the list on the left is the safe one
              — and if you think a pet has eaten something from the right, call a vet
              rather than waiting for symptoms.
            </p>

            <div className="anim-stagger mt-6 grid gap-4 md:grid-cols-2">
              <GlassCard className="p-6">
                <h3 className="text-display text-lg text-gold-300">
                  Safe around pets
                </h3>
                <p className="mt-1.5 text-sm text-sage-300">
                  {safe.length} of the {safe.length + toxic.length} plants we sell.
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {safe.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/plant/${p.slug}`}
                        className="flex items-center justify-between gap-3 text-sm transition hover:text-gold-300"
                      >
                        <span>
                          {p.name}{" "}
                          <span className="text-xs text-sage-400 italic">
                            {p.latin}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-sage-400">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-display text-lg">Keep out of reach</h3>
                <p className="mt-1.5 text-sm text-sage-300">
                  Not dangerous to handle — a problem only if eaten.
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {toxic.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/plant/${p.slug}`}
                        className="flex items-center justify-between gap-3 text-sm transition hover:text-cream-50"
                      >
                        <span className="text-sage-200">
                          {p.name}{" "}
                          <span className="text-xs text-sage-400 italic">
                            {p.latin}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-sage-400">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </section>
        </div>

        <GlassCard className="anim-rise mt-16 flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="text-display text-2xl">Know your spot? Find the plant.</h2>
          <p className="max-w-md text-sm leading-6 text-sage-300">
            Filter the shop by light level and pet safety to see only what will
            actually work where you’re putting it.
          </p>
          <div className="mt-1 flex flex-wrap justify-center gap-2.5">
            <PillLink href="/shop?c=low-light">Low light</PillLink>
            <PillLink href="/shop?c=pet-friendly" variant="glass">
              Pet friendly
            </PillLink>
            <PillLink href="/shop" variant="glass">
              Everything <ArrowRightIcon width={16} height={16} />
            </PillLink>
          </div>
        </GlassCard>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
