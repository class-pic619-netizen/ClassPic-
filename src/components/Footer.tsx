import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Mail, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#082340] text-white border-t border-white/10 mt-20">
      {/* Top Value Badges */}
      <div className="border-b border-white/10 bg-[#061a30] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 rounded-xl bg-[#1C64B8]/20 text-[#F5760A]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">A4 มาตรฐานไทย 100%</h4>
                <p className="text-xs text-[#B5D5F2]">เส้นคมชัด ปริ้นท์ง่าย พอดีกระดาษทุกเครื่อง</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 rounded-xl bg-[#1C64B8]/20 text-[#F5760A]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">รับไฟล์ทันที 24 ชม.</h4>
                <p className="text-xs text-[#B5D5F2]">โอนเงินพร้อมเพย์ รับลิงก์ดาวน์โหลดทันที</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 rounded-xl bg-[#1C64B8]/20 text-[#F5760A]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">มีบริการหลังการขาย</h4>
                <p className="text-xs text-[#B5D5F2]">ไฟล์หาย โหลดไม่ได้ ค้นหาดาวน์โหลดซ้ำได้ตลอด</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm">
                <Image
                  src="/icon.png"
                  alt="ClassPic"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  ClassPic
                </span>
                <p className="text-[10px] tracking-widest text-[#B5D5F2] uppercase">
                  Learning & Creative Studio
                </p>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              <span className="text-[#B5D5F2] italic font-medium">Bright Outside — Clear Inside</span>
              <br />
              แหล่งรวมไฟล์ใบงานสร้างสรรค์ แบบฝึกหัด และสื่อการสอนดิจิทัลขนาด A4 คุณภาพสูงสำหรับคุณครูและผู้ปกครอง
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase border-l-2 border-[#F5760A] pl-2">
              เมนูลัด
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-[#B5D5F2] transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-[#B5D5F2] transition-colors">
                  ใบงานทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-[#B5D5F2] transition-colors">
                  ค้นหาและดาวน์โหลดไฟล์เดิม
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase border-l-2 border-[#1C64B8] pl-2">
              สำหรับผู้ดูแลระบบ
            </h4>
            <p className="text-xs text-white/60">
              จัดการรายการใบงาน ตรวจสอบสลิปโอนเงิน และเพิ่มชุดใบงานใหม่
            </p>
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#F5760A]" />
                ระบบจัดการหลังบ้าน (/admin)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 ClassPic Learning & Creative Studio. สงวนลิขสิทธิ์ทั้งหมด.</p>
          <p className="text-[#B5D5F2]/80">ไฟล์ลิขสิทธิ์สำหรับการศึกษา ไม่อนุญาตให้นำไปจำหน่ายต่อ</p>
        </div>
      </div>
    </footer>
  );
}
