# 🌿 Leafora — Bring Nature Home

A plant-shop e-commerce showcase with a dark forest-green, glassmorphism aesthetic — frosted glass cards over blurred botanical photography, serif display type, and soft gold accents.

**Live demo → [plants-eosin.vercel.app](https://plants-eosin.vercel.app)**

<p align="center">
  <img src="docs/screenshots/onboarding.jpg" alt="Onboarding — Leafora, Bring Nature Home" width="260" />
  <img src="docs/screenshots/shop.jpg" alt="Shop — search, promo banner, category chips, product grid" width="260" />
  <img src="docs/screenshots/detail.jpg" alt="Product detail — care stats and add to cart" width="260" />
</p>

## Features

- **Full shopping flow** — onboarding → shop → product detail → cart → mock checkout with an order confirmation. No backend, no payments; everything runs client-side.
- **Linkable filters** — search and category live in the query string, so `/shop?c=low-light` and `/shop?q=monstera` can be shared, bookmarked and stepped back through.
- **Working cart** — add from anywhere, quantity steppers, remove, and a promo code (`LEAF10` = 10% off). Persisted to `localStorage` and synced across tabs.
- **Wishlist** — save from a card or a product page; persisted separately from the cart.
- **Care guide** — `/care` groups every plant by light, watering, humidity and pet safety. It is derived from the catalogue rather than hand-written, so it cannot drift out of sync with what the shop sells.
- **FAQ** — `/faq` covers delivery, returns and the plant guarantee.
- **Related products** — scored by shared categories, light needs and pet safety, not picked at random.
- **Responsive** — bottom tab bar and single-column layout on mobile (faithful to the original app design), top navbar with multi-column layouts on desktop.
- **CSS-only motion** — entrance cascades, a slow Ken Burns drift on the backdrop, floating logo, cart-badge pops. Fully disabled under `prefers-reduced-motion`.
- **Accessible** — labelled controls, visible focus, a skip link, and no interactive elements nested inside links.

<p align="center">
  <img src="docs/screenshots/desktop-shop.jpg" alt="Desktop shop layout" width="800" />
</p>
<p align="center">
  <img src="docs/screenshots/cart.jpg" alt="Cart with promo code applied" width="320" />
</p>

## Stack

- [Next.js 15](https://nextjs.org) (App Router, static prerendering for all product pages)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com) (CSS-first config, custom design tokens)
- TypeScript
- [Vitest](https://vitest.dev) for unit tests, [Playwright](https://playwright.dev) for end-to-end
- Deployed on [Vercel](https://vercel.com)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try the promo code **LEAF10** in the cart.

> If images load unusually slowly, run `npm rebuild sharp` — recent npm versions
> skip install scripts by default, which leaves Next's image optimizer crippled.

## Testing

```bash
npm test          # unit tests (reducers, promo validation, storage parsing, totals)
npm run test:e2e  # Playwright, against a production build
npm run lint
```

The end-to-end suite drives real Chrome rather than a downloaded browser build, so
there is nothing extra to install locally. It runs on desktop and mobile viewports,
and includes regression tests for every bug fixed in the review pass.

CI runs lint, typecheck, unit and end-to-end on every pull request.

## Scripts

```bash
node scripts/optimize-images.mjs --dry   # report what would shrink
node scripts/optimize-images.mjs         # re-encode images in place
```

Caps width and quality per role — catalogue photography, the blurred backdrop,
and README screenshots each get different targets. Idempotent, and it will not
write a file that would grow.

## Project structure

```
app/            onboarding, shop, plant/[slug], cart, checkout, wishlist, care, faq
components/     glass cards, pill buttons, navs, product card, footer, icons
lib/            catalogue, care grouping, and cart/wishlist state
  *-core.ts     pure logic — reducers, storage parsing, totals (unit tested)
  *-context.tsx thin React wrappers around the above
e2e/            Playwright specs
scripts/        image optimization
public/plants/  product photography
```

## Credits

- Design recreated from a mobile app concept (reference screenshots kept locally, untracked).
- Plant photography: free images from Unsplash, Wikimedia Commons, and Flickr (CC-licensed).

---

*Demo project — no real orders, payments, or plants were harmed.* 🌱
