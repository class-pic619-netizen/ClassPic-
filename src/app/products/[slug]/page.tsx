import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getPublishedProducts } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(decodeURIComponent(slug));
  if (!product) return { title: "ไม่พบชุดใบงาน — ClassPic" };
  return {
    title: `${product.title} — ClassPic`,
    description: product.description,
    openGraph: {
      title: `${product.title} | ใบงาน A4 พร้อมพิมพ์`,
      description: product.description,
      images: product.cover_image ? [{ url: product.cover_image }] : undefined,
    },
  };
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;
  const products = await getPublishedProducts();
  const product = products.find((p) => p.slug === decodeURIComponent(slug));
  if (!product) notFound();

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);
  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

export default function ProductDetailPage(props: Props) {
  return (
    <Suspense fallback={<div className="py-24" />}>
      <ProductContent {...props} />
    </Suspense>
  );
}
