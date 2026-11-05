"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Download, Menu, X, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ClassPicLogo, { ClassPicMark } from "./ClassPicLogo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#082340]">
      {/* Studio Top Spec Ribbon */}
      <div className="bg-[#082340] text-white text-[10px] sm:text-[11px] py-1.5 px-4 border-b border-[#1C64B8]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono tracking-wider uppercase text-[#B5D5F2]">
            <span className="inline-block w-2 h-2 bg-[#F5760A]" />
            <span>BRIGHT OUTSIDE — CLEAR INSIDE</span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline text-white/85">
              A4 THAI PRINT STANDARD (210 × 297 MM • 300 DPI)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-medium">
            <Link
              href="/downloads"
              className="text-[#B5D5F2] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>ค้นหาใบงานที่เคยซื้อ</span>
              <ArrowUpRight className="w-3 h-3 text-[#F5760A]" />
            </Link>
            <span className="text-white/25">|</span>
            <Link
              href="/admin"
              className="text-white/60 hover:text-white transition-colors font-mono"
            >
              STUDIO ADMIN
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bright Studio Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo: Authentic ClassPicMark + ClassPic Wordmark */}
          <Link href="/" className="flex items-center gap-3.5 group py-2">
            <ClassPicMark className="w-11 h-11 shrink-0 transition-transform duration-200 group-hover:-rotate-3" />
            <ClassPicLogo size="md" theme="light" showSubtitle={true} />
          </Link>

          {/* Desktop Editorial Navigation */}
          <nav className="hidden lg:flex items-center gap-1 border-2 border-[#082340] bg-[#F8FAFC] p-1">
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-bold text-[#082340] hover:bg-[#B5D5F2]/40 transition-colors flex items-center gap-1.5"
            >
              <span className="font-mono text-[10px] text-[#1C64B8]">01</span>
              <span>หน้าแรกสตูดิโอ</span>
            </Link>
            <span className="h-4 w-[1px] bg-[#082340]/15" />
            <Link
              href="/#catalog"
              className="px-3.5 py-1.5 text-xs font-bold text-[#082340] hover:bg-[#B5D5F2]/40 transition-colors flex items-center gap-1.5"
            >
              <span className="font-mono text-[10px] text-[#F5760A]">02</span>
              <span>แฟ้มใบงาน A4 ทั้งหมด</span>
            </Link>
            <span className="h-4 w-[1px] bg-[#082340]/15" />
            <Link
              href="/downloads"
              className="px-3.5 py-1.5 text-xs font-bold text-[#082340] hover:bg-[#B5D5F2]/40 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#1C64B8]" />
              <span>โหลดไฟล์เดิมซ้ำ</span>
            </Link>
          </nav>

          {/* Right Tactile Cart Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-[#F5760A] hover:bg-[#e06905] text-white border-2 border-[#082340] px-4 py-2 text-xs sm:text-sm font-extrabold tracking-tight shadow-[3px_3px_0px_#082340] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#082340] active:translate-y-[1px] active:shadow-[1px_1px_0px_#082340] transition-all cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">แฟ้มสั่งซื้อ</span>
              <span className="inline-flex items-center justify-center bg-[#082340] text-white font-mono text-xs font-bold h-5 min-w-5 px-1.5">
                {totalItems}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 border-2 border-[#082340] bg-white text-[#082340] hover:bg-[#B5D5F2]/30 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t-2 border-[#082340] px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 border border-[#082340]/20 text-sm font-bold text-[#082340] hover:bg-[#B5D5F2]/30"
          >
            <span>01 — หน้าแรกสตูดิโอ</span>
            <ArrowUpRight className="w-4 h-4 text-[#1C64B8]" />
          </Link>
          <Link
            href="/#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 border border-[#082340]/20 text-sm font-bold text-[#082340] hover:bg-[#B5D5F2]/30"
          >
            <span>02 — แฟ้มใบงาน A4 ทั้งหมด</span>
            <ArrowUpRight className="w-4 h-4 text-[#F5760A]" />
          </Link>
          <Link
            href="/downloads"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 border border-[#082340]/20 text-sm font-bold text-[#1C64B8] bg-[#B5D5F2]/20"
          >
            <span>03 — ค้นหาและดาวน์โหลดไฟล์เดิม</span>
            <Download className="w-4 h-4 text-[#F5760A]" />
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-mono text-slate-500 hover:text-[#082340]"
          >
            [ADMIN CONSOLE /admin]
          </Link>
        </div>
      )}
    </header>
  );
}
