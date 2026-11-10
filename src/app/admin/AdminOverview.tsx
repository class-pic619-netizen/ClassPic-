"use client";

import { useMemo } from "react";
import { ArrowRight, Clock, FileCheck2, Package, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import type { Order, Product } from "@/types";

const isPaid = (o: Order) => o.status === "PAID" || o.status === "VERIFIED";
const baht = (n: number) => `฿${n.toLocaleString("th-TH")}`;

const STATUS_LABEL: Record<Order["status"], { text: string; tone: string }> = {
  PENDING: { text: "ยังไม่แนบสลิป", tone: "text-slate-400" },
  PENDING_REVIEW: { text: "รอตรวจสลิป", tone: "text-[#F26C28]" },
  PAID: { text: "ชำระแล้ว", tone: "text-emerald-400" },
  VERIFIED: { text: "ชำระแล้ว", tone: "text-emerald-400" },
  REJECTED: { text: "ปฏิเสธ", tone: "text-rose-400" },
  FAILED: { text: "ไม่สำเร็จ", tone: "text-rose-400" },
};

/** วงแหวนเปอร์เซ็นต์ (SVG ล้วน ไม่ต้องใช้ไลบรารีกราฟ) */
export function Ring({ percent, color, size = 120, children }: { percent: number; color: string; size?: number; children?: React.ReactNode }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(174,214,244,0.12)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(p / 100) * c} ${c}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: "stroke-dasharray .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

function Card({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`cp-glass rounded-2xl p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-white">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Kpi({
  icon,
  label,
  value,
  note,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  accent: string;
}) {
  return (
    <div className="cp-glass rounded-2xl p-4 sm:p-5 flex items-start gap-3">
      <div
        className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
        style={{ background: `${accent}22`, color: accent, boxShadow: `0 0 18px ${accent}33` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-2xl sm:text-[28px] font-extrabold text-white leading-tight font-head">{value}</p>
        <p className="text-[11px] mt-0.5" style={{ color: accent }}>
          {note}
        </p>
      </div>
    </div>
  );
}

export default function AdminOverview({
  orders,
  products,
  onGo,
  onOpenSlip,
}: {
  orders: Order[];
  products: Product[];
  onGo: (tab: "orders" | "products" | "new_product") => void;
  onOpenSlip: (order: Order) => void;
}) {
  const stats = useMemo(() => {
    const paid = orders.filter(isPaid);
    const revenue = paid.reduce((s, o) => s + o.total_amount, 0);
    const reviewing = orders.filter((o) => o.status === "PENDING_REVIEW");
    const today = new Date().toDateString();
    const todayRevenue = paid
      .filter((o) => new Date(o.paid_at || o.created_at).toDateString() === today)
      .reduce((s, o) => s + o.total_amount, 0);

    // ยอดขาย 14 วันล่าสุด
    const days: { label: string; total: number; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const dayOrders = paid.filter((o) => new Date(o.paid_at || o.created_at).toDateString() === key);
      days.push({
        label: d.toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
        total: dayOrders.reduce((s, o) => s + o.total_amount, 0),
        count: dayOrders.length,
      });
    }

    // ยอดขายแยกวิชา
    const bySubject = new Map<string, number>();
    for (const o of paid) {
      for (const it of o.items) {
        bySubject.set(it.product.subject, (bySubject.get(it.product.subject) ?? 0) + it.product.price * it.quantity);
      }
    }
    const subjects = Array.from(bySubject, ([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);

    // ขายดี
    const byProduct = new Map<string, { title: string; count: number }>();
    for (const o of paid) {
      for (const it of o.items) {
        const cur = byProduct.get(it.product.id) ?? { title: it.product.title, count: 0 };
        cur.count += it.quantity;
        byProduct.set(it.product.id, cur);
      }
    }
    const topProducts = Array.from(byProduct.values()).sort((a, b) => b.count - a.count).slice(0, 4);

    const withPdf = products.filter((p) => p.pdf_file_url).length;
    const decided = orders.filter((o) => o.status !== "PENDING").length;

    return {
      paid,
      revenue,
      reviewing,
      todayRevenue,
      days,
      subjects,
      topProducts,
      withPdf,
      paidRate: decided ? Math.round((paid.length / decided) * 100) : 0,
      pdfRate: products.length ? Math.round((withPdf / products.length) * 100) : 0,
    };
  }, [orders, products]);

  const maxDay = Math.max(1, ...stats.days.map((d) => d.total));
  const maxSubject = Math.max(1, ...stats.subjects.map((s) => s.total));
  const subjectColors = ["#F26C28", "#AED6F4", "#5B8DEF", "#7FD1C7", "#2856B0", "#C9B6F2"];

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Kpi icon={<Wallet className="w-5 h-5" />} label="ยอดขายรวม" value={baht(stats.revenue)} note={`วันนี้ ${baht(stats.todayRevenue)}`} accent="#7FD1C7" />
        <Kpi
          icon={<Clock className="w-5 h-5" />}
          label="รอตรวจสลิป"
          value={String(stats.reviewing.length)}
          note={stats.reviewing.length ? "กดอนุมัติเพื่อปลดล็อกไฟล์" : "ไม่มีค้าง"}
          accent="#F26C28"
        />
        <Kpi icon={<ReceiptText className="w-5 h-5" />} label="ออเดอร์ทั้งหมด" value={String(orders.length)} note={`ชำระแล้ว ${stats.paid.length}`} accent="#AED6F4" />
        <Kpi icon={<Package className="w-5 h-5" />} label="ใบงานในร้าน" value={String(products.length)} note={`มีไฟล์ PDF จริง ${stats.withPdf}`} accent="#5B8DEF" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* ยอดขายรายวัน */}
        <Card title="ยอดขาย 14 วันล่าสุด" className="lg:col-span-2" action={<TrendingUp className="w-4 h-4 text-[#7FD1C7]" />}>
          <div className="flex items-end gap-1.5 sm:gap-2 h-40">
            {stats.days.map((d, i) => {
              const h = d.total ? Math.max(6, (d.total / maxDay) * 100) : 3;
              const isToday = i === stats.days.length - 1;
              return (
                <div key={d.label} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                  <span className="absolute -top-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.total ? baht(d.total) : ""}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${h}%`,
                      background: isToday
                        ? "linear-gradient(to top, #F26C28, #FF9A5C)"
                        : d.total
                          ? "linear-gradient(to top, #2856B0, #6FC3F2)"
                          : "rgba(174,214,244,0.12)",
                      boxShadow: d.total ? `0 0 12px ${isToday ? "#F26C2866" : "#6FC3F255"}` : undefined,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2">
            <span>{stats.days[0]?.label}</span>
            <span>{stats.days[7]?.label}</span>
            <span>วันนี้</span>
          </div>
        </Card>

        {/* อัตราชำระ + ความพร้อมไฟล์ */}
        <Card title="ความพร้อมร้าน">
          <div className="flex items-center gap-4">
            <Ring percent={stats.pdfRate} color="#7FD1C7" size={104}>
              <span className="text-2xl font-extrabold text-white font-head">{stats.pdfRate}%</span>
            </Ring>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#7FD1C7]" /> ใบงานมี PDF จริง
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {stats.withPdf} / {products.length} ชุด
              </p>
              {stats.withPdf < products.length && (
                <button onClick={() => onGo("products")} className="text-xs text-[#AED6F4] mt-2 inline-flex items-center gap-1 hover:underline">
                  แนบไฟล์ที่เหลือ <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <div className="h-px bg-white/10 my-4" />
          <div className="flex items-center gap-4">
            <Ring percent={stats.paidRate} color="#5B8DEF" size={104}>
              <span className="text-2xl font-extrabold text-white font-head">{stats.paidRate}%</span>
            </Ring>
            <div>
              <p className="text-sm font-bold text-white">ออเดอร์ที่จ่ายสำเร็จ</p>
              <p className="text-xs text-slate-400 mt-1">นับเฉพาะออเดอร์ที่แนบสลิปแล้ว</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* รอตรวจสลิป */}
        <Card
          title="รอตรวจสลิป"
          action={
            <button onClick={() => onGo("orders")} className="text-xs text-[#AED6F4] hover:underline">
              ดูทั้งหมด
            </button>
          }
        >
          {stats.reviewing.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">ไม่มีสลิปค้างตรวจ</p>
          ) : (
            <ul className="space-y-2">
              {stats.reviewing.slice(0, 5).map((o) => (
                <li key={o.id}>
                  <button
                    onClick={() => onOpenSlip(o)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#F26C28]/10 border border-[#F26C28]/30 hover:bg-[#F26C28]/20 text-left transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#F26C28] shadow-[0_0_8px_#F26C28]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-white truncate">{o.id}</p>
                      <p className="text-[11px] text-slate-400 truncate">{o.customer_contact}</p>
                    </div>
                    <span className="text-sm font-bold text-[#F26C28]">{baht(o.total_amount)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* ยอดขายแยกวิชา */}
        <Card title="ยอดขายแยกตามวิชา">
          {stats.subjects.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">ยังไม่มียอดขาย</p>
          ) : (
            <ul className="space-y-3">
              {stats.subjects.map((s, i) => (
                <li key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{s.name}</span>
                    <span className="text-white font-semibold">{baht(s.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s.total / maxSubject) * 100}%`,
                        background: subjectColors[i % subjectColors.length],
                        boxShadow: `0 0 10px ${subjectColors[i % subjectColors.length]}88`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* ออเดอร์ล่าสุด */}
        <Card
          title="ออเดอร์ล่าสุด"
          action={
            <button onClick={() => onGo("orders")} className="text-xs text-[#AED6F4] hover:underline">
              ดูทั้งหมด
            </button>
          }
        >
          {orders.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">ยังไม่มีออเดอร์</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {orders.slice(0, 5).map((o) => {
                const st = STATUS_LABEL[o.status];
                return (
                  <li key={o.id} className="py-2.5 flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 w-12 shrink-0">
                      {new Date(o.created_at).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white truncate">{o.items.map((it) => it.product.title).join(", ")}</p>
                      <p className={`text-[11px] ${st.tone}`}>{st.text}</p>
                    </div>
                    <span className="text-sm font-semibold text-white">{baht(o.total_amount)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {stats.topProducts.length > 0 && (
        <Card title="ใบงานขายดี">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.topProducts.map((p, i) => (
              <div key={p.title} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="w-8 h-8 rounded-lg grid place-items-center text-sm font-extrabold bg-[#2856B0]/40 text-[#AED6F4] font-head">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-white line-clamp-2">{p.title}</p>
                  <p className="text-[11px] text-slate-400">ขายได้ {p.count} ชุด</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
