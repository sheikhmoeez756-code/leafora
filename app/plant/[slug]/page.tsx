import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/products";
import { PlantDetail } from "./plant-detail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <PlantDetail product={product} />;
}
