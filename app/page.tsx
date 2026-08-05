import Image from "next/image";
import { PillLink } from "@/components/ui";
import { ArrowRightIcon, LeafIcon } from "@/components/icons";

export default function OnboardingPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden p-5">
      <Image
        src="/bg/leaves.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover blur-[2px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/30 via-forest-950/40 to-forest-950/85" />

      <div className="anim-bloom glass relative w-full max-w-sm rounded-[2rem] px-8 py-12 text-center md:max-w-md md:py-16">
        <div className="anim-rise mx-auto mb-8 h-16 w-16 [--d:0.15s]">
          <div className="anim-float glass flex h-16 w-16 items-center justify-center rounded-2xl">
            <LeafIcon width={30} height={30} className="text-gold-300" />
          </div>
        </div>

        <h1 className="anim-rise text-display text-5xl tracking-wide [--d:0.25s] md:text-6xl">
          Leafora
        </h1>
        <p className="anim-rise mt-3 text-sm tracking-[0.18em] text-sage-200 uppercase [--d:0.35s]">
          Bring Nature Home
        </p>

        <p className="anim-rise mx-auto mt-8 max-w-[16rem] text-sm leading-6 text-sage-300 [--d:0.45s]">
          Beautiful plants.
          <br />
          Happy spaces.
          <br />
          Better you.
        </p>

        <div className="anim-rise mt-10 [--d:0.55s]">
          <PillLink href="/shop" className="group w-full py-3.5">
            Get Started{" "}
            <ArrowRightIcon
              width={17}
              height={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </PillLink>
        </div>

        <div className="anim-rise mt-8 flex justify-center gap-1.5 [--d:0.65s]" aria-hidden>
          <span className="h-1.5 w-4 rounded-full bg-cream-50" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream-50/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream-50/30" />
        </div>
      </div>
    </main>
  );
}
