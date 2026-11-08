"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X } from "lucide-react";
import WorksheetPaperPreview from "./WorksheetPaperPreview";

export default function CartDrawer() {
  const { cart, removeFromCart, totalItems, totalAmount, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-cp-navy/40" onClick={() => setIsCartOpen(false)} />

      <aside className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-line">
          <h2 className="text-lg font-semibold text-cp-navy">
            ตะกร้า <span className="text-muted font-normal">({totalItems})</span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 rounded-lg text-muted hover:text-cp-navy hover:bg-cp-bg cursor-pointer"
            aria-label="ปิดตะกร้า"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2">
              <p className="font-head font-medium text-cp-navy">ยังไม่มีใบงานในตะกร้า</p>
              <p className="text-sm text-muted">เลือกชุดที่ต้องการแล้วกด &ldquo;ใส่ตะกร้า&rdquo;</p>
              <button onClick={() => setIsCartOpen(false)} className="btn-secondary mt-4 cursor-pointer">
                ดูใบงานทั้งหมด
              </button>
            </div>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.product.id} className="flex gap-4 py-5 border-b border-line last:border-0">
                  <div className="w-16 shrink-0 aspect-[210/297]">
                    <WorksheetPaperPreview
                      slug={item.product.slug}
                      title={item.product.title}
                      gradeLevel={item.product.grade_level}
                      subject={item.product.subject}
                      coverImage={item.product.cover_image}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-cp-navy leading-snug line-clamp-2">
                      {item.product.title}
                    </h4>
                    <p className="text-sm text-muted mt-0.5">
                      {item.product.grade_level} · {item.product.page_count} หน้า
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-head font-semibold text-cp-navy">฿{item.product.price}</span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-sm text-muted hover:text-[#c0392b] cursor-pointer"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-line bg-cp-bg space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-muted">รวม</span>
              <span className="font-head text-2xl font-bold text-cp-navy">฿{totalAmount}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary w-full py-3.5"
            >
              ไปชำระเงิน
            </Link>
            <p className="text-xs text-muted text-center">จ่ายผ่านพร้อมเพย์ ได้ไฟล์ทันทีหลังแนบสลิป</p>
          </div>
        )}
      </aside>
    </div>
  );
}
