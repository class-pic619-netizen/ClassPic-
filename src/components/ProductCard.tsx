"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import WorksheetPaperPreview from "./WorksheetPaperPreview";
import { Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isFree = product.is_free_sample || product.price === 0;
  const href = `/products/${product.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) onAddToCart(product);
    else addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const info = product.is_coming_soon
    ? `${product.page_count} หน้า · เปิดขายเร็ว ๆ นี้`
    : isFree
      ? `${product.page_count} หน้า · แจกฟรี`
      : `${product.page_count} หน้า${product.has_answer_key ? " · มีเฉลย" : ""}`;

  return (
    <article className={`group flex flex-col w-full ${product.is_coming_soon ? "opacity-80" : ""}`}>
      <Link
        href={href}
        className="block rounded-[14px] bg-cp-bg px-[13%] py-7 transition-colors group-hover:bg-cp-mist"
      >
        <div className="aspect-[210/297] transition-transform duration-200 group-hover:-translate-y-1">
          <WorksheetPaperPreview
            slug={product.slug}
            title={product.title}
            gradeLevel={product.grade_level}
            subject={product.subject}
            totalPages={product.page_count}
            hasAnswerKey={product.has_answer_key}
            coverImage={product.cover_image}
          />
        </div>
      </Link>

      <div className="text-sm text-muted mt-3.5 mb-1">
        {product.subject} · {product.grade_level}
      </div>
      <Link href={href}>
        <h3 className="text-[18px] font-semibold text-cp-navy leading-snug line-clamp-2 hover:text-cp-blue">
          {product.title}
        </h3>
      </Link>
      <div className="text-sm text-muted mt-1">{info}</div>

      <div className="flex items-center justify-between mt-auto pt-3">
        {isFree ? (
          <span className="font-head text-[20px] font-semibold text-[#1b8a4b]">ฟรี</span>
        ) : (
          <span className="font-head text-[20px] font-semibold text-cp-navy">
            ฿{product.price}
            {product.original_price ? (
              <s className="ml-1.5 text-sm font-normal text-[#9aa6b2]">฿{product.original_price}</s>
            ) : null}
          </span>
        )}

        {product.is_coming_soon ? (
          <span className="text-sm text-muted">เร็ว ๆ นี้</span>
        ) : isFree ? (
          <Link href={href} className="btn-secondary text-sm px-3.5 py-2">
            ดาวน์โหลด
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`btn-secondary text-sm px-3.5 py-2 cursor-pointer ${
              justAdded ? "!border-[#1b8a4b] !text-[#1b8a4b]" : ""
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> ใส่แล้ว
              </>
            ) : (
              "ใส่ตะกร้า"
            )}
          </button>
        )}
      </div>
    </article>
  );
}
