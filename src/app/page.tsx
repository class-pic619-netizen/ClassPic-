import Image from "next/image";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { Sparkles, FileText, CheckCircle, ArrowRight, ShoppingCart, Eye } from "lucide-react";

export default function Home() {
  const freeSample = MOCK_PRODUCTS.find((p) => p.is_free_sample);
  const paidProducts = MOCK_PRODUCTS.filter((p) => !p.is_free_sample);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#082340] to-[#0c3158] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F5760A]">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#1C64B8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F5760A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#1C64B8]/30 border border-[#B5D5F2]/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#B5D5F2] backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#F5760A]" />
            <span>ClassPic Studio — Bright Outside, Clear Inside</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            ใบงานสร้างสรรค์ ขนาด <span className="text-[#F5760A]">A4 มาตรฐานไทย</span>
            <br />
            <span className="text-[#B5D5F2]">ปริ้นท์คมชัด พร้อมใช้สอนทันที</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed font-light">
            ออกแบบตรงตามหลักสูตรเพื่อคุณครูและผู้ปกครอง ไม่ต้องเสียเวลาจัดหน้ากระดาษเอง
            สแกนจ่ายพร้อมเพย์ รับลิงก์ดาวน์โหลดไฟล์ PDF คุณภาพสูงทันที 24 ชม.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="#catalog"
              className="bg-[#F5760A] hover:bg-[#d96303] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-95"
            >
              <span>ดูใบงานทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {freeSample && (
              <Link
                href={`/products/${freeSample.slug}`}
                className="bg-white/10 hover:bg-white/20 text-[#B5D5F2] hover:text-white border border-[#B5D5F2]/40 font-medium px-5 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <span>🎁 ดาวน์โหลดตัวอย่างฟรี 2 แผ่น</span>
              </Link>
            )}
          </div>

          {/* Quick trust bullet points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/70">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#B5D5F2]" />
              <span>ขนาด A4 เป๊ะ ไม่มีขอบตก</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#B5D5F2]" />
              <span>ภาพเวกเตอร์คมกริบ 300 DPI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#B5D5F2]" />
              <span>ดาวน์โหลดซ้ำได้ตลอดชีพ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#082340]">
              ชุดใบงานแนะนำยอดนิยม
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              เลือกซื้อชุดใบงานและแบบฝึกหัดที่ตรงกับระดับชั้นของนักเรียน
            </p>
          </div>

          {/* Category Filter Pills (Preview for M2) */}
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <button className="bg-[#082340] text-white px-3.5 py-1.5 rounded-lg">ทั้งหมด</button>
            <button className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg">อนุบาล</button>
            <button className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg">ป.1-ป.3</button>
            <button className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg">ป.4-ป.6</button>
            <button className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg">การศึกษาพิเศษ</button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paidProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image Preview with Badges */}
                <div className="relative aspect-[4/3] bg-[#B5D5F2]/20 overflow-hidden">
                  <Image
                    src={product.cover_image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Grade Badge */}
                  <div className="absolute top-3 left-3 bg-[#082340]/90 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                    {product.grade_level}
                  </div>
                  {/* Watermark notice */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white/90 text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    ClassPic Studio
                  </div>
                  {product.is_coming_soon && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-[#F5760A] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
                        เร็วๆ นี้ (Coming Soon)
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#1C64B8]">
                    <span className="bg-[#B5D5F2]/40 px-2 py-0.5 rounded text-[#082340]">
                      {product.subject}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <FileText className="w-3.5 h-3.5" />
                      {product.page_count} หน้า A4
                    </span>
                    {product.has_answer_key && (
                      <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        ✓ มีเฉลย
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#082340] line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Price and Action Button */}
              <div className="p-5 pt-0 mt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-[#F5760A]">฿{product.price}</span>
                    {product.original_price && (
                      <span className="text-xs text-slate-400 line-through">
                        ฿{product.original_price}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">ไฟล์ PDF ขนาด A4</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="p-2 text-slate-600 hover:text-[#1C64B8] hover:bg-slate-100 rounded-lg transition-colors"
                    title="ดูตัวอย่าง"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  {product.is_coming_soon ? (
                    <button
                      disabled
                      className="bg-slate-200 text-slate-400 text-xs font-semibold px-3 py-2 rounded-xl cursor-not-allowed"
                    >
                      เร็วๆ นี้
                    </button>
                  ) : (
                    <button
                      className="bg-[#F5760A] hover:bg-[#d96303] text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>ซื้อ</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
