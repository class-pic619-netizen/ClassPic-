"use client";

import React from "react";
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

/**
 * ภาพหน้าใบงานจำลองสัดส่วน A4
 * - ถ้ามีรูปสแกนใบงานจริงในเว็บ (coverImage ขึ้นต้นด้วย "/") จะแสดงรูปนั้นแทน
 * - ถ้ายังไม่มี จะวาดหน้าใบงานตัวอย่างตามวิชา ให้แต่ละชุดหน้าตาไม่ซ้ำกัน
 * ขนาดตัวอักษรอิงความกว้างกระดาษ (container query) จึงคมชัดทุกขนาดการ์ด
 */
export default function WorksheetPaperPreview({
  title,
  gradeLevel,
  subject,
  pageNumber = 1,
  coverImage,
}: WorksheetPaperProps) {
  const shortTitle = title.replace(/\(.*?\)/g, "").replace(/^ชุด(ใบงาน|แบบฝึก|ฝึก|สื่อ)?/, "").trim();
  const realScan = coverImage && coverImage.startsWith("/") ? coverImage : null;

  return (
    <div className="@container relative w-full h-full">
      <div
        className="paper relative w-full h-full overflow-hidden select-none text-[#222]"
        style={{ fontSize: "4cqw", lineHeight: 1.4 }}
      >
        {realScan ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={realScan} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="h-full flex flex-col" style={{ padding: "7%" }}>
            <div
              className="flex justify-between text-[#777] border-b border-[#ccc]"
              style={{ fontSize: "0.8em", paddingBottom: "0.4em", marginBottom: "0.9em" }}
            >
              <span>
                {subject} · {gradeLevel}
              </span>
              <span>ชื่อ ....................</span>
            </div>
            <h4
              className="font-head font-semibold text-[#111] line-clamp-2"
              style={{ fontSize: "1.35em", marginBottom: "0.35em" }}
            >
              {shortTitle}
            </h4>
            <SheetBody subject={subject} gradeLevel={gradeLevel} page={pageNumber} />
          </div>
        )}
        <WatermarkOverlay />
      </div>
    </div>
  );
}

function Instruction({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#555]" style={{ fontSize: "0.9em", marginBottom: "0.9em" }}>
      {children}
    </p>
  );
}

const ICON_STROKE = { fill: "none", stroke: "#333", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const VOCAB_ICONS = [
  // apple
  <svg key="a" viewBox="0 0 24 24" {...ICON_STROKE}><path d="M12 7c-4 0-6.5 2.6-6.5 6.6S8 21 12 21s6.5-3.4 6.5-7.4S16 7 12 7Z" /><path d="M12 7c0-2 1.2-3.6 3.2-3.8" /></svg>,
  // book
  <svg key="b" viewBox="0 0 24 24" {...ICON_STROKE}><path d="M4 5.5A2 2 0 0 1 6 3.5h13v15H6a2 2 0 0 0-2 2v-15Z" /><path d="M4 20.5a2 2 0 0 1 2-2h13" /></svg>,
  // cat
  <svg key="c" viewBox="0 0 24 24" {...ICON_STROKE}><path d="M5 9 4 3.5 9 6.5h6l5-3-1 5.5c1 1.3 1.5 2.7 1.5 4.3 0 4-3.8 7.2-8.5 7.2S3.5 17.3 3.5 13.3c0-1.6.5-3 1.5-4.3Z" /><circle cx="9" cy="12.5" r=".6" /><circle cx="15" cy="12.5" r=".6" /></svg>,
  // sun
  <svg key="d" viewBox="0 0 24 24" {...ICON_STROKE}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></svg>,
];

function SheetBody({ subject, gradeLevel, page }: { subject: string; gradeLevel: string; page: number }) {
  if (gradeLevel === "การศึกษาพิเศษ") {
    return (
      <>
        <Instruction>ลากเส้นตามรอยประจากซ้ายไปขวา</Instruction>
        <svg viewBox="0 0 120 110" className="w-full" fill="none" stroke="#9a9a9a" strokeWidth="2" strokeDasharray="4 4">
          <path d="M8 20 Q 30 0 52 20 T 96 20 T 116 20" />
          <path d="M8 55 L 30 38 L 52 55 L 74 38 L 96 55 L 116 38" />
          <path d="M8 92 Q 20 72 32 92 T 56 92 T 80 92 T 104 92" />
        </svg>
      </>
    );
  }

  switch (subject) {
    case "ภาษาอังกฤษ":
      return (
        <>
          <Instruction>ดูภาพ แล้วเขียนคำศัพท์ให้ถูกต้อง</Instruction>
          {VOCAB_ICONS.map((icon, i) => (
            <div key={i} className="flex items-center" style={{ gap: "0.7em", margin: "0.75em 0" }}>
              <div
                className="grid place-items-center border border-[#bbb] shrink-0"
                style={{ width: "3.4em", height: "3.4em", borderRadius: "0.4em", padding: "0.5em" }}
              >
                {icon}
              </div>
              <div className="flex-1 border-b-[1.5px] border-dotted border-[#999]" style={{ height: "1.6em" }} />
            </div>
          ))}
        </>
      );

    case "คณิตศาสตร์": {
      const problems = page % 2 === 0
        ? ["48 − 15", "36 − 12", "57 − 24", "69 − 31", "85 − 42", "74 − 50", "92 − 61", "63 − 20"]
        : ["25 + 14", "31 + 22", "40 + 18", "17 + 52", "63 + 25", "44 + 33", "12 + 71", "58 + 20"];
      return (
        <>
          <Instruction>หาผลลัพธ์</Instruction>
          <div className="grid grid-cols-2 font-head" style={{ gap: "0.5em 1.4em", fontSize: "1.2em" }}>
            {problems.map((p) => (
              <div key={p} className="border-b border-[#ddd]" style={{ padding: "0.45em 0" }}>
                {p} = ____
              </div>
            ))}
          </div>
        </>
      );
    }

    case "เชาวน์ปัญญา":
      return (
        <>
          <Instruction>วงกลมรูปที่ควรอยู่ในช่องว่าง</Instruction>
          {[
            ["circle", "triangle", "circle", "blank"],
            ["square", "filled", "square", "blank"],
            ["triangle", "triangle", "circle", "blank"],
          ].map((row, r) => (
            <div key={r} className="flex" style={{ gap: "0.9em", margin: "0.5em 0 1em" }}>
              {row.map((shape, i) => (
                <Shape key={i} kind={shape} />
              ))}
            </div>
          ))}
        </>
      );

    case "ภาษาไทย":
      return (
        <>
          <Instruction>เขียนตามรอยประ</Instruction>
          {["ก", "ข", "ค", "ง"].map((ch) => (
            <div key={ch} className="font-head" style={{ fontSize: "2.4em", letterSpacing: "0.25em", lineHeight: 1.3 }}>
              <span className="text-[#222]">{ch}</span>
              <span style={{ color: "transparent", WebkitTextStroke: "1px #aaa" }}>{ch.repeat(4)}</span>
            </div>
          ))}
        </>
      );

    case "วิทยาศาสตร์":
      return (
        <>
          <Instruction>เขียนชื่อส่วนต่าง ๆ ของต้นไม้</Instruction>
          <svg viewBox="0 0 120 120" className="mx-auto block" style={{ width: "70%" }} fill="none" stroke="#333" strokeWidth="2">
            <line x1="60" y1="50" x2="60" y2="100" strokeWidth="3" />
            <ellipse cx="42" cy="62" rx="14" ry="7" transform="rotate(-25 42 62)" />
            <ellipse cx="78" cy="72" rx="14" ry="7" transform="rotate(25 78 72)" />
            <circle cx="60" cy="38" r="12" />
            <path d="M60 100 l-14 14 M60 100 l14 14 M60 100 v16" />
            <g stroke="#999" strokeWidth="1">
              <line x1="74" y1="38" x2="104" y2="30" />
              <line x1="28" y1="60" x2="8" y2="54" />
              <line x1="74" y1="112" x2="104" y2="112" />
            </g>
          </svg>
        </>
      );

    default:
      return (
        <>
          <Instruction>ระบายสีภาพ แล้วเขียนชื่อสิ่งที่เห็น</Instruction>
          <svg viewBox="0 0 120 90" className="w-full" fill="none" stroke="#333" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M20 70 L45 35 L70 70 Z" />
            <rect x="72" y="45" width="30" height="25" />
            <path d="M68 45 L87 28 L106 45" />
            <circle cx="98" cy="15" r="8" />
            <line x1="5" y1="70" x2="115" y2="70" />
          </svg>
          <div className="border-b-[1.5px] border-dotted border-[#999]" style={{ height: "2em" }} />
          <div className="border-b-[1.5px] border-dotted border-[#999]" style={{ height: "2em" }} />
        </>
      );
  }
}

function Shape({ kind }: { kind: string }) {
  const common = { width: "2.8em", height: "2.8em" };
  return (
    <svg viewBox="0 0 30 30" style={common}>
      {kind === "circle" && <circle cx="15" cy="15" r="11" fill="none" stroke="#333" strokeWidth="2" />}
      {kind === "triangle" && <polygon points="15,4 27,26 3,26" fill="none" stroke="#333" strokeWidth="2" />}
      {kind === "square" && <rect x="5" y="5" width="20" height="20" fill="none" stroke="#333" strokeWidth="2" />}
      {kind === "filled" && <rect x="5" y="5" width="20" height="20" fill="#333" />}
      {kind === "blank" && (
        <rect x="5" y="5" width="20" height="20" fill="none" stroke="#999" strokeWidth="2" strokeDasharray="3 3" />
      )}
    </svg>
  );
}
