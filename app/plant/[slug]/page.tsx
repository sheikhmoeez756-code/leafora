import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, formatPrice, getProduct } from "@/lib/products";
import { SITE_URL } from "@/lib/site";
import { PlantDetail } from "./plant-detail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Plant not found — Leafora" };

  const title = `${product.name} — ${formatPrice(product.price)} | Leafora`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/plant/${product.slug}` },
    openGraph: {
      title,
      description: product.description,
      url: `/plant/${product.slug}`,
      type: "website",
      images: [{ url: product.image, width: 1200, height: 1200, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    alternateName: product.latin,
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/plant/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlantDetail product={product} />
    </>
  );
}
