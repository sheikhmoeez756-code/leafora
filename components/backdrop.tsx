import Image from "next/image";

/** Fixed blurred-foliage background used by all store pages. */
export function Backdrop() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      {/* Deliberately not `priority`: it's decorative, and preloading it
          competes with the real LCP image on every page. */}
      <Image
        src="/bg/leaves.jpg"
        alt=""
        fill
        sizes="100vw"
        className="anim-drift scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-forest-950/80" />
    </div>
  );
}
