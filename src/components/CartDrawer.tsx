"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartDrawer() {
  const { cart, removeFromCart, totalItems, totalAmount, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#082340] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F5760A]" />
              <h2 className="text-lg font-bold">ตะกร้าของคุณ ({totalItems} รายการ)</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <ShoppingBag className="w-16 h-16 text-slate-200" />
                <p className="text-base font-medium text-slate-600">ยังไม่มีใบงานในตะกร้า</p>
                <p className="text-xs text-slate-400">เลือกดูใบงานที่ต้องการแล้วกดหยิบใส่ตะกร้าได้เลยครับ</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 bg-[#1C64B8] text-white rounded-xl text-sm font-medium hover:bg-[#154d8f] transition cursor-pointer"
                >
                  เลือกดูใบงานทั้งหมด
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl"
                >
                  <div className="relative w-16 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.cover_image}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#082340] line-clamp-2">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded transition cursor-pointer"
                          title="ลบออกจากตะกร้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.product.grade_level} • {item.product.page_count} หน้า A4
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        PDF ดิจิทัล
                      </span>
                      <span className="text-sm font-bold text-[#F5760A]">
                        ฿{item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>จำนวนใบงาน</span>
                  <span>{totalItems} รายการ</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="text-base font-bold text-[#082340]">ยอดชำระทั้งหมด</span>
                  <span className="text-2xl font-black text-[#F5760A]">
                    ฿{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>สแกนจ่ายพร้อมเพย์ รับลิงก์ดาวน์โหลดทันที 24 ชม.</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#F5760A] hover:bg-[#d96303] text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 active:scale-98"
              >
                <span>ไปที่หน้าชำระเงิน</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
