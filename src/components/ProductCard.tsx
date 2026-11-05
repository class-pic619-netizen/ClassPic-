"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import WorksheetPaperPreview from "./WorksheetPaperPreview";
import {
  FileText,
  ShoppingCart,
  Eye,
  Check,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
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

  // Color mapping based on subject for a warm craft feel
  const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
    ภาษาอังกฤษ: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
    เชาวน์ปัญญา: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
    คณิตศาสตร์: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
    ภาษาไทย: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
    วิทยาศาสตร์: { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
    ศิลปะและกิจกรรม: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  };

  const theme = subjectColors[product.subject] || {
    bg: "bg-slate-50",
    text: "text-slate-800",
    border: "border-slate-200",
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5">
      {/* Top Paper Display (A4 Aspect Ratio: 1:1.41) */}
      <div className="relative p-4 pb-2 bg-gradient-to-b from-slate-100/70 to-slate-50/50 rounded-t-xl border-b border-slate-100 flex items-center justify-center">
        {/* Paper Shadow Stack Effect (Looks like real printed sheets) */}
        <div className="relative w-full aspect-[1/1.32] max-w-[280px]">
          {/* Back sheet effect */}
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-slate-200/80 rounded-sm shadow-xs border border-slate-300/60 pointer-events-none" />
          
          {/* Main Printable Worksheet Sheet */}
          <Link
            href={`/products/${product.slug}`}
            className="block w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-[1.01]"
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

          {/* Quick Hover Inspect Pill */}
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 z-20 bg-[#082340]/0 hover:bg-[#082340]/10 transition-colors flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100"
          >
            <span className="bg-[#082340] text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
              <Eye className="w-3.5 h-3.5" />
              <span>คลิกดูตัวอย่างใบงาน</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Information Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Subject & Grade Level Micro Badges */}
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${theme.bg} ${theme.text} ${theme.border}`}
            >
              {product.subject}
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {product.grade_level}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block group/title">
            <h3 className="font-bold text-sm sm:text-base text-[#082340] group-hover/title:text-[#1C64B8] transition-colors leading-snug line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Paper Specs Summary */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{product.page_count} หน้า A4</span>
            </span>
            {product.has_answer_key && (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>มีเฉลยในชุด</span>
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            {isFree ? (
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-extrabold text-emerald-600">
                  ฟรี ฿0
                </span>
                <span className="text-[10px] text-slate-400 font-normal">ทดลองสอน</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-[#082340]">
                  ฿{product.price}
                </span>
                {product.original_price && (
                  <span className="text-xs text-slate-400 line-through">
                    ฿{product.original_price}
                  </span>
                )}
              </div>
            )}
            <span className="text-[9px] text-slate-400 block -mt-0.5">
              ไฟล์ PDF A4 ปริ้นท์คมชัด
            </span>
          </div>

          {/* Add to Cart / Free Download Button */}
          {product.is_coming_soon ? (
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
              เร็วๆ นี้
            </span>
          ) : isFree ? (
            <Link
              href={`/products/${product.slug}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>รับไฟล์ฟรี</span>
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-[#F5760A] hover:bg-[#d96303] text-white"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>ใส่แล้ว</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>หยิบใส่ตะกร้า</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
