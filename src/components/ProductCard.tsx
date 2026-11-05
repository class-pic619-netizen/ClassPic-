"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { FileText, CheckCircle2, ShoppingCart, Eye, Sparkles, Clock } from "lucide-react";
import WatermarkOverlay from "./WatermarkOverlay";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isFree = product.is_free_sample || product.price === 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-[#1C64B8]/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Worksheet Preview Box (Proportional to A4 paper 1:1.41) */}
        <div className="relative aspect-[1/1.25] bg-gradient-to-b from-[#B5D5F2]/10 to-[#B5D5F2]/30 overflow-hidden border-b border-slate-100 flex items-center justify-center p-3">
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-inner bg-white">
            <Image
              src={product.cover_image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Watermark Protection */}
            <WatermarkOverlay text="ClassPic Studio" />
          </div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
            <span className="bg-[#082340]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md shadow-xs">
              {product.grade_level}
            </span>
            {isFree && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                แจกฟรี ฿0
              </span>
            )}
          </div>

          {/* Coming Soon Overlay */}
          {product.is_coming_soon && (
            <div className="absolute inset-0 z-30 bg-[#082340]/70 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
              <span className="bg-[#F5760A] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4" />
                เร็วๆ นี้ (Coming Soon)
              </span>
              <p className="text-xs text-white/80">กำลังจัดเตรียมไฟล์ PDF คุณภาพสูง</p>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-5 space-y-3">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[#1C64B8] bg-[#B5D5F2]/30 px-2 py-0.5 rounded">
              {product.subject}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <FileText className="w-3.5 h-3.5" />
              {product.page_count} หน้า A4
            </span>
            {product.has_answer_key && (
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                <CheckCircle2 className="w-3 h-3" />
                มีเฉลย
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-base text-[#082340] group-hover:text-[#1C64B8] transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Actions */}
      <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
        <div>
          {isFree ? (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-emerald-600 leading-none">ฟรี ฿0</span>
              <span className="text-[10px] text-slate-400 mt-0.5">ทดลองใช้สอน</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-[#F5760A] leading-none">
                  ฿{product.price}
                </span>
                {product.original_price && (
                  <span className="text-xs text-slate-400 line-through">
                    ฿{product.original_price}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">ไฟล์ PDF A4 คมชัด</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Preview Button */}
          <Link
            href={`/products/${product.slug}`}
            className="p-2 text-slate-500 hover:text-[#1C64B8] hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-2xs"
            title="ดูตัวอย่างใบงาน"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Action Button */}
          {product.is_coming_soon ? (
            <button
              disabled
              className="bg-slate-200 text-slate-400 text-xs font-semibold px-3 py-2 rounded-xl cursor-not-allowed"
            >
              เร็วๆ นี้
            </button>
          ) : isFree ? (
            <Link
              href={`/products/${product.slug}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
            >
              รับฟรี
            </Link>
          ) : (
            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              className="bg-[#F5760A] hover:bg-[#d96303] text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>สั่งซื้อ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
