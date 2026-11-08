"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Maximize2, X, Check } from "lucide-react";

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

  const previewPages = Math.min(3, product.page_count);
  const specs = [
    { label: "ขนาด", value: "A4 (210 × 297 มม.)" },
    { label: "จำนวน", value: `${product.page_count} หน้า` },
    { label: "ไฟล์", value: "PDF พิมพ์ได้ทั้งขาวดำและสี" },
    { label: "เฉลย", value: product.has_answer_key ? "มี อยู่ท้ายไฟล์" : "ไม่มี" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-7 py-8 lg:py-10">
      <Link
        href="/#catalog"
        className="inline-flex items-center gap-1.5 font-head text-[15px] font-medium text-muted hover:text-cp-navy"
      >
        <ArrowLeft className="w-4 h-4" />
        ใบงานทั้งหมด
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start mt-6">
        {/* ตัวอย่างหน้าใบงาน */}
        <div>
          <div className="rounded-[18px] bg-cp-bg px-[14%] py-10 relative">
            <div className="aspect-[210/297]">
              <WorksheetPaperPreview
                slug={product.slug}
                title={product.title}
                gradeLevel={product.grade_level}
                subject={product.subject}
                pageNumber={activeImageIndex + 1}
                totalPages={product.page_count}
                hasAnswerKey={product.has_answer_key}
                coverImage={activeImageIndex === 0 ? product.cover_image : undefined}
              />
            </div>
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-head font-medium text-cp-navy hover:bg-cp-mist cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              ขยาย
            </button>
          </div>

          {previewPages > 1 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted mr-1">ดูหน้าที่</span>
              {Array.from({ length: previewPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-9 h-9 rounded-lg font-head text-sm font-semibold transition-colors cursor-pointer ${
                    activeImageIndex === idx
                      ? "bg-cp-navy text-white"
                      : "bg-cp-bg text-cp-navy hover:bg-cp-mist"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}

          <p className="text-sm text-muted mt-4">
            ภาพตัวอย่างมีลายน้ำ ไฟล์ PDF ที่ได้หลังชำระเงินไม่มีลายน้ำ
          </p>
        </div>

        {/* ข้อมูลและปุ่มซื้อ */}
        <div>
          <div className="text-[15px] text-muted">
            {product.subject} · {product.grade_level}
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-bold text-cp-navy leading-[1.3] mt-1">
            {product.title}
          </h1>
          <p className="text-[17px] text-muted mt-4">{product.description}</p>

          <div className="mt-7 flex items-baseline gap-2">
            {isFree ? (
              <span className="font-head text-[32px] font-bold text-[#1b8a4b]">ฟรี</span>
            ) : (
              <>
                <span className="font-head text-[32px] font-bold text-cp-navy">฿{product.price}</span>
                {product.original_price ? (
                  <s className="text-lg text-[#9aa6b2]">฿{product.original_price}</s>
                ) : null}
              </>
            )}
          </div>

          <div className="mt-5">
            {product.is_coming_soon ? (
              <button disabled className="btn-primary w-full sm:w-auto">
                เปิดขายเร็ว ๆ นี้
              </button>
            ) : isFree ? (
              <Link href="/downloads" className="btn-primary w-full sm:w-auto px-8">
                ดาวน์โหลดฟรี
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleBuyNow} className="btn-primary px-8 cursor-pointer">
                  ซื้อเลย
                </button>
                <button onClick={handleAddToCart} className="btn-secondary px-6 cursor-pointer">
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[#1b8a4b]" /> ใส่ตะกร้าแล้ว
                    </>
                  ) : (
                    "ใส่ตะกร้า"
                  )}
                </button>
              </div>
            )}
            <p className="text-sm text-muted mt-3">
              จ่ายผ่านพร้อมเพย์ได้ทุกธนาคาร · ได้ไฟล์ทันทีหลังแนบสลิป · โหลดซ้ำได้ตลอด
            </p>
          </div>

          <dl className="mt-8 border-t border-line">
            {specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4 py-3 border-b border-line text-[15px]">
                <dt className="text-muted">{spec.label}</dt>
                <dd className="text-cp-navy font-medium text-right">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <p className="text-sm text-muted mt-6">
            พิมพ์ใช้สอนในห้องเรียนหรือที่บ้านได้ไม่จำกัดครั้ง ขอไม่ให้นำไฟล์ไปขายต่อหรือแจกในกลุ่มสาธารณะ
          </p>
        </div>
      </div>

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-cp-navy/85 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 rounded-full bg-white p-2 text-cp-navy cursor-pointer"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-full max-w-xl aspect-[210/297]" onClick={(e) => e.stopPropagation()}>
            <WorksheetPaperPreview
              slug={product.slug}
              title={product.title}
              gradeLevel={product.grade_level}
              subject={product.subject}
              pageNumber={activeImageIndex + 1}
              totalPages={product.page_count}
              hasAnswerKey={product.has_answer_key}
              coverImage={activeImageIndex === 0 ? product.cover_image : undefined}
            />
          </div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-10 border-t border-line">
          <div className="flex items-end justify-between mb-7">
            <h2 className="text-[24px] font-semibold text-cp-navy">ใบงานอื่นที่น่าสนใจ</h2>
            <Link href="/#catalog" className="font-head font-medium text-cp-blue hover:text-cp-navy">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-11">
            {relatedProducts.slice(0, 3).map((rel) => (
              <div key={rel.id} className="flex">
                <ProductCard product={rel} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
