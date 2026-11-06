"use client";

import React from "react";
import WatermarkOverlay from "./WatermarkOverlay";
import { ClassPicMark } from "./ClassPicLogo";

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
  title,
  gradeLevel,
  subject,
  pageNumber = 1,
  totalPages = 25,
  hasAnswerKey = true,
}: WorksheetPaperProps) {
  return (
    <div className="relative w-full h-full bg-white select-none overflow-hidden flex flex-col justify-between font-sans border-2 border-[#142E4F]">
      {/* Architectural A4 Inner Frame */}
      <div className="p-3 sm:p-4 border-b-2 border-[#142E4F] bg-[#FAFBFD] relative z-0">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#142E4F]/20">
          <div className="flex items-center gap-2">
            <ClassPicMark className="w-6 h-6 shrink-0" />
            <div>
              <div className="flex items-baseline gap-0.5 text-[11px] font-extrabold tracking-tight leading-none">
                <span className="text-[#142E4F]">Cla</span>
                <span className="text-[#F26C28]">ss</span>
                <span className="text-[#142E4F]">Pic</span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#2856B0] ml-1">
                  STUDIO SHEET
                </span>
              </div>
              <span className="text-[7px] font-mono text-slate-500 uppercase tracking-wider block mt-0.5">
                STANDARD A4 • 210×297 MM • 300 DPI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[8px] font-extrabold text-[#142E4F] bg-[#AED6F4] border border-[#142E4F] px-1.5 py-0.5 uppercase">
              {subject}
            </span>
            <span className="text-[8px] font-mono font-bold text-white bg-[#142E4F] px-1.5 py-0.5">
              {gradeLevel}
            </span>
          </div>
        </div>

        {/* Student Name / Class / Score Line */}
        <div className="pt-2 grid grid-cols-12 gap-1.5 text-[8px] text-[#142E4F] font-semibold">
          <div className="col-span-6 flex items-baseline">
            <span className="shrink-0">ชื่อ-สกุล:</span>
            <span className="flex-1 border-b border-[#142E4F]/40 ml-1" />
          </div>
          <div className="col-span-3 flex items-baseline">
            <span className="shrink-0">ชั้น:</span>
            <span className="flex-1 border-b border-[#142E4F]/40 ml-1" />
          </div>
          <div className="col-span-3 flex items-baseline">
            <span className="shrink-0">คะแนน:</span>
            <span className="flex-1 border-b border-[#142E4F]/40 ml-1 font-mono text-[7px] text-right text-slate-400">
              /10
            </span>
          </div>
        </div>
      </div>

      {/* Worksheet Body Area — Clean Vector Studio Graphics (No Emojis) */}
      <div className="flex-1 p-3 sm:p-4 relative flex flex-col justify-between overflow-hidden bg-white">
        {/* Worksheet Title Banner */}
        <div className="border-2 border-[#142E4F] bg-[#AED6F4]/25 px-2.5 py-1.5 mb-2 flex items-center justify-between">
          <div>
            <span className="text-[7px] font-mono uppercase tracking-widest text-[#2856B0] block">
              EXERCISE SHEET • NO. 0{pageNumber}
            </span>
            <h4 className="text-[10px] sm:text-[11px] font-extrabold text-[#142E4F] tracking-tight line-clamp-1">
              {title.split("(")[0].trim()}
            </h4>
          </div>
          <span className="text-[8px] font-mono font-bold text-[#F26C28] border border-[#F26C28] bg-white px-1.5 py-0.5 shrink-0">
            A4 MASTER
          </span>
        </div>

        {/* Subject-Specific Vector Worksheet Exercises */}
        {subject === "ภาษาอังกฤษ" && (
          <div className="space-y-2 flex-1 flex flex-col justify-around py-0.5">
            {/* Part A: Vector Picture + Handwriting Lines */}
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-[#142E4F] p-2 bg-[#FAFBFD] flex items-center gap-2">
                <div className="w-9 h-9 border border-[#142E4F] bg-[#AED6F4]/35 flex items-center justify-center shrink-0">
                  {/* Vector Apple Icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#142E4F" strokeWidth="1.8">
                    <path d="M12 6C12 4 13.5 2.5 15.5 2.5C15.5 4.5 14 6 12 6Z" fill="#AED6F4" />
                    <path d="M12 6.5C8.5 6.5 5.5 9 5.5 13.5C5.5 18 8.5 21 12 21C15.5 21 18.5 18 18.5 13.5C18.5 9 15.5 6.5 12 6.5Z" fill="#F26C28" fillOpacity="0.2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-mono font-bold text-[#142E4F] block">
                    01. A P P L E
                  </span>
                  <div className="mt-1 space-y-1">
                    <div className="border-b border-[#2856B0]/50" />
                    <div className="border-b border-dashed border-[#F26C28]/60" />
                    <div className="border-b border-[#142E4F]/60" />
                  </div>
                </div>
              </div>

              <div className="border border-[#142E4F] p-2 bg-[#FAFBFD] flex items-center gap-2">
                <div className="w-9 h-9 border border-[#142E4F] bg-[#AED6F4]/35 flex items-center justify-center shrink-0">
                  {/* Vector Book Icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#142E4F" strokeWidth="1.8">
                    <path d="M4 5.5C4 4.4 4.9 3.5 6 3.5H19V18.5H6C4.9 18.5 4 19.4 4 20.5V5.5Z" fill="#AED6F4" />
                    <path d="M4 19.5C4 18.4 4.9 17.5 6 17.5H19" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-mono font-bold text-[#142E4F] block">
                    02. B O O K
                  </span>
                  <div className="mt-1 space-y-1">
                    <div className="border-b border-[#2856B0]/50" />
                    <div className="border-b border-dashed border-[#F26C28]/60" />
                    <div className="border-b border-[#142E4F]/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Part B: Bilingual Matching Table */}
            <div className="border border-[#142E4F] p-2 bg-white">
              <div className="flex items-center justify-between border-b border-[#142E4F]/15 pb-1 mb-1.5">
                <span className="text-[8px] font-extrabold text-[#142E4F] uppercase tracking-wider">
                  PART B — BILINGUAL VOCABULARY MATCH
                </span>
                <span className="text-[7px] font-mono text-[#2856B0]">4 POINTS</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8px] text-[#142E4F] font-medium">
                <div className="flex items-center justify-between">
                  <span className="font-mono">[A] Classroom</span>
                  <span className="w-2 h-2 rounded-full border border-[#142E4F]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-2 h-2 rounded-full border border-[#142E4F]" />
                  <span>ดินสอเขียน</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono">[B] Pencil</span>
                  <span className="w-2 h-2 rounded-full border border-[#142E4F]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-2 h-2 rounded-full border border-[#142E4F]" />
                  <span>ห้องเรียน</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {subject === "เชาวน์ปัญญา" && (
          <div className="space-y-2 flex-1 flex flex-col justify-around py-0.5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="border border-[#142E4F] p-2 bg-[#FAFBFD] flex flex-col items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#142E4F" strokeWidth="2">
                  <rect x="6" y="6" width="20" height="20" fill="#AED6F4" />
                </svg>
                <span className="text-[7px] font-mono font-bold text-[#142E4F] mt-1">FIG 01</span>
              </div>
              <div className="border border-[#142E4F] p-2 bg-[#AED6F4]/25 flex flex-col items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#142E4F" strokeWidth="2">
                  <polygon points="16,5 28,26 4,26" fill="#F26C28" fillOpacity="0.35" />
                </svg>
                <span className="text-[7px] font-mono font-bold text-[#142E4F] mt-1">FIG 02</span>
              </div>
              <div className="border-2 border-dashed border-[#F26C28] p-2 bg-white flex flex-col items-center justify-center">
                <span className="text-xs font-mono font-extrabold text-[#F26C28]">?</span>
                <span className="text-[7px] font-mono font-bold text-[#142E4F] mt-1">NEXT SHAPE</span>
              </div>
            </div>
            <div className="border border-[#142E4F] p-2 bg-[#FAFBFD] text-[8px] text-[#142E4F] flex items-center justify-between">
              <span className="font-semibold">สังเกตลำดับอนุกรมรูปทรงเรขาคณิต แล้ววาดรูปถัดไป</span>
              <span className="font-mono text-[7px] text-[#2856B0]">EF LOGIC</span>
            </div>
          </div>
        )}

        {subject === "คณิตศาสตร์" && (
          <div className="space-y-2 flex-1 flex flex-col justify-around py-0.5">
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="border border-[#142E4F] p-2 bg-[#FAFBFD] text-center font-mono">
                <span className="text-[#2856B0] block text-[7px] font-bold">ITEM 01</span>
                <span className="font-extrabold text-[#142E4F] text-xs">25 + 14 = [ &nbsp;&nbsp; ]</span>
              </div>
              <div className="border border-[#142E4F] p-2 bg-[#FAFBFD] text-center font-mono">
                <span className="text-[#2856B0] block text-[7px] font-bold">ITEM 02</span>
                <span className="font-extrabold text-[#142E4F] text-xs">50 - 18 = [ &nbsp;&nbsp; ]</span>
              </div>
            </div>
            <div className="border border-[#142E4F] p-2 bg-white text-[8px] text-[#142E4F]">
              <span className="font-extrabold text-[#2856B0] font-mono">[WORD PROBLEM]</span>{" "}
              มีสีไม้ 24 แท่ง แบ่งใส่กล่อง กล่องละ 6 แท่ง จะได้ทั้งหมดกี่กล่อง?
              <div className="border-b border-dashed border-[#142E4F]/40 mt-2" />
            </div>
          </div>
        )}

        {subject !== "ภาษาอังกฤษ" && subject !== "เชาวน์ปัญญา" && subject !== "คณิตศาสตร์" && (
          <div className="space-y-2 flex-1 flex flex-col justify-around py-0.5">
            <div className="border border-[#142E4F] p-2.5 bg-[#FAFBFD] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-[#2856B0]">SECTION 01</span>
                <span className="text-[7px] font-mono text-slate-500">STRUCTURED VISUAL STEP</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-9 border border-[#142E4F] bg-white flex items-center justify-center text-[8px] font-mono font-bold">
                  STEP 1
                </div>
                <div className="h-9 border border-[#142E4F] bg-[#AED6F4]/30 flex items-center justify-center text-[8px] font-mono font-bold">
                  STEP 2
                </div>
                <div className="h-9 border border-[#142E4F] bg-white flex items-center justify-center text-[8px] font-mono font-bold">
                  STEP 3
                </div>
              </div>
            </div>
            <div className="border border-[#142E4F] p-2 bg-white">
              <div className="border-b border-dashed border-[#142E4F]/40 h-3" />
              <div className="border-b border-dashed border-[#142E4F]/40 h-3 mt-1" />
            </div>
          </div>
        )}

        {/* Answer Key Architectural Stamp */}
        {hasAnswerKey && (
          <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
            <span className="border border-[#142E4F] bg-[#142E4F] text-[#AED6F4] text-[7px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">
              + ANSWER KEY
            </span>
          </div>
        )}
      </div>

      {/* Footer of A4 Sheet */}
      <div className="px-3 py-1.5 bg-[#142E4F] text-white flex items-center justify-between text-[7px] font-mono">
        <span className="text-[#AED6F4]">CLASSPIC LEARNING &amp; CREATIVE STUDIO</span>
        <span className="text-white font-bold">
          SHEET {String(pageNumber).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
        </span>
      </div>

      {/* Watermark Protection Overlay */}
      <WatermarkOverlay text="ClassPic Studio" />
    </div>
  );
}
