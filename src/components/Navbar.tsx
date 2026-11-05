"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Search, Download, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = 0; // Will be connected to Cart Context in M3

  return (
    <header className="sticky top-0 z-50 bg-[#082340] text-white shadow-md border-b-2 border-[#F5760A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group py-2">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white p-1 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/icon.png"
                alt="ClassPic Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#B5D5F2] transition-colors leading-none">
                ClassPic
              </span>
              <span className="text-[10px] tracking-widest text-[#B5D5F2] font-medium uppercase mt-0.5">
                Learning & Creative Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-white hover:text-[#B5D5F2] transition-colors"
            >
              หน้าแรก
            </Link>
            <Link
              href="/#catalog"
              className="text-sm font-medium text-white/90 hover:text-[#B5D5F2] transition-colors"
            >
              ใบงานทั้งหมด
            </Link>
            <Link
              href="/downloads"
              className="flex items-center gap-1.5 text-sm font-medium text-[#B5D5F2] hover:text-white transition-colors"
            >
              <Download className="w-4 h-4 text-[#F5760A]" />
              <span>ดาวน์โหลดไฟล์เดิม</span>
            </Link>
          </nav>

          {/* Right Action Icons: Search & Cart */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-[#1C64B8] hover:bg-[#154d8f] text-white px-3.5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 text-[#F5760A]" />
              <span className="hidden sm:inline">ตะกร้า</span>
              <span className="inline-flex items-center justify-center bg-[#F5760A] text-white text-xs font-bold rounded-full h-5 min-w-5 px-1">
                {cartItemCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a2b4e] border-t border-white/10 px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
          >
            หน้าแรก
          </Link>
          <Link
            href="/#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10"
          >
            ใบงานทั้งหมด
          </Link>
          <Link
            href="/downloads"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-[#B5D5F2] hover:bg-white/10"
          >
            <Download className="w-4 h-4 text-[#F5760A]" />
            ดาวน์โหลดไฟล์เดิม (ลูกค้าเก่า)
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm text-white/50 hover:text-white"
          >
            เข้าสู่ระบบแอดมิน
          </Link>
        </div>
      )}
    </header>
  );
}
