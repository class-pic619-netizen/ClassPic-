import Link from "next/link";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import CatalogSection from "@/components/CatalogSection";
import { Sparkles, CheckCircle, ArrowRight, Download } from "lucide-react";

export default function Home() {
  const freeSample = MOCK_PRODUCTS.find((p) => p.is_free_sample);

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#082340] to-[#0d3663] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F5760A]">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1C64B8]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F5760A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Studio Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1C64B8]/30 border border-[#B5D5F2]/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#B5D5F2] backdrop-blur-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F5760A]" />
            <span>ClassPic Studio — Bright Outside, Clear Inside</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            ใบงานสร้างสรรค์ ขนาด <span className="text-[#F5760A]">A4 มาตรฐานไทย</span>
            <br />
            <span className="text-[#B5D5F2]">ปริ้นท์คมชัด พร้อมใช้สอนทันที</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed font-light">
            ออกแบบตรงตามหลักสูตรการศึกษาไทย สำหรับคุณครูและผู้ปกครอง ไม่ต้องเสียเวลาจัดหน้าใหม่
            สแกนจ่ายพร้อมเพย์ รับลิงก์ดาวน์โหลดไฟล์ PDF คุณภาพสูงทันที 24 ชม.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#catalog"
              className="bg-[#F5760A] hover:bg-[#d96303] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-95"
            >
              <span>เลือกดูใบงานทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {freeSample && (
              <Link
                href={`/products/${freeSample.slug}`}
                className="bg-white/10 hover:bg-white/20 text-[#B5D5F2] hover:text-white border border-[#B5D5F2]/40 font-medium px-5 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-xs"
              >
                <Download className="w-4 h-4 text-[#F5760A]" />
                <span>ดาวน์โหลดใบงานตัวอย่างฟรี 2 แผ่น</span>
              </Link>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/70 border-t border-white/10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B5D5F2]" />
              <span>ขนาด A4 เป๊ะ ไม่มีตัดตกขอบ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B5D5F2]" />
              <span>ความละเอียดคมชัด 300 DPI</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B5D5F2]" />
              <span>ค้นหาและดาวน์โหลดซ้ำได้ตลอดชีพ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <CatalogSection products={MOCK_PRODUCTS} />
    </div>
  );
}
