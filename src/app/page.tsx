import Link from "next/link";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import CatalogSection from "@/components/CatalogSection";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import {
  Download,
  ArrowRight,
  Printer,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function Home() {
  const freeSample = MOCK_PRODUCTS.find((p) => p.is_free_sample);

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Studio Hero Showcase (Crafted, not AI template) */}
      <section className="relative overflow-hidden bg-[#082340] text-white pt-12 pb-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F5760A]">
        {/* Subtle grid pattern background to feel like stationery/paper design */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Studio Headline & Value */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#B5D5F2] text-xs font-medium border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#F5760A]" />
              <span>ClassPic Learning & Creative Studio</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2]">
              ใบงานและแบบฝึกหัดสร้างสรรค์
              <br />
              <span className="text-[#F5760A]">ขนาด A4 มาตรฐานไทย</span>
              <br />
              <span className="text-slate-200 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                เส้นคมกริบ 300 DPI พร้อมปริ้นท์ใช้สอนทันที
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              สเกลหน้ากระดาษตรงตามเครื่องพิมพ์ไทย ไม่มีปัญหาขอบตกหรือภาพแตก
              ดาวน์โหลดเป็นไฟล์ PDF คุณภาพสูง สแกนพร้อมเพย์รับลิงก์ทันที 24 ชม.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#catalog"
                className="bg-[#F5760A] hover:bg-[#d96303] text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <span>เลือกดูใบงานทั้งหมด</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {freeSample && (
                <Link
                  href={`/products/${freeSample.slug}`}
                  className="bg-white/10 hover:bg-white/20 text-[#B5D5F2] hover:text-white border border-white/20 text-sm font-medium px-5 py-3.5 rounded-xl transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#F5760A]" />
                  <span>ทดลองดาวน์โหลดฟรี 2 แผ่น</span>
                </Link>
              )}
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Check className="w-3.5 h-3.5 text-[#B5D5F2] shrink-0" />
                <span>A4 (210×297 มม.)</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Check className="w-3.5 h-3.5 text-[#B5D5F2] shrink-0" />
                <span>มีเฉลยในเล่ม</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Check className="w-3.5 h-3.5 text-[#B5D5F2] shrink-0" />
                <span>โหลดซ้ำได้ตลอดชีพ</span>
              </div>
            </div>
          </div>

          {/* Right Column: Physical A4 Paper Showcase (Real Sheet Look) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[1/1.35]">
              {/* Stack Sheet 3 (Bottom) */}
              <div className="absolute inset-0 translate-x-6 translate-y-6 rotate-4 bg-slate-200/60 rounded-sm shadow-md border border-slate-300/40 pointer-events-none" />

              {/* Stack Sheet 2 (Middle) */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 bg-slate-100 rounded-sm shadow-lg border border-slate-300 pointer-events-none" />

              {/* Main Top Sheet: First Words A4 Worksheet */}
              <div className="relative z-10 w-full h-full rounded-sm shadow-2xl overflow-hidden transform -rotate-1 transition-transform hover:rotate-0 duration-300">
                <WorksheetPaperPreview
                  slug="english-vocab-p1"
                  title="First Words 100 คำศัพท์ ป.1"
                  gradeLevel="ป.1-ป.3"
                  subject="ภาษาอังกฤษ"
                  pageNumber={1}
                  totalPages={25}
                  hasAnswerKey={true}
                />
              </div>

              {/* Floating Quality Seal */}
              <div className="absolute -bottom-4 -left-4 z-20 bg-white text-[#082340] p-2.5 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold block leading-none text-[#082340]">
                    Print Ready
                  </span>
                  <span className="text-[9px] text-slate-500">
                    ขนาด A4 พอดีกระดาษทุกรุ่น
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <CatalogSection products={MOCK_PRODUCTS} />
    </div>
  );
}
