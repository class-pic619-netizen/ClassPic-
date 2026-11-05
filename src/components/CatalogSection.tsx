"use client";

import { useState, useMemo } from "react";
import { Product, GradeLevel, SubjectCategory } from "@/types";
import ProductCard from "./ProductCard";
import { Search, RotateCcw, SlidersHorizontal, BookOpen } from "lucide-react";

interface CatalogSectionProps {
  products: Product[];
}

const GRADE_TABS: Array<{ label: string; value: GradeLevel | "all"; icon: string }> = [
  { label: "ทั้งหมด", value: "all", icon: "✨" },
  { label: "อนุบาล/ปฐมวัย", value: "อนุบาล", icon: "🎒" },
  { label: "ประถมต้น (ป.1-ป.3)", value: "ป.1-ป.3", icon: "✏️" },
  { label: "ประถมปลาย (ป.4-ป.6)", value: "ป.4-ป.6", icon: "📐" },
  { label: "การศึกษาพิเศษ", value: "การศึกษาพิเศษ", icon: "🌟" },
  { label: "2 ภาษา (Bilingual)", value: "2 ภาษา", icon: "🌏" },
];

const SUBJECT_LIST: Array<{ label: string; value: SubjectCategory | "all" }> = [
  { label: "ทุกวิชา", value: "all" },
  { label: "ภาษาอังกฤษ", value: "ภาษาอังกฤษ" },
  { label: "เชาวน์ปัญญา", value: "เชาวน์ปัญญา" },
  { label: "คณิตศาสตร์", value: "คณิตศาสตร์" },
  { label: "ภาษาไทย", value: "ภาษาไทย" },
  { label: "วิทยาศาสตร์", value: "วิทยาศาสตร์" },
  { label: "ศิลปะและกิจกรรม", value: "ศิลปะและกิจกรรม" },
];

export default function CatalogSection({ products }: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | "all">("all");
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | "all">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Grade filter
      if (selectedGrade !== "all" && product.grade_level !== selectedGrade) {
        return false;
      }
      // Subject filter
      if (selectedSubject !== "all" && product.subject !== selectedSubject) {
        return false;
      }
      // Search keyword filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = product.title.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchTags = product.tags.some((t) => t.toLowerCase().includes(query));
        const matchSubject = product.subject.toLowerCase().includes(query);
        return matchTitle || matchDesc || matchTags || matchSubject;
      }
      return true;
    });
  }, [products, searchQuery, selectedGrade, selectedSubject]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGrade("all");
    setSelectedSubject("all");
  };

  const hasActiveFilter = searchQuery !== "" || selectedGrade !== "all" || selectedSubject !== "all";

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 scroll-mt-20">
      {/* Catalog Header with Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1C64B8] flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ClassPic Collection</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082340]">
            แคตตาล็อกชุดใบงาน A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            เลือกดูตามระดับชั้นหรือวิชาที่ต้องการสอน ทุกชุดมีตัวอย่างให้เปิดดูได้จริง
          </p>
        </div>

        {/* Clean Studio Search Box */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อชุด, วิชา, ระดับชั้น..."
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C64B8] focus:border-transparent transition-all shadow-2xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grade Level Filter: Clean Segmented Tab Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1C64B8]" />
            <span>เลือกระดับชั้นเรียน:</span>
          </span>

          {hasActiveFilter && (
            <button
              onClick={resetFilters}
              className="text-xs font-medium text-[#F5760A] hover:text-[#d96303] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรอง ({filteredProducts.length} รายการ)</span>
            </button>
          )}
        </div>

        {/* Grade tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GRADE_TABS.map((tab) => {
            const isActive = selectedGrade === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedGrade(tab.value)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-[#082340] text-white border-[#082340] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subject filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">วิชา:</span>
          {SUBJECT_LIST.map((sub) => {
            const isActive = selectedSubject === sub.value;
            return (
              <button
                key={sub.value}
                onClick={() => setSelectedSubject(sub.value)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                  isActive
                    ? "bg-[#1C64B8] text-white font-semibold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#082340]">ไม่พบชุดใบงานที่ค้นหา</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ลองเปลี่ยนคำค้นหา หรือกดปุ่มด้านล่างเพื่อแสดงใบงานทั้งหมดในสตูดิโอ
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="bg-[#082340] hover:bg-[#1C64B8] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            แสดงใบงานทั้งหมด
          </button>
        </div>
      )}
    </section>
  );
}
