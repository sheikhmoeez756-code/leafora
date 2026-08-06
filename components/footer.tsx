import Link from "next/link";
import { LeafIcon } from "@/components/icons";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All plants" },
      { href: "/shop?c=low-light", label: "Low light" },
      { href: "/shop?c=pet-friendly", label: "Pet friendly" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/care", label: "Plant care guide" },
      { href: "/care#light", label: "Light levels" },
      { href: "/care#water", label: "Watering" },
      { href: "/care#pets", label: "Pet safety" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/faq#delivery", label: "Delivery" },
      { href: "/faq#returns", label: "Returns" },
      { href: "/faq#guarantee", label: "Plant guarantee" },
    ],
  },
];

/** Site footer. Note the bottom padding on small screens — the fixed mobile
 *  tab bar would otherwise sit on top of the last row of links. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 pb-28 md:pb-0">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2">
              <LeafIcon width={20} height={20} className="text-gold-300" />
              <span className="text-display text-xl tracking-wide">Leafora</span>
            </span>
            <p className="max-w-60 text-sm leading-6 text-sage-300">
              Curated plants for every space and every plant parent.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-labelledby={`footer-${col.title}`}>
              <h2
                id={`footer-${col.title}`}
                className="text-xs tracking-[0.16em] text-sage-400 uppercase"
              >
                {col.title}
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-sage-300">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-cream-50">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-sage-400 md:flex-row md:items-center md:justify-between">
          <p>
            A portfolio demo — no real orders, payments, or plants are involved.
          </p>
          <p>
            Photography from{" "}
            <a
              href="https://unsplash.com"
              className="text-sage-300 transition hover:text-cream-50"
              target="_blank"
              rel="noreferrer"
            >
              Unsplash
            </a>
            ,{" "}
            <a
              href="https://commons.wikimedia.org"
              className="text-sage-300 transition hover:text-cream-50"
              target="_blank"
              rel="noreferrer"
            >
              Wikimedia Commons
            </a>{" "}
            and Flickr, under their respective licences.
          </p>
        </div>
      </div>
    </footer>
  );
}
