"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { Order } from "@/types";

export default function DownloadsSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-7 py-12 lg:py-16">
      <h1 className="text-[30px] sm:text-[36px] font-bold text-cp-navy">โหลดไฟล์ที่ซื้อแล้ว</h1>
      <p className="text-[17px] text-muted mt-2 mb-8">
        กรอกเบอร์โทรหรืออีเมลที่ใช้ตอนสั่งซื้อ แล้วกดค้นหา
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="เช่น 0812345678 หรือ teacher@school.ac.th"
          className="input-field text-base py-3"
        />
        <button
          type="submit"
          disabled={loading || !searchTerm.trim()}
          className="btn-primary shrink-0 px-8 cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ค้นหา"}
        </button>
      </form>


      {error && (
        <div className="mt-6 rounded-xl bg-[#c0392b]/5 border border-[#c0392b]/20 p-4 text-sm text-[#c0392b] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {hasSearched && !loading && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-cp-navy mb-4">
            พบ {orders.length} คำสั่งซื้อ
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-cp-bg p-8 text-center">
              <p className="font-head font-medium text-cp-navy">ไม่พบคำสั่งซื้อของ &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-sm text-muted mt-1">
                ลองตรวจเบอร์หรืออีเมลอีกครั้ง ถ้าเพิ่งแนบสลิป รอสักครู่แล้วค้นหาใหม่
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => {
                const isPaid = order.status === "PAID" || order.status === "VERIFIED";
                const statusText = isPaid
                  ? "ชำระแล้ว"
                  : order.status === "PENDING_REVIEW"
                    ? "รอตรวจสลิป"
                    : "รอชำระเงิน";
                return (
                  <li key={order.id} className="panel p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="font-head font-semibold text-cp-navy">คำสั่งซื้อ {order.id}</div>
                        <div className="text-sm text-muted">
                          {new Date(order.created_at).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · ฿{order.total_amount.toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                          isPaid ? "bg-[#1b8a4b]/10 text-[#1b8a4b]" : "bg-[#F26C28]/10 text-cp-orange-dark"
                        }`}
                      >
                        {statusText}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-1 text-[15px] text-ink">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.product.title}{" "}
                          <span className="text-sm text-muted">· {item.product.page_count} หน้า</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/downloads/${order.id}`}
                      className={`${isPaid ? "btn-primary" : "btn-secondary"} mt-5 text-sm px-5 py-2.5`}
                    >
                      {isPaid ? "ไปหน้าดาวน์โหลด" : "ดูสถานะ / แนบสลิป"}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <div className="mt-14 pt-8 border-t border-line grid sm:grid-cols-2 gap-6 text-[15px]">
        <div>
          <h3 className="font-semibold text-cp-navy">ไฟล์หายหรือเปลี่ยนเครื่อง</h3>
          <p className="text-muted mt-1">กรอกเบอร์หรืออีเมลเดิม แล้วโหลดใหม่ได้ทุกเมื่อ</p>
        </div>
        <div>
          <h3 className="font-semibold text-cp-navy">ยังหาไม่เจอ</h3>
          <p className="text-muted mt-1">ส่งสลิปมาทาง LINE @classpic เดี๋ยวช่วยหาให้</p>
        </div>
      </div>
    </div>
  );
}
