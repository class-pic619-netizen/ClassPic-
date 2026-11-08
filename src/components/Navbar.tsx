"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/#catalog", label: "ใบงานทั้งหมด" },
  { href: "/#free", label: "ชุดฟรี" },
  { href: "/downloads", label: "โหลดไฟล์ที่ซื้อแล้ว" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-7">
        <div className="flex items-center gap-10 h-[72px]">
          <Link href="/" aria-label="ClassPic หน้าแรก" className="shrink-0">
            <Image
              src="/logo-wordmark.png"
              alt="ClassPic"
              width={800}
              height={167}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7 font-head text-[15px] font-medium">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/downloads" && pathname.startsWith("/downloads");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    active ? "text-cp-navy" : "text-muted hover:text-cp-navy"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-head text-[15px] font-medium text-cp-navy hover:bg-cp-bg transition-colors cursor-pointer"
              aria-label="เปิดตะกร้า"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
              <span className="hidden sm:inline">ตะกร้า</span>
              <span
                className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold grid place-items-center ${
                  totalItems > 0 ? "bg-cp-orange text-white" : "bg-cp-navy text-white"
                }`}
              >
                {totalItems}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-cp-navy hover:bg-cp-bg cursor-pointer"
              aria-label="เมนู"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-line bg-white px-5 py-3 font-head">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 text-[16px] font-medium text-cp-navy border-b border-line last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
