"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft } from "lucide-react";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import BrandIcon from "@/components/BrandIcon";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalItems, totalAmount } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-7 py-8 lg:py-10">
      <Link
        href="/#catalog"
        className="inline-flex items-center gap-1.5 font-head text-[15px] font-medium text-muted hover:text-cp-navy"
      >
        <ArrowLeft className="w-4 h-4" />
        เลือกใบงานเพิ่ม
      </Link>

      <div className="flex items-end justify-between mt-5 mb-8">
        <h1 className="text-[30px] font-bold text-cp-navy">
          ตะกร้า <span className="text-muted font-normal text-xl">({totalItems})</span>
        </h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-sm text-muted hover:text-[#c0392b] cursor-pointer">
            ล้างตะกร้า
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl bg-cp-bg py-16 text-center">
          <BrandIcon name="book-reading" className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-cp-navy">ยังไม่มีใบงานในตะกร้า</h3>
          <p className="text-muted mt-1 mb-6">มีชุดฟรีให้ลองก่อนด้วย</p>
          <Link href="/#catalog" className="btn-primary">
            ดูใบงานทั้งหมด
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          <ul className="border-t border-line">
            {cart.map((item) => (
              <li key={item.product.id} className="flex gap-5 py-6 border-b border-line">
                <div className="w-20 sm:w-24 shrink-0 aspect-[210/297]">
                  <WorksheetPaperPreview
                    slug={item.product.slug}
                    title={item.product.title}
                    gradeLevel={item.product.grade_level}
                    subject={item.product.subject}
                    coverImage={item.product.cover_image}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted">
                    {item.product.subject} · {item.product.grade_level}
                  </div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="block text-[17px] font-head font-semibold text-cp-navy hover:text-cp-blue leading-snug mt-0.5"
                  >
                    {item.product.title}
                  </Link>
                  <div className="text-sm text-muted mt-1">
                    {item.product.page_count} หน้า{item.product.has_answer_key ? " · มีเฉลย" : ""}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm text-muted hover:text-[#c0392b] mt-3 cursor-pointer"
                  >
                    ลบออก
                  </button>
                </div>
                <div className="text-right font-head">
                  <div className="text-lg font-semibold text-cp-navy">฿{item.product.price}</div>
                  {item.product.original_price ? (
                    <s className="text-sm text-[#9aa6b2]">฿{item.product.original_price}</s>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <aside className="panel p-6 lg:sticky lg:top-24">
            <h3 className="font-semibold text-cp-navy mb-4 flex items-center gap-2">
              <BrandIcon name="receipt" className="w-6 h-6" />
              สรุป
            </h3>
            <div className="flex justify-between text-[15px] text-muted py-1.5">
              <span>ใบงาน</span>
              <span>{totalItems} ชุด</span>
            </div>
            <div className="flex justify-between text-[15px] text-muted py-1.5">
              <span>ค่าส่ง</span>
              <span>ไม่มี (ดาวน์โหลด)</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-line mt-3 pt-4">
              <span className="font-head font-semibold text-cp-navy">รวม</span>
              <span className="font-head text-[28px] font-bold text-cp-navy">฿{totalAmount}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full py-3.5 mt-5">
              ไปชำระเงิน
            </Link>
            <p className="text-sm text-muted mt-4">
              กรอกแค่เบอร์โทรหรืออีเมล สแกนจ่ายพร้อมเพย์ได้ทุกธนาคาร แล้วได้ไฟล์ทันที
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
