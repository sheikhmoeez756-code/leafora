import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/shop`, priority: 0.9 },
    // Filtered views are real, linkable pages now that state lives in the URL.
    { url: `${SITE_URL}/shop?c=low-light`, priority: 0.6 },
    { url: `${SITE_URL}/shop?c=pet-friendly`, priority: 0.6 },
    { url: `${SITE_URL}/shop?c=indoor`, priority: 0.6 },
    { url: `${SITE_URL}/shop?c=outdoor`, priority: 0.6 },
    { url: `${SITE_URL}/care`, priority: 0.7 },
    { url: `${SITE_URL}/faq`, priority: 0.5 },
    { url: `${SITE_URL}/wishlist`, priority: 0.3 },
    { url: `${SITE_URL}/cart`, priority: 0.3 },
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/plant/${p.slug}`,
      priority: 0.8,
    })),
  ];
}
