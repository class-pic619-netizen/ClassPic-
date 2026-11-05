"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Mail, 
  AlertCircle 
} from "lucide-react";
import { Order } from "@/types";

export default function DownloadsSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (termToSearch?: string) => {
    const term = (termToSearch !== undefined ? termToSearch : searchTerm).trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการค้นหา");
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบค้นหาได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickSearch = (value: string) => {
    setSearchTerm(value);
    startTransition(() => {
      handleSearch(value);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B5D5F2]/40 text-[#082340] text-sm font-medium mb-3 border border-[#B5D5F2]">
            <ShieldCheck className="w-4 h-4 text-[#1C64B8]" />
            ระบบรับไฟล์ใบงานและค้นหาประวัติสั่งซื้อ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#082340] tracking-tight">
            ค้นหาใบงานที่คุณเคยซื้อ
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            กรอกเบอร์โทรศัพท์หรืออีเมลที่ใช้สั่งซื้อ เพื่อรับลิงก์ดาวน์โหลดไฟล์ PDF ขนาด A4 คมชัดสูง ปลดล็อกได้ตลอด 24 ชั่วโมง
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="กรอกเบอร์โทร เช่น 081-234-5678 หรืออีเมลของคุณ"
                className="w-full pl-11 pr-4 py-3.5 text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C64B8] focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-7 py-3.5 bg-[#F5760A] hover:bg-[#e06800] text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shrink-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>ค้นหาใบงาน</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Search Chips */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-[#F5760A]" />
              ทดลองค้นหาตัวอย่าง:
            </span>
            <button
              type="button"
              onClick={() => fillQuickSearch("081-234-5678")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#B5D5F2]/50 text-slate-700 hover:text-[#082340] border border-slate-200 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#1C64B8]" />
              081-234-5678 (ออเดอร์พร้อมโหลด)
            </button>
            <button
              type="button"
              onClick={() => fillQuickSearch("teacher@example.com")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#B5D5F2]/50 text-slate-700 hover:text-[#082340] border border-slate-200 transition-colors"
            >
              <Mail className="w-3 h-3 text-[#1C64B8]" />
              teacher@example.com
            </button>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {hasSearched && !loading && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#082340]">
                ผลการค้นหา ({orders.length} รายการ)
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-700">
                  ไม่พบประวัติการสั่งซื้อสำหรับ &quot;{searchTerm}&quot;
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  โปรดตรวจสอบเบอร์โทรศัพท์หรืออีเมลอีกครั้งว่าพิมพ์ถูกต้องหรือไม่ หรือหากเพิ่งสั่งซื้อและแนบสลิป ระบบอาจกำลังดำเนินการ
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isPaid = order.status === "PAID" || order.status === "VERIFIED";
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all hover:border-[#1C64B8]/40 hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#082340]">
                              #{order.id}
                            </span>
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                ชำระเงินเรียบร้อย
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" />
                                {order.status === "PENDING_REVIEW" ? "รอตรวจสอบสลิป" : "รอการชำระเงิน"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            สั่งซื้อเมื่อ: {new Date(order.created_at).toLocaleString("th-TH")}
                          </p>
                        </div>

                        <div className="text-right sm:text-right flex items-center justify-between sm:block">
                          <span className="text-xs text-slate-500 block">ยอดรวมทั้งสิ้น</span>
                          <span className="text-lg font-extrabold text-[#F5760A]">
                            ฿{order.total_amount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items list summary */}
                      <div className="py-4 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1C64B8]" />
                              <span className="font-medium">{item.product.title}</span>
                              <span className="text-xs text-slate-400">
                                ({item.product.page_count} หน้า A4)
                              </span>
                            </div>
                            <span className="text-slate-500 text-xs">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={`/downloads/${order.id}`}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                            isPaid
                              ? "bg-[#082340] hover:bg-[#1C64B8] text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          {isPaid ? (
                            <>
                              <span>ไปหน้ารับไฟล์ PDF</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>ดูสถานะและแนบสลิป</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Security & FAQ notice */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80">
            <div className="w-10 h-10 rounded-lg bg-[#B5D5F2]/40 flex items-center justify-center text-[#1C64B8] mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#082340] text-sm">ไฟล์แท้ ปลอดภัย 100%</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ไฟล์ PDF A4 จัดเก็บในพื้นที่ส่วนตัว จ่ายผ่านระบบ Signed URL ปลอดภัย ไร้ไวรัสและโฆษณา
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200/80">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#F5760A] mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#082340] text-sm">สัดส่วน A4 มาตรฐานไทย</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ความละเอียดระดับ 300 DPI ออกแบบมาสำหรับปริ้นท์ลงกระดาษ A4 ไม่ล้นขอบ ไม่ตกหล่น
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200/80">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#082340] text-sm">ดาวน์โหลดซ้ำได้ตลอดชีพ</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              หากเปลี่ยนเครื่องหรือไฟล์หาย เพียงกรอกเบอร์โทรหรืออีเมลเดิมเพื่อกลับมารับไฟล์ได้ตลอดเวลา
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
