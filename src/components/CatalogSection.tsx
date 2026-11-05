"use client";

import { useState, useMemo } from "react";
import { Product, GradeLevel, SubjectCategory } from "@/types";
import ProductCard from "./ProductCard";
import { Search, Filter, RotateCcw, BookOpen } from "lucide-react";

interface CatalogSectionProps {
  products: Product[];
}

const GRADE_FILTERS: Array<{ label: string; value: GradeLevel | "all" }> = [
  { label: "ทุกระดับชั้น", value: "all" },
  { label: "อนุบาล", value: "อนุบาล" },
  { label: "ป.1-ป.3", value: "ป.1-ป.3" },
  { label: "ป.4-ป.6", value: "ป.4-ป.6" },
  { label: "การศึกษาพิเศษ", value: "การศึกษาพิเศษ" },
  { label: "2 ภาษา", value: "2 ภาษา" },
];

const SUBJECT_FILTERS: Array<{ label: string; value: SubjectCategory | "all" }> = [
  { label: "ทุกวิชา", value: "all" },
  { label: "ภาษาอังกฤษ", value: "ภาษาอังกฤษ" },
  { label: "คณิตศาสตร์", value: "คณิตศาสตร์" },
  { label: "ภาษาไทย", value: "ภาษาไทย" },
  { label: "วิทยาศาสตร์", value: "วิทยาศาสตร์" },
  { label: "เชาวน์ปัญญา", value: "เชาวน์ปัญญา" },
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
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 scroll-mt-24">
      {/* Section Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C64B8] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>หมวดหมู่ใบงานคุณภาพ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082340]">
            แคตตาล็อกใบงาน A4 ทั้งหมด
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            ค้นหาและเลือกดูใบงานที่ต้องการ พิมพ์ได้คมชัดทุกแผ่น
          </p>
        </div>

        {/* Search Input Box */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อใบงาน, วิชา, คำสำคัญ..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C64B8] focus:border-transparent transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded-full"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Options */}
      <div className="space-y-4 bg-slate-100/60 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
        {/* Grade Level Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 w-24 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#1C64B8]" />
            ระดับชั้น:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {GRADE_FILTERS.map((item) => {
              const active = selectedGrade === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setSelectedGrade(item.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    active
                      ? "bg-[#082340] text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-white/80 border border-slate-200/80"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-slate-200/60">
          <span className="text-xs font-semibold text-slate-500 w-24 shrink-0">
            กลุ่มวิชา:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUBJECT_FILTERS.map((item) => {
              const active = selectedSubject === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setSelectedSubject(item.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    active
                      ? "bg-[#1C64B8] text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-white/80 border border-slate-200/80"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Status & Reset */}
        {hasActiveFilter && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>
              พบทั้งหมด <strong className="text-[#082340]">{filteredProducts.length}</strong> รายการ
            </span>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[#F5760A] hover:text-[#d96303] font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#B5D5F2]/30 flex items-center justify-center text-[#1C64B8]">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#082340]">ไม่พบชุดใบงานที่ค้นหา</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ลองเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อดูใบงานทั้งหมดในสตูดิโอ
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="bg-[#082340] hover:bg-[#1C64B8] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-2xs"
          >
            แสดงใบงานทั้งหมด
          </button>
        </div>
      )}
    </section>
  );
}
