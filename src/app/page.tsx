import Link from "next/link";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import CatalogSection from "@/components/CatalogSection";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import ClassPicLogo, { ClassPicSpark } from "@/components/ClassPicLogo";
import { Download, ArrowRight } from "lucide-react";

export default function Home() {
  const freeSample = MOCK_PRODUCTS.find((p) => p.is_free_sample);

  return (
    <div className="flex flex-col gap-14 pb-24 bg-[#FAFBFD]">
      {/* Bright Outside — Clear Inside: Editorial Studio Showcase */}
      <section className="relative overflow-hidden bg-white border-b-2 border-[#142E4F]">
        {/* Architectural Drafting Grid Background (Sky Blue #AED6F4) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(174, 214, 244, 0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(174, 214, 244, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top Orange Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#142E4F] via-[#2856B0] to-[#F26C28]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brand DNA Typography & Print Spec Matrix */}
            <div className="lg:col-span-7 space-y-7">
              {/* Studio Framing Line (No AI Pill Badge!) */}
              <div className="inline-flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#2856B0]" />
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#142E4F] uppercase">
                  LEARNING &amp; CREATIVE STUDIO
                </span>
                <span className="h-[2px] w-8 bg-[#F26C28]" />
              </div>

              {/* Brand Signature & Editorial Headline */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <ClassPicLogo size="lg" theme="light" showSubtitle={false} />
                  <span className="text-sm sm:text-base italic font-semibold text-[#2856B0] border-l-2 border-[#AED6F4] pl-3">
                    Bright Outside — Clear Inside
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#142E4F] tracking-tight leading-[1.18]">
                  สตูดิโอใบงานและสื่อการสอนดิจิทัล{" "}
                  <span className="inline-block bg-[#AED6F4]/55 px-2.5 py-0.5 border-b-4 border-[#F26C28]">
                    ขนาด A4 มาตรฐานไทย
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[#142E4F]/80 max-w-xl leading-relaxed font-normal">
                  ออกแบบโครงสร้างหน้ากระดาษให้โปร่ง สดใส น่าเรียนรู้ภายนอก (
                  <strong className="text-[#F26C28] font-semibold">Bright Outside</strong>)
                  และจัดลำดับเนื้อหาชัดเจน เข้าใจง่ายภายใน (
                  <strong className="text-[#2856B0] font-semibold">Clear Inside</strong>)
                  เส้นคมกริบ 300 DPI พิมพ์ออกเครื่องปริ้นท์ไทยได้ทันทีโดยไม่ตกขอบ
                </p>
              </div>

              {/* Tactile Studio Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#catalog"
                  className="bg-[#F26C28] hover:bg-[#e06905] text-white text-sm font-extrabold px-6 py-3.5 border-2 border-[#142E4F] shadow-[4px_4px_0px_#142E4F] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#142E4F] active:translate-y-[1px] active:shadow-[2px_2px_0px_#142E4F] transition-all flex items-center gap-2.5"
                >
                  <span>เปิดแฟ้มใบงานทั้งหมด</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>

                {freeSample && (
                  <Link
                    href={`/products/${freeSample.slug}`}
                    className="bg-white hover:bg-[#AED6F4]/25 text-[#142E4F] text-sm font-bold px-5 py-3.5 border-2 border-[#142E4F] shadow-[4px_4px_0px_#AED6F4] hover:shadow-[4px_4px_0px_#2856B0] transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#F26C28] stroke-[2.5]" />
                    <span>รับชุดทดลองพิมพ์ฟรี (A4)</span>
                  </Link>
                )}
              </div>

              {/* Architectural Spec Strip (Replaces generic AI checkmarks) */}
              <div className="pt-2">
                <div className="grid grid-cols-3 border-2 border-[#142E4F] bg-white divide-x-2 divide-[#142E4F]">
                  <div className="p-3">
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#2856B0]">
                      PAPER FORMAT
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#142E4F] mt-0.5 block">
                      A4 (210 × 297 มม.)
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#F26C28]">
                      PRINT MASTER
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#142E4F] mt-0.5 block">
                      PDF 300 DPI + เฉลย
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#2856B0]">
                      INSTANT ACCESS
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#142E4F] mt-0.5 block">
                      PromptPay รับไฟล์ทันที
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Studio Drafting Mat & Physical A4 Sheet */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[390px]">
                {/* Studio Cutting Mat Frame (#142E4F Navy Board with Sky Blue Grid) */}
                <div className="relative bg-[#142E4F] border-2 border-[#142E4F] p-5 sm:p-6 shadow-[8px_8px_0px_#AED6F4]">
                  {/* Top Studio Board Ruler Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#AED6F4] pb-3 mb-3 border-b border-white/15">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <ClassPicSpark className="w-3.5 h-3.5" />
                      <span>STUDIO PROOF BOARD</span>
                    </span>
                    <span>SCALE 1:1 (A4)</span>
                  </div>

                  {/* A4 Sheet Stack on the Board */}
                  <div className="relative w-full aspect-[1/1.36]">
                    {/* Bottom Backing Sheet */}
                    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#AED6F4] border-2 border-[#142E4F] pointer-events-none" />

                    {/* Main Top A4 Sheet */}
                    <div className="relative z-10 w-full h-full bg-white shadow-lg">
                      <WorksheetPaperPreview
                        slug="english-vocab-p1"
                        title="First Words 100 คำศัพท์พื้นฐาน ป.1"
                        gradeLevel="ป.1-ป.3"
                        subject="ภาษาอังกฤษ"
                        pageNumber={1}
                        totalPages={25}
                        hasAnswerKey={true}
                      />
                    </div>
                  </div>

                  {/* Bottom Studio Stamp Bar */}
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#AED6F4]">
                       EDITION: <strong className="text-white">THAI CURRICULUM</strong>
                    </span>
                    <span className="bg-[#F26C28] text-white font-mono text-[10px] font-bold px-2 py-0.5">
                      READY TO PRINT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Binder Filter Section */}
      <CatalogSection products={MOCK_PRODUCTS} />
    </div>
  );
}
