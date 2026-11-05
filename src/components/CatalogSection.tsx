"use client";

import { useState, useMemo } from "react";
import { Product, GradeLevel, SubjectCategory } from "@/types";
import ProductCard from "./ProductCard";
import { Search, RotateCcw } from "lucide-react";
import { ClassPicSpark } from "./ClassPicLogo";

interface CatalogSectionProps {
  products: Product[];
}

/**
 * ระบบป้ายคั่นแฟ้มสตูดิโอ (Binder Index Tabs) — ไร้ Emoji แบบ AI Template
 */
const GRADE_TABS: Array<{ code: string; label: string; value: GradeLevel | "all" }> = [
  { code: "ALL", label: "แฟ้มทั้งหมด", value: "all" },
  { code: "K-01", label: "อนุบาล / ปฐมวัย", value: "อนุบาล" },
  { code: "P-13", label: "ประถมต้น (ป.1–ป.3)", value: "ป.1-ป.3" },
  { code: "P-46", label: "ประถมปลาย (ป.4–ป.6)", value: "ป.4-ป.6" },
  { code: "SP-ED", label: "การศึกษาพิเศษ", value: "การศึกษาพิเศษ" },
  { code: "BI-2L", label: "สองภาษา (Bilingual)", value: "2 ภาษา" },
];

const SUBJECT_LIST: Array<{ label: string; value: SubjectCategory | "all" }> = [
  { label: "ทุกหมวดวิชา", value: "all" },
  { label: "ภาษาอังกฤษ", value: "ภาษาอังกฤษ" },
  { label: "เชาวน์ปัญญา & EF", value: "เชาวน์ปัญญา" },
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
      if (selectedGrade !== "all" && product.grade_level !== selectedGrade) {
        return false;
      }
      if (selectedSubject !== "all" && product.subject !== selectedSubject) {
        return false;
      }
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

  const hasActiveFilter =
    searchQuery !== "" || selectedGrade !== "all" || selectedSubject !== "all";

  return (
    <section
      id="catalog"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 scroll-mt-24"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#082340] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#1C64B8]">
            <ClassPicSpark className="w-4 h-4" />
            <span>CLASSPIC WORKSHEET ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082340] tracking-tight">
            แฟ้มแคตตาล็อกชุดใบงาน A4
          </h2>
          <p className="text-xs sm:text-sm text-[#082340]/70">
            เลือกเปิดดูตามดัชนีระดับชั้นเรียน หรือกรองตามกลุ่มทักษะที่ต้องการสอน
          </p>
        </div>

        {/* Architectural Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#082340] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อใบงาน, ทักษะ, ระดับชั้น..."
            className="w-full pl-10 pr-8 py-2.5 bg-white border-2 border-[#082340] text-sm font-medium text-[#082340] focus:outline-none focus:bg-[#B5D5F2]/15 shadow-[3px_3px_0px_#B5D5F2] transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#082340] hover:text-[#F5760A] p-1"
            >
              [X]
            </button>
          )}
        </div>
      </div>

      {/* Studio Binder Index Filter Bar */}
      <div className="space-y-4 bg-white border-2 border-[#082340] p-4 sm:p-5 shadow-[4px_4px_0px_#082340]">
        <div className="flex items-center justify-between border-b border-[#082340]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#F5760A] border border-[#082340]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#082340]">
              INDEX 01 — เลือกระดับชั้นเรียน (GRADE LEVEL)
            </span>
          </div>

          {hasActiveFilter && (
            <button
              onClick={resetFilters}
              className="text-xs font-mono font-bold text-[#F5760A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET ({filteredProducts.length})</span>
            </button>
          )}
        </div>

        {/* Binder Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GRADE_TABS.map((tab) => {
            const isActive = selectedGrade === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedGrade(tab.value)}
                className={`text-xs px-3.5 py-2 font-bold shrink-0 transition-all flex items-center gap-2 border-2 cursor-pointer ${
                  isActive
                    ? "bg-[#082340] text-white border-[#082340] shadow-[2px_2px_0px_#F5760A]"
                    : "bg-[#FAFBFD] text-[#082340] border-[#082340]/30 hover:border-[#082340] hover:bg-[#B5D5F2]/25"
                }`}
              >
                <span
                  className={`font-mono text-[10px] px-1 py-0.5 ${
                    isActive
                      ? "bg-[#F5760A] text-white"
                      : "bg-[#B5D5F2]/50 text-[#082340]"
                  }`}
                >
                  {tab.code}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subject Filter Strip */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#082340]/10">
          <span className="text-[11px] font-mono font-bold uppercase text-[#1C64B8] mr-1">
            SUBJECT:
          </span>
          {SUBJECT_LIST.map((sub) => {
            const isActive = selectedSubject === sub.value;
            return (
              <button
                key={sub.value}
                onClick={() => setSelectedSubject(sub.value)}
                className={`text-xs px-3 py-1 transition-all border cursor-pointer ${
                  isActive
                    ? "bg-[#1C64B8] text-white border-[#082340] font-bold"
                    : "bg-white text-[#082340]/80 border-[#082340]/25 hover:border-[#082340] font-medium"
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
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border-2 border-[#082340] shadow-[4px_4px_0px_#B5D5F2] p-8 space-y-4">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#F5760A]">
            [NO MATCHING WORKSHEET FOUND]
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-[#082340]">
              ไม่พบชุดใบงานในหมวดที่เลือก
            </h3>
            <p className="text-xs text-[#082340]/70 max-w-sm mx-auto">
              ลองล้างตัวกรองเพื่อเปิดดูแฟ้มใบงานทั้งหมดในสตูดิโอ ClassPic
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="bg-[#082340] hover:bg-[#1C64B8] text-white text-xs font-bold px-5 py-2.5 border-2 border-[#082340] transition-colors cursor-pointer"
          >
            แสดงใบงานทั้งหมด
          </button>
        </div>
      )}
    </section>
  );
}
