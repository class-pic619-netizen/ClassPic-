"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import ProductCard from "@/components/ProductCard";
import { ClassPicSpark } from "@/components/ClassPicLogo";
import {
  ArrowLeft,
  ShoppingBag,
  Download,
  Maximize2,
  X,
  Check,
  ArrowRight,
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
      {/* Top Studio Index Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#082340] pb-4">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#082340] hover:text-[#F5760A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>กลับสู่แฟ้มแคตตาล็อกใบงาน</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#082340]/60">SERIAL:</span>
          <span className="font-bold text-[#082340] bg-[#B5D5F2]/40 border border-[#082340] px-2 py-0.5">
            {product.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Product Showcase: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Physical A4 Worksheet Studio Board */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative p-6 sm:p-8 bg-[#B5D5F2]/30 border-2 border-[#082340] shadow-[6px_6px_0px_#082340] flex flex-col items-center justify-center">
            {/* Top Mat Header */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold text-[#082340] pb-3 mb-4 border-b border-[#082340]/20">
              <span>CLASSPIC PROOF MAT • A4 (210×297 MM)</span>
              <span className="text-[#1C64B8]">
                SHEET 0{activeImageIndex + 1} OF {product.page_count}
              </span>
            </div>

            {/* A4 Paper Sheet Display */}
            <div className="relative w-full max-w-[380px] aspect-[1/1.38]">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#082340] pointer-events-none" />

              <div className="relative z-10 w-full h-full bg-white">
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
                className="absolute top-3 right-3 z-30 bg-[#082340] hover:bg-[#1C64B8] text-white px-2.5 py-1.5 border border-white shadow-[2px_2px_0px_#F5760A] transition-all flex items-center gap-1.5 text-[11px] font-mono font-bold cursor-pointer"
                title="ขยายดูหน้ากระดาษแผ่นใหญ่"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#F5760A]" />
                <span>ZOOM A4</span>
              </button>
            </div>

            {/* Page Selector Index Tabs */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#082340] mr-1">
                PREVIEW SHEET:
              </span>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`text-xs font-mono px-3 py-1.5 font-bold transition-all border-2 cursor-pointer ${
                    activeImageIndex === idx
                      ? "bg-[#082340] text-white border-[#082340] shadow-[2px_2px_0px_#F5760A]"
                      : "bg-white text-[#082340] border-[#082340] hover:bg-[#B5D5F2]/40"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Protection Note */}
          <div className="p-3.5 bg-white border-2 border-[#082340] text-xs text-[#082340]/80 flex items-start gap-3">
            <span className="font-mono text-[10px] font-extrabold bg-[#082340] text-[#B5D5F2] px-1.5 py-0.5 shrink-0">
              NOTE
            </span>
            <p>
              ภาพตัวอย่างบนหน้าเว็บคาดลายน้ำ <strong>ClassPic Studio</strong> เพื่อคุ้มครองลิขสิทธิ์
              ไฟล์ต้นฉบับ PDF (300 DPI) ที่ท่านได้รับหลังชำระเงินจะไม่มีลายน้ำ คมชัดทุกเส้นพร้อมพิมพ์ทันที
            </p>
          </div>
        </div>

        {/* Right Column: Editorial Spec & Checkout Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-[#082340] bg-[#B5D5F2] border-2 border-[#082340] px-2.5 py-0.5">
                {product.subject}
              </span>
              <span className="text-xs font-mono font-bold text-white bg-[#082340] border-2 border-[#082340] px-2.5 py-0.5">
                GRADE: {product.grade_level}
              </span>
              {isFree && (
                <span className="text-xs font-mono font-bold text-white bg-[#F5760A] border-2 border-[#082340] px-2.5 py-0.5">
                  FREE SAMPLE EDITION
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082340] leading-tight">
              {product.title}
            </h1>

            <p className="text-sm text-[#082340]/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Architectural Print Specification Table */}
          <div className="bg-white border-2 border-[#082340] shadow-[4px_4px_0px_#B5D5F2]">
            <div className="px-4 py-2 bg-[#082340] text-white flex items-center justify-between text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <ClassPicSpark className="w-3.5 h-3.5" />
                <span>PRINT SPECIFICATIONS</span>
              </span>
              <span className="text-[#B5D5F2]">CLASSPIC STANDARD</span>
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-[#082340] text-xs">
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#1C64B8] font-bold">
                  PAPER SIZE
                </span>
                <strong className="text-[#082340] text-sm">A4 (210 × 297 มม.)</strong>
              </div>
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#1C64B8] font-bold">
                  TOTAL SHEETS
                </span>
                <strong className="text-[#082340] text-sm">{product.page_count} หน้าครบชุด</strong>
              </div>
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#1C64B8] font-bold">
                  FILE MASTER
                </span>
                <strong className="text-[#082340] text-sm">PDF 300 DPI คมชัดสูง</strong>
              </div>
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#1C64B8] font-bold">
                  ANSWER KEY
                </span>
                <strong className="text-[#082340] text-sm">
                  {product.has_answer_key ? "รวมเฉลยท้ายเล่ม" : "ชุดฝึกปฏิบัติ"}
                </strong>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Box */}
          <div className="bg-white border-2 border-[#082340] p-6 space-y-5 shadow-[6px_6px_0px_#082340]">
            <div className="flex items-baseline justify-between border-b-2 border-[#082340] pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#1C64B8] block">
                  EDITION PRICE
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  {isFree ? (
                    <span className="text-3xl font-extrabold text-[#1C64B8] font-mono">
                      FREE ฿0
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-[#082340] font-mono">
                        ฿{product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-sm font-mono text-slate-400 line-through">
                          ฿{product.original_price}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <span className="text-[11px] font-mono font-bold text-[#082340] bg-[#B5D5F2]/40 px-2.5 py-1 border border-[#082340]">
                LIFETIME RE-DOWNLOAD
              </span>
            </div>

            {product.is_coming_soon ? (
              <button
                disabled
                className="w-full bg-slate-100 text-slate-400 font-mono font-bold py-3.5 border-2 border-slate-300 cursor-not-allowed text-sm"
              >
                COMING SOON — กำลังจัดทำชุดใบงานนี้
              </button>
            ) : isFree ? (
              <a
                href="/downloads"
                className="w-full bg-[#1C64B8] hover:bg-[#082340] text-white font-extrabold py-3.5 px-6 border-2 border-[#082340] shadow-[4px_4px_0px_#082340] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>รับไฟล์ตัวอย่าง A4 ฟรีทันที</span>
              </a>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 font-extrabold py-3.5 px-6 border-2 border-[#082340] shadow-[4px_4px_0px_#082340] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${
                    addedSuccess
                      ? "bg-[#1C64B8] text-white"
                      : "bg-[#F5760A] hover:bg-[#e06905] text-white"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>อยู่ในแฟ้มสั่งซื้อแล้ว</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>เลือกใส่แฟ้มสั่งซื้อ</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-[#082340] hover:bg-[#1C64B8] text-white font-extrabold py-3.5 px-6 border-2 border-[#082340] shadow-[4px_4px_0px_#B5D5F2] active:translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ชำระเงินทันที</span>
                  <ArrowRight className="w-4 h-4 text-[#F5760A] stroke-[2.5]" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono text-[#082340]/75 pt-2 border-t border-dashed border-[#082340]/25">
              <span>PROMPTPAY QR (ALL BANKS)</span>
              <span>INSTANT PDF UNLOCK</span>
            </div>
          </div>

          {/* Educational License Box */}
          <div className="border-2 border-[#082340] p-4 bg-[#FAFBFD] text-xs space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#1C64B8] uppercase tracking-wider block">
              CLASSPIC EDUCATIONAL LICENSE
            </span>
            <p className="text-xs text-[#082340]/80 leading-relaxed">
              อนุญาตให้คุณครูและผู้ปกครองพิมพ์ใบงานชุดนี้เพื่อใช้สอนนักเรียนในชั้นเรียนหรือที่บ้านได้ไม่จำกัดจำนวนครั้ง
              สงวนลิขสิทธิ์ห้ามนำไฟล์ดิจิทัลไปจำหน่ายต่อหรือเผยแพร่ซ้ำในกลุ่มสาธารณะ
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-[#082340]/90 backdrop-blur-xs flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 text-white bg-[#F5760A] border-2 border-white p-2 cursor-pointer z-50"
            title="ปิดหน้าต่าง"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-xl w-full aspect-[1/1.38] bg-white border-2 border-white shadow-2xl">
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
        <section className="pt-8 border-t-2 border-[#082340] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#082340]">
              แฟ้มใบงานอื่นๆ ในสตูดิโอ ClassPic
            </h3>
            <Link
              href="/#catalog"
              className="text-xs font-mono font-bold text-[#1C64B8] hover:text-[#F5760A]"
            >
              VIEW ALL FOLIOS →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((rel, idx) => (
              <ProductCard key={rel.id} product={rel} index={idx + 1} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
