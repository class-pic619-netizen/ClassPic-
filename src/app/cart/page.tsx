"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalItems, totalAmount } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2856B0] hover:text-[#142E4F] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปเลือกใบงานเพิ่มเติม</span>
          </Link>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-slate-500 hover:text-rose-600 font-medium transition cursor-pointer"
            >
              ล้างตะกร้าทั้งหมด
            </button>
          )}
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142E4F] flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#F26C28]" />
            <span>ตะกร้าสินค้าของคุณ</span>
            <span className="text-sm font-semibold bg-[#AED6F4]/40 text-[#2856B0] px-3 py-1 rounded-full">
              {totalItems} รายการ
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ตรวจเช็กรายการใบงาน A4 คมชัดสูง ก่อนเข้าสู่ขั้นตอนชำระเงินผ่าน PromptPay QR
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-16 text-center shadow-xs">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#142E4F] mb-2">
              ยังไม่มีใบงานในตะกร้า
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              คุณครูและผู้ปกครองสามารถเลือกดูใบงานคุณภาพสำหรับชั้นอนุบาลถึงประถม
              มีทั้งแบบฝึกหัดพร้อมเฉลย และใบงานทดลองใช้ฟรี
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#2856B0] hover:bg-[#142E4F] text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#F26C28]" />
              <span>เลือกดูใบงานทั้งหมด</span>
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center hover:bg-slate-50/50 transition"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 sm:w-28 aspect-[1/1.414] bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs">
                      <Image
                        src={item.product.cover_image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-[#142E4F]/80 text-white px-1.5 py-0.5 rounded">
                        A4
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#AED6F4]/40 text-[#2856B0]">
                          {item.product.grade_level}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {item.product.subject}
                        </span>
                        {item.product.has_answer_key && (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            มีเฉลย
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-base sm:text-lg font-bold text-[#142E4F] hover:text-[#2856B0] transition line-clamp-2"
                      >
                        {item.product.title}
                      </Link>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          {item.product.page_count} หน้า PDF (A4)
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>ดาวน์โหลดดิจิทัล</span>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-black text-[#F26C28]">
                          ฿{item.product.price.toFixed(2)}
                        </div>
                        {item.product.original_price && (
                          <div className="text-xs text-slate-400 line-through">
                            ฿{item.product.original_price.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="sm:mt-3 text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 text-xs"
                        title="ลบออกจากตะกร้า"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sm:hidden font-medium">ลบออก</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notice Banner */}
              <div className="bg-[#AED6F4]/20 border border-[#AED6F4] rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2856B0] shrink-0 mt-0.5" />
                <div className="text-xs text-[#142E4F] leading-relaxed">
                  <strong className="font-bold">จัดส่งทันทีผ่านระบบอัตโนมัติ:</strong>{" "}
                  ไฟล์ใบงาน PDF จะพร้อมให้ดาวน์โหลดทันทีที่ยืนยันการโอนเงิน
                  ไม่จำกัดระยะเวลา สามารถค้นหาและโหลดซ้ำได้ทุกเมื่อ
                </div>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-5">
                <h3 className="text-lg font-bold text-[#142E4F] pb-3 border-b border-slate-100">
                  สรุปคำสั่งซื้อ
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>จำนวนใบงาน</span>
                    <span className="font-semibold text-[#142E4F]">{totalItems} รายการ</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>รูปแบบสินค้า</span>
                    <span className="font-medium text-slate-700">Digital PDF (A4)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-emerald-600 font-semibold">ฟรี (ดาวน์โหลดออนไลน์)</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-bold text-[#142E4F] block">
                        ยอดชำระสุทธิ
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (รวมภาษีมูลค่าเพิ่มแล้วถ้ามี)
                      </span>
                    </div>
                    <span className="text-3xl font-black text-[#F26C28]">
                      ฿{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full bg-[#F26C28] hover:bg-[#d96303] text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group active:scale-98"
                >
                  <span>ไปที่หน้าชำระเงิน</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>สร้าง QR Code พร้อมเพย์ ล็อกยอดเงินเป๊ะๆ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>สแกนจ่ายได้ด้วยทุกแอปธนาคารไทย</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>กรอกเพียงเบอร์โทรหรืออีเมล ไม่ต้องสมัครสมาชิก</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
