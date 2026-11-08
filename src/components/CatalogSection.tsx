"use client";

import { useState, useMemo } from "react";
import { Product, GradeLevel, SubjectCategory } from "@/types";
import ProductCard from "./ProductCard";
import { Search, X } from "lucide-react";
import BrandIcon from "@/components/BrandIcon";

interface CatalogSectionProps {
  products: Product[];
}

const GRADE_TABS: Array<{ label: string; value: GradeLevel | "all" }> = [
  { label: "ทั้งหมด", value: "all" },
  { label: "อนุบาล", value: "อนุบาล" },
  { label: "ป.1–3", value: "ป.1-ป.3" },
  { label: "ป.4–6", value: "ป.4-ป.6" },
  { label: "การศึกษาพิเศษ", value: "การศึกษาพิเศษ" },
  { label: "2 ภาษา", value: "2 ภาษา" },
];

const SUBJECT_LIST: Array<{ label: string; value: SubjectCategory | "all" }> = [
  { label: "ทุกวิชา", value: "all" },
  { label: "ภาษาอังกฤษ", value: "ภาษาอังกฤษ" },
  { label: "เชาวน์ปัญญา", value: "เชาวน์ปัญญา" },
  { label: "คณิตศาสตร์", value: "คณิตศาสตร์" },
  { label: "ภาษาไทย", value: "ภาษาไทย" },
  { label: "วิทยาศาสตร์", value: "วิทยาศาสตร์" },
  { label: "ศิลปะ", value: "ศิลปะและกิจกรรม" },
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

  const countFor = (grade: GradeLevel | "all") =>
    grade === "all" ? products.length : products.filter((p) => p.grade_level === grade).length;

  return (
    <section id="catalog" className="max-w-6xl mx-auto px-5 sm:px-7 w-full pt-6 pb-20 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h2 className="text-[28px] sm:text-[30px] font-semibold text-cp-navy">ใบงานทั้งหมด</h2>
        <div className="relative w-full sm:w-[300px]">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหา เช่น บวกเลข, คำศัพท์"
            className="input-field pl-10 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-cp-navy cursor-pointer"
              aria-label="ล้างคำค้นหา"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* แท็บระดับชั้น */}
      <div className="flex items-center gap-7 border-b border-line overflow-x-auto font-head text-[15px] font-medium">
        <BrandIcon name="graduation-cap" className="w-6 h-6 -mr-3" />
        {GRADE_TABS.map((tab) => {
          const active = selectedGrade === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedGrade(tab.value)}
              className={`shrink-0 py-3 -mb-px border-b-2 transition-colors cursor-pointer ${
                active ? "text-cp-navy border-cp-navy" : "text-muted border-transparent hover:text-cp-navy"
              }`}
            >
              {tab.label}
              <small className="ml-1 font-normal text-[#9aa6b2]">{countFor(tab.value)}</small>
            </button>
          );
        })}
      </div>

      {/* วิชา */}
      <div className="flex flex-wrap gap-2 mt-4 mb-9">
        {SUBJECT_LIST.map((sub) => {
          const active = selectedSubject === sub.value;
          return (
            <button
              key={sub.value}
              onClick={() => setSelectedSubject(sub.value)}
              className={`text-sm px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                active ? "bg-cp-sky text-cp-navy font-semibold" : "bg-cp-bg text-muted hover:text-cp-navy"
              }`}
            >
              {sub.label}
            </button>
          );
        })}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-11">
          {filteredProducts.map((product) => (
            <div key={product.id} id={product.is_free_sample ? "free" : undefined} className="flex scroll-mt-24">
              <div className="w-full flex">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl bg-cp-bg">
          <BrandIcon name="book-reading" className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-cp-navy">ยังไม่มีใบงานที่ตรงกับที่เลือก</h3>
          <p className="text-muted mt-1 mb-5">ลองเปลี่ยนชั้นหรือวิชา หรือค้นหาด้วยคำอื่น</p>
          {hasActiveFilter && (
            <button onClick={resetFilters} className="btn-secondary cursor-pointer">
              ดูใบงานทั้งหมด
            </button>
          )}
        </div>
      )}
    </section>
  );
}
