"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  RefreshCw,
  Settings,
  ShoppingCart,
  Store,
} from "lucide-react";

export type AdminTab = "overview" | "orders" | "products" | "new_product" | "telegram" | "deploy";

const NAV: { id: AdminTab; label: string; short: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "ภาพรวม", short: "ภาพรวม", icon: LayoutDashboard },
  { id: "orders", label: "ออเดอร์ & ตรวจสลิป", short: "ออเดอร์", icon: ShoppingCart },
  { id: "products", label: "ใบงานทั้งหมด", short: "ใบงาน", icon: Package },
  { id: "new_product", label: "เพิ่มใบงานใหม่", short: "เพิ่ม", icon: PlusCircle },
  { id: "telegram", label: "ตั้งค่า & ความปลอดภัย", short: "ตั้งค่า", icon: Settings },
  { id: "deploy", label: "คู่มือขึ้นออนไลน์", short: "คู่มือ", icon: BookOpen },
];

const TITLES: Record<AdminTab, string> = {
  overview: "ภาพรวมร้าน",
  orders: "ออเดอร์ & ตรวจสลิป",
  products: "ใบงานทั้งหมด",
  new_product: "เพิ่มใบงานชุดใหม่",
  telegram: "ตั้งค่า & ความปลอดภัย",
  deploy: "คู่มือขึ้นออนไลน์",
};

function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-xl bg-[#2856B0] font-head font-black text-white shadow-[0_0_16px_rgba(40,86,176,0.6)] shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      C<span className="text-[#F26C28]">P</span>
    </span>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  if (!now) return null;
  return (
    <div className="hidden sm:block cp-glass rounded-xl px-3.5 py-2 text-right">
      <p className="text-[11px] text-slate-400">
        {now.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
      </p>
      <p className="text-sm font-bold text-white font-head">
        {now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
      </p>
    </div>
  );
}

export default function AdminShell({
  active,
  onChange,
  pendingCount,
  loading,
  onRefresh,
  onLogout,
  children,
}: {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  pendingCount: number;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-dark min-h-screen">
      {/* แถบซ้าย (จอใหญ่) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col gap-2 p-4 border-r border-white/10 bg-[#0A1830]/80 backdrop-blur z-40">
        <Link href="/" className="flex items-center gap-2 px-2 py-3 mb-2">
          <BrandMark />
          <div>
            <p className="text-white font-extrabold font-head leading-none">ClassPic</p>
            <p className="text-[11px] text-slate-400">หลังบ้านร้าน</p>
          </div>
        </Link>
        {NAV.map((n) => {
          const on = active === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onChange(n.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                on
                  ? "bg-gradient-to-r from-[#2856B0] to-[#2856B0]/40 text-white shadow-[0_0_18px_rgba(40,86,176,0.55)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <n.icon className="w-[18px] h-[18px]" />
              <span className="flex-1">{n.label}</span>
              {n.id === "orders" && pendingCount > 0 && (
                <span className="bg-[#F26C28] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
          );
        })}
        <div className="mt-auto space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5">
            <Store className="w-[18px] h-[18px]" /> ดูหน้าร้าน
          </Link>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-300 hover:bg-rose-500/10">
            <LogOut className="w-[18px] h-[18px]" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <div className="lg:pl-60">
        {/* หัวหน้า */}
        <header className="sticky top-0 z-30 bg-[#08142A]/85 backdrop-blur border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <span className="lg:hidden"><BrandMark size={32} /></span>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-extrabold text-white truncate">{TITLES[active]}</h1>
              <p className="text-[11px] sm:text-xs text-[#AED6F4]/80 truncate">ClassPic · ใบงาน A4 พร้อมพิมพ์</p>
            </div>
            <Clock />
            <button
              onClick={() => onChange("orders")}
              className="relative w-10 h-10 grid place-items-center rounded-xl cp-glass text-slate-200 hover:text-white"
              aria-label="สลิปรอตรวจ"
            >
              <Bell className="w-[18px] h-[18px]" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#F26C28] text-white text-[10px] font-bold grid place-items-center shadow-[0_0_10px_#F26C28]">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={onRefresh}
              className="w-10 h-10 grid place-items-center rounded-xl cp-glass text-slate-200 hover:text-white"
              aria-label="รีเฟรช"
            >
              <RefreshCw className={`w-[18px] h-[18px] ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onLogout}
              className="lg:hidden w-10 h-10 grid place-items-center rounded-xl cp-glass text-rose-300"
              aria-label="ออกจากระบบ"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 pb-28 lg:pb-10">{children}</main>
      </div>

      {/* แถบล่าง (มือถือ) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A1830]/95 backdrop-blur border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-6">
          {NAV.map((n) => {
            const on = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onChange(n.id)}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold ${on ? "text-white" : "text-slate-500"}`}
              >
                {on && <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-[#AED6F4] shadow-[0_0_8px_#AED6F4]" />}
                <n.icon className={`w-5 h-5 ${on ? "text-[#AED6F4]" : ""}`} />
                {n.short}
                {n.id === "orders" && pendingCount > 0 && (
                  <span className="absolute top-1.5 right-[22%] w-2 h-2 rounded-full bg-[#F26C28]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
