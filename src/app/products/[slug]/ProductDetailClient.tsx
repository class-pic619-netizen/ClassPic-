"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import ProductCard from "@/components/ProductCard";
import {
  ArrowLeft,
  ShoppingCart,
  Download,
  FileText,
  CheckCircle2,
  Maximize2,
  X,
  Printer,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  Zap,
  Check,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const totalPreviewPages = 3; // Let teachers preview multiple pages of the worksheet
  const isFree = product.is_free_sample || product.price === 0;

  const handleAddToCart = () => {
    addToCart(product);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Breadcrumb & Back Link */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#082340] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแคตตาล็อกใบงาน</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>รหัสใบงาน:</span>
          <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {product.id}
          </span>
        </div>
      </div>

      {/* Main Product Showcase: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Physical A4 Worksheet Desk Display (5 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Desk / Studio Backdrop with Shadows */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-b from-slate-100 via-slate-100/70 to-slate-200/80 rounded-2xl border border-slate-200/90 shadow-inner flex flex-col items-center justify-center">
            {/* The Actual A4 Paper Sheet Display */}
            <div className="relative w-full max-w-[380px] aspect-[1/1.38]">
              {/* Stack effect under paper */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-slate-300/60 rounded-sm shadow-md border border-slate-300/40 pointer-events-none" />
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-slate-200/80 rounded-sm shadow-md border border-slate-300/60 pointer-events-none" />

              {/* Main Sheet */}
              <div className="relative z-10 w-full h-full rounded-sm shadow-xl overflow-hidden bg-white">
                <WorksheetPaperPreview
                  slug={product.slug}
                  title={product.title}
                  gradeLevel={product.grade_level}
                  subject={product.subject}
                  pageNumber={activeImageIndex + 1}
                  totalPages={product.page_count}
                  hasAnswerKey={product.has_answer_key}
                />
              </div>

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute top-3 right-3 z-30 bg-[#082340]/90 hover:bg-[#082340] text-white p-2 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-medium backdrop-blur-xs"
                title="ขยายดูหน้ากระดาษแผ่นใหญ่"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">ขยายแผ่นเต็ม</span>
              </button>
            </div>

            {/* Page Selector Tabs under the desk */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">
                เปิดดูตัวอย่างแผ่นที่:
              </span>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                    activeImageIndex === idx
                      ? "bg-[#082340] text-white border-[#082340] shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  หน้า {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Explanation */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
            <span className="text-base leading-none">ℹ️</span>
            <p>
              ตัวอย่างบนหน้าจอมีการประทับลายน้ำ <strong>ClassPic Studio</strong> เพื่อความปลอดภัย ไฟล์ PDF คุณภาพ 300 DPI ที่ดาวน์โหลดหลังสั่งซื้อจะไม่มีลายน้ำ คมชัดพร้อมสั่งพิมพ์ทันที
            </p>
          </div>
        </div>

        {/* Right Column: Spec, Value & Buying Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            {/* Grade & Subject Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#1C64B8] bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-md">
                {product.subject}
              </span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                ระดับชั้น: {product.grade_level}
              </span>
              {isFree && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  ชุดทดลองสอนฟรี
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082340] leading-tight">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Paper Specification Box (Crafted Studio Layout) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold text-[#082340] uppercase tracking-wider">
              สเปกเอกสารสำหรับพิมพ์ (Print Specifications):
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Printer className="w-4 h-4 text-[#1C64B8]" />
                <span>ขนาด: <strong>A4 (210 × 297 มม.)</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FileText className="w-4 h-4 text-[#1C64B8]" />
                <span>จำนวน: <strong>{product.page_count} หน้า</strong> ครบชุด</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Layers className="w-4 h-4 text-[#1C64B8]" />
                <span>ไฟล์: <strong>PDF ดิจิทัล (300 DPI)</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>เฉลย: <strong>{product.has_answer_key ? "มีเฉลยในเล่ม" : "ไม่มีเฉลย"}</strong></span>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Block */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-baseline justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">ราคาจำหน่าย:</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  {isFree ? (
                    <span className="text-3xl font-extrabold text-emerald-600">
                      ฟรี ฿0
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-[#082340]">
                        ฿{product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-slate-400 line-through">
                          ฿{product.original_price}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                ชำระครั้งเดียว ดาวน์โหลดซ้ำได้ตลอด
              </span>
            </div>

            {/* Buttons */}
            {product.is_coming_soon ? (
              <button
                disabled
                className="w-full bg-slate-200 text-slate-400 font-semibold py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <Clock className="w-4 h-4" />
                <span>เปิดให้สั่งซื้อเร็วๆ นี้</span>
              </button>
            ) : isFree ? (
              <a
                href="/downloads"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์ตัวอย่างฟรีทันที</span>
              </a>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 font-bold py-3.5 px-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm active:scale-98 ${
                    addedSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-[#F5760A] hover:bg-[#d96303] text-white"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>เพิ่มลงตะกร้าแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>หยิบใส่ตะกร้า</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-[#082340] hover:bg-[#1C64B8] text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Zap className="w-4 h-4 text-[#F5760A]" />
                  <span>ชำระเงินทันที</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/70">
              <span>✓ ชำระผ่าน Mobile Banking ทุกธนาคาร</span>
              <span>✓ รับลิงก์ดาวน์โหลดทันที</span>
            </div>
          </div>

          {/* License Note */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-600 space-y-1.5">
            <h5 className="font-bold text-[#082340] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#1C64B8]" />
              <span>สิทธิ์การใช้งาน (ClassPic Educational License)</span>
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              อนุญาตให้ครูและผู้ปกครองพิมพ์แจกนักเรียนในชั้นเรียนได้ไม่จำกัดจำนวนครั้ง ไม่อนุญาตให้นำไฟล์ PDF หรือภาพใบงานไปจำหน่ายต่อในเชิงพาณิชย์
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50"
            title="ปิดหน้าต่าง"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-xl w-full aspect-[1/1.38] bg-white rounded-lg overflow-hidden shadow-2xl">
            <WorksheetPaperPreview
              slug={product.slug}
              title={product.title}
              gradeLevel={product.grade_level}
              subject={product.subject}
              pageNumber={activeImageIndex + 1}
              totalPages={product.page_count}
              hasAnswerKey={product.has_answer_key}
            />
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#082340]">
              ชุดใบงานอื่นๆ ในสตูดิโอ
            </h3>
            <Link
              href="/#catalog"
              className="text-xs font-semibold text-[#1C64B8] hover:underline"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
