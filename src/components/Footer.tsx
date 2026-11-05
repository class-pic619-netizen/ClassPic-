import Link from "next/link";
import { Lock, ArrowUpRight } from "lucide-react";
import ClassPicLogo, { ClassPicMark } from "./ClassPicLogo";

export default function Footer() {
  return (
    <footer className="bg-white text-[#082340] border-t-2 border-[#082340] mt-20">
      {/* Architectural Studio Spec Strip */}
      <div className="border-b-2 border-[#082340] bg-[#B5D5F2]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#082340]">
            <div className="py-5 md:pr-6 flex items-start gap-3">
              <span className="font-mono text-xs font-extrabold bg-[#082340] text-white px-2 py-0.5 shrink-0">
                01
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-[#082340]">
                  สเกลกระดาษ A4 มาตรฐานไทย (210 × 297 มม.)
                </h4>
                <p className="text-xs text-[#082340]/75 mt-0.5">
                  จัดระยะขอบกระดาษสำหรับเครื่องพิมพ์ในโรงเรียนและที่บ้าน ไม่ตกขอบ
                </p>
              </div>
            </div>

            <div className="py-5 md:px-6 flex items-start gap-3">
              <span className="font-mono text-xs font-extrabold bg-[#F5760A] text-white px-2 py-0.5 shrink-0">
                02
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-[#082340]">
                  ชำระผ่าน QR PromptPay รับลิงก์ทันที
                </h4>
                <p className="text-xs text-[#082340]/75 mt-0.5">
                  ระบบตรวจสอบรหัสอ้างอิงสลิปธนาคาร ปลดล็อกไฟล์ PDF คมชัด 300 DPI
                </p>
              </div>
            </div>

            <div className="py-5 md:pl-6 flex items-start gap-3">
              <span className="font-mono text-xs font-extrabold bg-[#1C64B8] text-white px-2 py-0.5 shrink-0">
                03
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-[#082340]">
                  ค้นหาและดาวน์โหลดไฟล์ซ้ำได้ตลอด
                </h4>
                <p className="text-xs text-[#082340]/75 mt-0.5">
                  ใช้เพียงเบอร์โทรศัพท์หรืออีเมลที่สั่งซื้อเพื่อเปิดแฟ้มดาวน์โหลดย้อนหลัง
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Identity Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <ClassPicMark className="w-12 h-12 shrink-0" />
              <ClassPicLogo size="md" theme="light" showSubtitle={true} />
            </div>
            <p className="text-sm italic font-semibold text-[#1C64B8]">
              Bright Outside — Clear Inside
            </p>
            <p className="text-xs sm:text-sm text-[#082340]/75 max-w-md leading-relaxed">
              สตูดิโอออกแบบใบงาน แบบฝึกหัดพัฒนาทักษะ และสื่อการสอนดิจิทัลขนาด A4
              สำหรับคุณครูและผู้ปกครอง เน้นความสดใสที่ดึงดูดสายตาเด็กๆ
              ควบคู่กับโครงสร้างเนื้อหาที่ชัดเจนเข้าใจง่าย
            </p>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#082340] uppercase tracking-wider border-b-2 border-[#082340] pb-1.5">
              STUDIO DIRECTORY
            </h4>
            <ul className="space-y-2 text-xs font-bold text-[#082340]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#F5760A] transition-colors flex items-center justify-between"
                >
                  <span>01 — หน้าแรกสตูดิโอ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/#catalog"
                  className="hover:text-[#F5760A] transition-colors flex items-center justify-between"
                >
                  <span>02 — แฟ้มใบงาน A4 ทั้งหมด</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/downloads"
                  className="hover:text-[#1C64B8] transition-colors flex items-center justify-between"
                >
                  <span>03 — ค้นหาไฟล์ที่เคยซื้อ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Admin Access */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#082340] uppercase tracking-wider border-b-2 border-[#082340] pb-1.5">
              STUDIO MANAGEMENT
            </h4>
            <p className="text-xs text-[#082340]/70 leading-relaxed">
              สำหรับเจ้าของร้าน ClassPic เพื่อทยอยอัปโหลดชุดใบงาน A4 ใหม่และตรวจสอบรายการโอนเงิน
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#082340] bg-[#FAFBFD] hover:bg-[#B5D5F2]/35 px-3.5 py-2 border-2 border-[#082340] shadow-[2px_2px_0px_#082340] transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#F5760A]" />
              <span>ADMIN CONSOLE (/admin)</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#082340] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#082340]/70 gap-4">
          <p>© 2026 CLASSPIC LEARNING &amp; CREATIVE STUDIO. ALL RIGHTS RESERVED.</p>
          <p className="text-[#1C64B8] font-bold">
            BRIGHT OUTSIDE — CLEAR INSIDE
          </p>
        </div>
      </div>
    </footer>
  );
}
