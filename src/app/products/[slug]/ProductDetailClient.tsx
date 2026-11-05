"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import ProductCard from "@/components/ProductCard";
import {
  ArrowLeft,
  ShoppingCart,
  Download,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Maximize2,
  X,
  Printer,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const images = product.preview_images?.length
    ? product.preview_images
    : [product.cover_image];

  const currentImage = images[activeImageIndex] || product.cover_image;
  const isFree = product.is_free_sample || product.price === 0;

  const handleAddToCart = () => {
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Breadcrumb & Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C64B8] hover:text-[#082340] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแคตตาล็อก</span>
        </Link>

        <span className="text-xs text-slate-400 hidden sm:inline">
          รหัสใบงาน: {product.id}
        </span>
      </div>

      {/* Main Product Section: Two Columns (Preview Left, Details Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: A4 Previewer & Thumbnails (5 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main A4 Ratio Preview Container */}
          <div className="relative aspect-[1/1.3] bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-md flex items-center justify-center p-4 sm:p-6 group">
            {/* The A4 "Sheet" */}
            <div className="relative w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border border-slate-300">
              <Image
                src={currentImage}
                alt={`${product.title} - แผ่นที่ ${activeImageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Mandatory Watermark Overlay */}
              <WatermarkOverlay text="ClassPic Studio" />
            </div>

            {/* Zoom / Lightbox Trigger Button */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-6 right-6 z-20 bg-[#082340]/80 hover:bg-[#082340] text-white p-2.5 rounded-xl backdrop-blur-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-medium"
              title="กดเพื่อขยายดูตัวอย่างแผ่นใหญ่"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">ขยายดูแผ่นเต็ม</span>
            </button>

            {/* Page number badge */}
            <div className="absolute bottom-6 left-6 z-20 bg-[#082340]/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
              ตัวอย่างหน้าที่ {activeImageIndex + 1} จาก {images.length}
            </div>
          </div>

          {/* Thumbnail Slider / Page Switcher */}
          {images.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">
                เลือกแผ่นเพื่อดูตัวอย่าง:
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-[1/1.25] rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-[#F5760A] ring-2 ring-[#F5760A]/30 scale-102"
                        : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-bold">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Watermark Notice Banner */}
          <div className="bg-[#B5D5F2]/20 border border-[#B5D5F2]/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#082340]">
            <ShieldCheck className="w-4 h-4 text-[#1C64B8] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">ข้อสังเกตเกี่ยวกับรูปตัวอย่าง:</p>
              <p className="text-slate-600 mt-0.5">
                รูปตัวอย่างหน้าร้านมีการคาดลายน้ำเพื่อความปลอดภัย ไฟล์ PDF ตัวจริงที่ดาวน์โหลดหลังชำระเงินจะไม่มีลายน้ำ คมชัด 300 DPI เต็มแผ่นพร้อมพิมพ์
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Metadata, Pricing, Actions (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Grade & Subject Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#082340] text-white text-xs font-semibold px-3 py-1 rounded-lg">
              ระดับชั้น: {product.grade_level}
            </span>
            <span className="bg-[#1C64B8] text-white text-xs font-semibold px-3 py-1 rounded-lg">
              วิชา: {product.subject}
            </span>
            {isFree && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                ชุดทดลองสอนฟรี
              </span>
            )}
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082340] leading-tight">
            {product.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Feature Badges Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-2xs">
            <h4 className="text-xs font-bold text-[#082340] uppercase tracking-wider">
              สเปกและคุณสมบัติของไฟล์ชุดนี้:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <FileText className="w-4 h-4 text-[#1C64B8]" />
                <span>จำนวน: <strong>{product.page_count} หน้า</strong> A4 ครบชุด</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Printer className="w-4 h-4 text-[#1C64B8]" />
                <span>ขนาด: <strong>A4 (210 x 297 มม.)</strong> พอดีกระดาษ</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Layers className="w-4 h-4 text-[#1C64B8]" />
                <span>รูปแบบ: <strong>PDF ดิจิทัล (300 DPI)</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>เฉลย: <strong>{product.has_answer_key ? "มีเฉลยละเอียดในเล่ม" : "ไม่มีเฉลย"}</strong></span>
              </div>
            </div>
          </div>

          {/* Pricing & Call to Action Box */}
          <div className="bg-gradient-to-br from-[#082340] to-[#143b66] text-white rounded-2xl p-6 sm:p-7 space-y-5 shadow-lg border border-white/10">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-[#B5D5F2] uppercase tracking-wider font-semibold">
                  ราคาไฟล์ดิจิทัล PDF
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  {isFree ? (
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                      ฟรี ฿0
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#F5760A]">
                        ฿{product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-sm sm:text-base text-white/50 line-through">
                          ฿{product.original_price}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-white/10 text-[#B5D5F2] text-xs font-medium px-2.5 py-1 rounded-md">
                  ชำระครั้งเดียว ดาวน์โหลดได้ทันที
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {product.is_coming_soon ? (
                <button
                  disabled
                  className="w-full bg-white/20 text-white/50 font-semibold py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>กำลังเตรียมเปิดให้สั่งซื้อเร็วๆ นี้</span>
                </button>
              ) : isFree ? (
                <a
                  href="/downloads"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Download className="w-5 h-5" />
                  <span>ดาวน์โหลดไฟล์ตัวอย่างฟรีทันที</span>
                </a>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#F5760A] hover:bg-[#d96303] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{addedSuccess ? "✓ เพิ่มลงตะกร้าแล้ว!" : "หยิบใส่ตะกร้า / สั่งซื้อ"}</span>
                  </button>

                  <Link
                    href="/checkout"
                    className="bg-white/15 hover:bg-white/25 text-white font-semibold py-3.5 px-5 rounded-xl border border-white/20 transition-all text-center flex items-center justify-center"
                  >
                    <span>ชำระเงินทันที</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Security Notes */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-white/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B5D5F2]" />
                <span>รองรับสแกน QR PromptPay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B5D5F2]" />
                <span>ส่งมอบไฟล์ PDF ปลอดภัย 100%</span>
              </div>
            </div>
          </div>

          {/* Usage License Notice */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2 text-xs text-slate-600">
            <h5 className="font-bold text-[#082340] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#1C64B8]" />
              สิทธิ์การใช้งาน (ClassPic License):
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
              <li>อนุญาตให้พิมพ์เพื่อใช้สอนในห้องเรียน และการเรียนรู้ส่วนตัวในครอบครัว</li>
              <li>ไม่อนุญาตให้นำไฟล์ PDF หรือภาพใบงานไปจำหน่ายต่อ ดัดแปลงขาย หรือเผยแพร่สาธารณะบนอินเทอร์เน็ต</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (For Zooming Preview) */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50"
            title="ปิดหน้าต่าง"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-2xl w-full aspect-[1/1.3] bg-white rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={currentImage}
              alt="Zoomed preview"
              fill
              className="object-cover"
            />
            {/* Watermark in Modal */}
            <WatermarkOverlay text="ClassPic Studio" />
          </div>
        </div>
      )}

      {/* Related Worksheets Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#082340]">
                ชุดใบงานที่คุณอาจสนใจเพิ่มเติม
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เลือกดูชุดแบบฝึกหัดอื่นๆ ในสตูดิโอ ClassPic
              </p>
            </div>
            <Link
              href="/#catalog"
              className="text-xs font-semibold text-[#1C64B8] hover:text-[#082340]"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
