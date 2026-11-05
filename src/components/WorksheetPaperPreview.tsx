"use client";

import React from "react";
import Image from "next/image";
import WatermarkOverlay from "./WatermarkOverlay";

interface WorksheetPaperProps {
  slug: string;
  title: string;
  gradeLevel: string;
  subject: string;
  pageNumber?: number;
  totalPages?: number;
  hasAnswerKey?: boolean;
  coverImage?: string;
  isCompact?: boolean;
}

export default function WorksheetPaperPreview({
  slug,
  title,
  gradeLevel,
  subject,
  pageNumber = 1,
  totalPages = 25,
  hasAnswerKey = true,
  coverImage,
  isCompact = false,
}: WorksheetPaperProps) {
  // If a custom cover image is provided and it's not a generic unsplash photo, or if requested
  // We can render a rich, realistic educational A4 worksheet sheet!

  return (
    <div className="relative w-full h-full bg-white select-none overflow-hidden flex flex-col justify-between font-sans shadow-md border border-slate-200/90 rounded-sm">
      {/* Paper texture overlay subtle grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-slate-100/30 pointer-events-none" />

      {/* Top Header of Thai Educational A4 Worksheet */}
      <div className="p-3 sm:p-4 border-b-2 border-[#082340]/15 relative z-0 bg-slate-50/60">
        <div className="flex items-center justify-between gap-2 border-b border-dashed border-slate-300 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#082340] flex items-center justify-center text-white text-[10px] font-bold">
              C
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-tight text-[#082340] block leading-none">
                ClassPic Worksheet Series
              </span>
              <span className="text-[8px] text-slate-500 font-medium">
                ขนาดกระดาษ A4 มาตรฐานไทย (210 × 297 มม.)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-[#1C64B8] bg-[#B5D5F2]/40 px-2 py-0.5 rounded-full">
              {subject}
            </span>
            <span className="text-[9px] font-semibold text-[#082340] bg-slate-200/70 px-2 py-0.5 rounded-full">
              {gradeLevel}
            </span>
          </div>
        </div>

        {/* Student Name / Class / Date header bar */}
        <div className="pt-2 grid grid-cols-12 gap-1 text-[8px] sm:text-[9px] text-slate-600">
          <div className="col-span-6 flex items-baseline">
            <span className="shrink-0 font-medium">ชื่อ-สกุล:</span>
            <span className="flex-1 border-b border-dotted border-slate-400 ml-1"></span>
          </div>
          <div className="col-span-3 flex items-baseline">
            <span className="shrink-0 font-medium">ชั้น:</span>
            <span className="flex-1 border-b border-dotted border-slate-400 ml-1"></span>
          </div>
          <div className="col-span-3 flex items-baseline">
            <span className="shrink-0 font-medium">คะแนน:</span>
            <span className="flex-1 border-b border-dotted border-slate-400 ml-1"></span>
          </div>
        </div>
      </div>

      {/* Worksheet Content Mockup (Varies by subject) */}
      <div className="flex-1 p-3 sm:p-5 relative flex flex-col justify-between overflow-hidden">
        {/* Title Box on Worksheet */}
        <div className="text-center space-y-1 mb-2">
          <div className="inline-block border-2 border-[#082340] px-3 py-1 rounded-lg bg-white shadow-2xs">
            <h4 className="text-[10px] sm:text-xs font-bold text-[#082340] tracking-tight">
              แบบฝึกหัดทบทวน: {title.split("(")[0].trim()}
            </h4>
          </div>
          <p className="text-[8px] sm:text-[9px] text-slate-500">
            คำชี้แจง: ให้นักเรียนสังเกตและตอบคำถามลงในช่องว่างให้ถูกต้องสมบูรณ์
          </p>
        </div>

        {/* Subject-specific interactive-looking visual exercise items */}
        {subject === "ภาษาอังกฤษ" && (
          <div className="space-y-2 flex-1 flex flex-col justify-around py-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/50 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#B5D5F2]/40 flex items-center justify-center text-sm font-bold text-[#1C64B8]">
                  🍎
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-800">1. A _ P L E</span>
                  <div className="border-b border-dashed border-slate-300 mt-1"></div>
                </div>
              </div>
              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/50 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#B5D5F2]/40 flex items-center justify-center text-sm font-bold text-[#1C64B8]">
                  🐱
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-800">2. C _ T</span>
                  <div className="border-b border-dashed border-slate-300 mt-1"></div>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-2.5 bg-amber-50/40">
              <span className="text-[8px] font-bold text-[#082340] block mb-1">
                ⭐ Word Match (จับคู่คำศัพท์):
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8px] text-slate-600">
                <div className="flex justify-between">
                  <span>(1) Pencil</span>
                  <span className="text-slate-400">○</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">○</span>
                  <span>ดินสอ</span>
                </div>
                <div className="flex justify-between">
                  <span>(2) School</span>
                  <span className="text-slate-400">○</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">○</span>
                  <span>โรงเรียน</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {subject === "เชาวน์ปัญญา" && (
          <div className="space-y-2 flex-1 flex flex-col justify-around py-1">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-2 bg-slate-50 flex flex-col items-center">
                <span className="text-xl">🌟</span>
                <span className="text-[8px] font-bold text-slate-600 mt-1">รูปที่ 1</span>
              </div>
              <div className="border-2 border-dashed border-[#F5760A]/40 rounded-xl p-2 bg-[#F5760A]/5 flex flex-col items-center">
                <span className="text-xl">🎨</span>
                <span className="text-[8px] font-bold text-[#F5760A] mt-1">ลากเส้นตามรอย</span>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-2 bg-slate-50 flex flex-col items-center">
                <span className="text-xl">🚀</span>
                <span className="text-[8px] font-bold text-slate-600 mt-1">รูปที่ 3</span>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
              <span className="text-[8px] text-slate-500">
                ✏️ แบบฝึกทักษะกล้ามเนื้อมือ: ลากเส้นโยงภาพคู่เหมือนให้สัมพันธ์กัน
              </span>
            </div>
          </div>
        )}

        {subject === "คณิตศาสตร์" && (
          <div className="space-y-2 flex-1 flex flex-col justify-around py-1">
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 text-center font-mono">
                <span className="text-slate-500 block text-[8px]">ข้อที่ 1</span>
                <span className="font-bold text-slate-800 text-xs">25 + 14 = [ &nbsp; ]</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 text-center font-mono">
                <span className="text-slate-500 block text-[8px]">ข้อที่ 2</span>
                <span className="font-bold text-slate-800 text-xs">50 - 18 = [ &nbsp; ]</span>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-2 bg-slate-50/80 text-[8px] text-slate-600">
              <span className="font-bold text-[#082340]">โจทย์ปัญหา:</span> นิดมีดินสอ 12 แท่ง ซื้อเพิ่มอีก 5 แท่ง รวมมีดินสอกี่แท่ง?
              <div className="border-b border-dotted border-slate-400 mt-2"></div>
            </div>
          </div>
        )}

        {subject !== "ภาษาอังกฤษ" && subject !== "เชาวน์ปัญญา" && subject !== "คณิตศาสตร์" && (
          <div className="space-y-2 flex-1 flex flex-col justify-center items-center text-center p-2">
            <div className="w-12 h-12 rounded-full bg-[#B5D5F2]/30 flex items-center justify-center text-2xl mb-1">
              📝
            </div>
            <span className="text-[10px] font-bold text-[#082340]">ใบงานทดลองสอน ClassPic A4</span>
            <span className="text-[8px] text-slate-500 max-w-[200px]">
              กราฟิกคมชัด สเกลมาตรฐานไทย ปริ้นท์ได้ทันที
            </span>
          </div>
        )}

        {/* Answer key stamp badge */}
        {hasAnswerKey && (
          <div className="absolute top-2 right-2 rotate-12 opacity-80 pointer-events-none">
            <span className="border-2 border-emerald-600 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider bg-emerald-50">
              มีเฉลยละเอียด
            </span>
          </div>
        )}
      </div>

      {/* Footer of A4 Sheet */}
      <div className="px-3 py-1.5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500">
        <span>© ClassPic Learning & Creative Studio</span>
        <span className="font-mono font-medium">
          แผ่นที่ {pageNumber} / {totalPages}
        </span>
      </div>

      {/* Watermark Protection Overlay */}
      <WatermarkOverlay text="ClassPic Studio" />
    </div>
  );
}
