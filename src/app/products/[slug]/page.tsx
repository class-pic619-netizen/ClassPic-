import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "ไม่พบชุดใบงาน — ClassPic Store",
    };
  }

  return {
    title: `${product.title} — ClassPic Store`,
    description: product.description,
    openGraph: {
      title: `${product.title} | ใบงาน A4 คุณภาพสูง`,
      description: product.description,
      images: [{ url: product.cover_image }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
