import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/shop`, priority: 0.9 },
    { url: `${SITE_URL}/cart`, priority: 0.3 },
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/plant/${p.slug}`,
      priority: 0.8,
    })),
  ];
}
