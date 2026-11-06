"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import WorksheetPaperPreview from "./WorksheetPaperPreview";
import { ShoppingBag, Eye, Check, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  index = 1,
  onAddToCart,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isFree = product.is_free_sample || product.price === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="group bg-white border-2 border-[#142E4F] shadow-[4px_4px_0px_#142E4F] hover:shadow-[6px_6px_0px_#F26C28] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
      {/* Top Studio Folio Header Strip */}
      <div className="px-3.5 py-2 bg-[#FAFBFD] border-b-2 border-[#142E4F] flex items-center justify-between text-[10px] font-mono">
        <span className="font-bold text-[#142E4F]">
          FOLIO #{String(index).padStart(2, "0")}
        </span>
        <span className="font-bold text-[#2856B0] uppercase">
          A4 • {product.page_count} PGS
        </span>
      </div>

      {/* Physical A4 Paper Mat Display */}
      <div className="relative p-4 bg-[#AED6F4]/30 border-b-2 border-[#142E4F] flex items-center justify-center">
        <div className="relative w-full aspect-[1/1.33] max-w-[270px]">
          {/* Offset Backing Paper */}
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#142E4F] pointer-events-none" />

          {/* Main Printable Worksheet Sheet */}
          <Link
            href={`/products/${product.slug}`}
            className="block w-full h-full relative z-10 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <WorksheetPaperPreview
              slug={product.slug}
              title={product.title}
              gradeLevel={product.grade_level}
              subject={product.subject}
              pageNumber={1}
              totalPages={product.page_count}
              hasAnswerKey={product.has_answer_key}
              coverImage={product.cover_image}
            />
          </Link>

          {/* Studio Hover Inspect Bar */}
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 z-20 bg-[#142E4F]/0 hover:bg-[#142E4F]/15 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <span className="bg-[#142E4F] text-white border-2 border-white text-[11px] font-bold px-3.5 py-1.5 shadow-[3px_3px_0px_#F26C28] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#F26C28]" />
              <span>เปิดดูตัวอย่างใบงาน</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Worksheet Metadata & Spec Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Subject & Grade Index Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-extrabold text-[#142E4F] bg-[#AED6F4]/60 border border-[#142E4F] px-2 py-0.5">
              {product.subject}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#2856B0] bg-[#FAFBFD] border border-[#2856B0]/40 px-2 py-0.5">
              {product.grade_level}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block group/title">
            <h3 className="font-extrabold text-sm sm:text-base text-[#142E4F] group-hover/title:text-[#2856B0] transition-colors leading-snug line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Spec Line */}
          <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-[#142E4F]/70 border-t border-dashed border-[#142E4F]/20">
            <span>SIZE: A4 (300 DPI)</span>
            <span>{product.has_answer_key ? "+ รวมเฉลยท้ายเล่ม" : "ชุดฝึกทักษะ"}</span>
          </div>
        </div>

        {/* Bottom Price & Action Block */}
        <div className="pt-3 border-t-2 border-[#142E4F] flex items-center justify-between gap-2">
          <div>
            {isFree ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-[#2856B0]">
                  FREE ฿0
                </span>
                <span className="text-[10px] font-mono text-[#142E4F]/60 uppercase">
                  SAMPLE
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-[#142E4F] font-mono">
                  ฿{product.price}
                </span>
                {product.original_price && (
                  <span className="text-xs font-mono text-slate-400 line-through">
                    ฿{product.original_price}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action CTA */}
          {product.is_coming_soon ? (
            <span className="text-[11px] font-mono font-bold text-[#142E4F]/50 bg-[#FAFBFD] border border-[#142E4F]/30 px-3 py-1.5">
              COMING SOON
            </span>
          ) : isFree ? (
            <Link
              href={`/products/${product.slug}`}
              className="bg-[#2856B0] hover:bg-[#142E4F] text-white text-xs font-bold px-3.5 py-2 border-2 border-[#142E4F] shadow-[2px_2px_0px_#142E4F] transition-all flex items-center gap-1"
            >
              <span>รับไฟล์ทดลอง</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`text-xs font-extrabold px-3.5 py-2 border-2 border-[#142E4F] shadow-[2px_2px_0px_#142E4F] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer ${
                justAdded
                  ? "bg-[#142E4F] text-white"
                  : "bg-[#F26C28] hover:bg-[#e06905] text-white"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>อยู่ในแฟ้มแล้ว</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>เลือกใส่แฟ้ม</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
