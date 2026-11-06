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
      <div className="flex items-center justify-between border-b-2 border-[#142E4F] pb-4">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#142E4F] hover:text-[#F26C28] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>กลับสู่แฟ้มแคตตาล็อกใบงาน</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#142E4F]/60">SERIAL:</span>
          <span className="font-bold text-[#142E4F] bg-[#AED6F4]/40 border border-[#142E4F] px-2 py-0.5">
            {product.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Product Showcase: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Physical A4 Worksheet Studio Board */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative p-6 sm:p-8 bg-[#AED6F4]/30 border-2 border-[#142E4F] shadow-[6px_6px_0px_#142E4F] flex flex-col items-center justify-center">
            {/* Top Mat Header */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold text-[#142E4F] pb-3 mb-4 border-b border-[#142E4F]/20">
              <span>CLASSPIC PROOF MAT • A4 (210×297 MM)</span>
              <span className="text-[#2856B0]">
                SHEET 0{activeImageIndex + 1} OF {product.page_count}
              </span>
            </div>

            {/* A4 Paper Sheet Display */}
            <div className="relative w-full max-w-[380px] aspect-[1/1.38]">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#142E4F] pointer-events-none" />

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
                className="absolute top-3 right-3 z-30 bg-[#142E4F] hover:bg-[#2856B0] text-white px-2.5 py-1.5 border border-white shadow-[2px_2px_0px_#F26C28] transition-all flex items-center gap-1.5 text-[11px] font-mono font-bold cursor-pointer"
                title="ขยายดูหน้ากระดาษแผ่นใหญ่"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#F26C28]" />
                <span>ZOOM A4</span>
              </button>
            </div>

            {/* Page Selector Index Tabs */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#142E4F] mr-1">
                PREVIEW SHEET:
              </span>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`text-xs font-mono px-3 py-1.5 font-bold transition-all border-2 cursor-pointer ${
                    activeImageIndex === idx
                      ? "bg-[#142E4F] text-white border-[#142E4F] shadow-[2px_2px_0px_#F26C28]"
                      : "bg-white text-[#142E4F] border-[#142E4F] hover:bg-[#AED6F4]/40"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Protection Note */}
          <div className="p-3.5 bg-white border-2 border-[#142E4F] text-xs text-[#142E4F]/80 flex items-start gap-3">
            <span className="font-mono text-[10px] font-extrabold bg-[#142E4F] text-[#AED6F4] px-1.5 py-0.5 shrink-0">
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
              <span className="text-xs font-extrabold text-[#142E4F] bg-[#AED6F4] border-2 border-[#142E4F] px-2.5 py-0.5">
                {product.subject}
              </span>
              <span className="text-xs font-mono font-bold text-white bg-[#142E4F] border-2 border-[#142E4F] px-2.5 py-0.5">
                GRADE: {product.grade_level}
              </span>
              {isFree && (
                <span className="text-xs font-mono font-bold text-white bg-[#F26C28] border-2 border-[#142E4F] px-2.5 py-0.5">
                  FREE SAMPLE EDITION
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142E4F] leading-tight">
              {product.title}
            </h1>

            <p className="text-sm text-[#142E4F]/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Architectural Print Specification Table */}
          <div className="bg-white border-2 border-[#142E4F] shadow-[4px_4px_0px_#AED6F4]">
            <div className="px-4 py-2 bg-[#142E4F] text-white flex items-center justify-between text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <ClassPicSpark className="w-3.5 h-3.5" />
                <span>PRINT SPECIFICATIONS</span>
              </span>
              <span className="text-[#AED6F4]">CLASSPIC STANDARD</span>
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-[#142E4F] text-xs">
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#2856B0] font-bold">
                  PAPER SIZE
                </span>
                <strong className="text-[#142E4F] text-sm">A4 (210 × 297 มม.)</strong>
              </div>
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#2856B0] font-bold">
                  TOTAL SHEETS
                </span>
                <strong className="text-[#142E4F] text-sm">{product.page_count} หน้าครบชุด</strong>
              </div>
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#2856B0] font-bold">
                  FILE MASTER
                </span>
                <strong className="text-[#142E4F] text-sm">PDF 300 DPI คมชัดสูง</strong>
              </div>
              <div className="p-3.5">
                <span className="block font-mono text-[10px] text-[#2856B0] font-bold">
                  ANSWER KEY
                </span>
                <strong className="text-[#142E4F] text-sm">
                  {product.has_answer_key ? "รวมเฉลยท้ายเล่ม" : "ชุดฝึกปฏิบัติ"}
                </strong>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Box */}
          <div className="bg-white border-2 border-[#142E4F] p-6 space-y-5 shadow-[6px_6px_0px_#142E4F]">
            <div className="flex items-baseline justify-between border-b-2 border-[#142E4F] pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#2856B0] block">
                  EDITION PRICE
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  {isFree ? (
                    <span className="text-3xl font-extrabold text-[#2856B0] font-mono">
                      FREE ฿0
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-[#142E4F] font-mono">
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

              <span className="text-[11px] font-mono font-bold text-[#142E4F] bg-[#AED6F4]/40 px-2.5 py-1 border border-[#142E4F]">
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
                className="w-full bg-[#2856B0] hover:bg-[#142E4F] text-white font-extrabold py-3.5 px-6 border-2 border-[#142E4F] shadow-[4px_4px_0px_#142E4F] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>รับไฟล์ตัวอย่าง A4 ฟรีทันที</span>
              </a>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 font-extrabold py-3.5 px-6 border-2 border-[#142E4F] shadow-[4px_4px_0px_#142E4F] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${
                    addedSuccess
                      ? "bg-[#2856B0] text-white"
                      : "bg-[#F26C28] hover:bg-[#e06905] text-white"
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
                  className="bg-[#142E4F] hover:bg-[#2856B0] text-white font-extrabold py-3.5 px-6 border-2 border-[#142E4F] shadow-[4px_4px_0px_#AED6F4] active:translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ชำระเงินทันที</span>
                  <ArrowRight className="w-4 h-4 text-[#F26C28] stroke-[2.5]" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono text-[#142E4F]/75 pt-2 border-t border-dashed border-[#142E4F]/25">
              <span>PROMPTPAY QR (ALL BANKS)</span>
              <span>INSTANT PDF UNLOCK</span>
            </div>
          </div>

          {/* Educational License Box */}
          <div className="border-2 border-[#142E4F] p-4 bg-[#FAFBFD] text-xs space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#2856B0] uppercase tracking-wider block">
              CLASSPIC EDUCATIONAL LICENSE
            </span>
            <p className="text-xs text-[#142E4F]/80 leading-relaxed">
              อนุญาตให้คุณครูและผู้ปกครองพิมพ์ใบงานชุดนี้เพื่อใช้สอนนักเรียนในชั้นเรียนหรือที่บ้านได้ไม่จำกัดจำนวนครั้ง
              สงวนลิขสิทธิ์ห้ามนำไฟล์ดิจิทัลไปจำหน่ายต่อหรือเผยแพร่ซ้ำในกลุ่มสาธารณะ
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-[#142E4F]/90 backdrop-blur-xs flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 text-white bg-[#F26C28] border-2 border-white p-2 cursor-pointer z-50"
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
        <section className="pt-8 border-t-2 border-[#142E4F] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#142E4F]">
              แฟ้มใบงานอื่นๆ ในสตูดิโอ ClassPic
            </h3>
            <Link
              href="/#catalog"
              className="text-xs font-mono font-bold text-[#2856B0] hover:text-[#F26C28]"
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
