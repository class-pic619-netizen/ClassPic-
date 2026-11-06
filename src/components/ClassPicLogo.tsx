import React from "react";

interface ClassPicLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
  showSubtitle?: boolean;
  showTagline?: boolean;
  className?: string;
}

/**
 * สัญลักษณ์ประกายสามเหลี่ยมสีส้ม (Play Triangle + 3 Radiating Rays)
 * ถอดแบบจากจุดบนตัว i และตัว C ของโลโก้ต้นฉบับ ClassPic
 */
export function ClassPicSpark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Rounded Play Triangle */}
      <path
        d="M4 7.5C4 5.1 6.6 3.6 8.7 4.9L21.2 12.4C23.2 13.6 23.2 16.5 21.2 17.7L8.7 25.2C6.6 26.5 4 25 4 22.6V7.5Z"
        fill="#F26C28"
      />
      {/* Ray 1 (Top Left) */}
      <path
        d="M21 5.5L23.5 1.5"
        stroke="#F26C28"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Ray 2 (Middle Right) */}
      <path
        d="M25.5 9.5L31.5 4.5"
        stroke="#F26C28"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Ray 3 (Bottom Right) */}
      <path
        d="M27.5 14.5L34 11.5"
        stroke="#F26C28"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * ไอคอนตัว C ในกรอบสี่เหลี่ยมมุมมนสีกรมท่า พร้อมประกายสามเหลี่ยมสีส้ม
 * ถอดจากไอคอนกลางแผ่น Brand Sheet ต้นฉบับ
 */
export function ClassPicMark({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="15" fill="#142E4F" />
      {/* Bold C curve */}
      <path
        d="M39.5 43.2C36.8 45.9 33.1 47.5 28.8 47.5C19.8 47.5 12.8 40.5 12.8 31.8C12.8 23.1 19.8 16.1 28.8 16.1C33.1 16.1 36.8 17.7 39.5 20.4"
        stroke="#FFFFFF"
        strokeWidth="8.5"
        strokeLinecap="round"
      />
      {/* Orange Play Triangle in the mouth of C */}
      <path
        d="M35.5 26.8C35.5 25.1 37.3 24.1 38.8 25L47.6 30.3C49 31.1 49 33.2 47.6 34L38.8 39.3C37.3 40.2 35.5 39.2 35.5 37.5V26.8Z"
        fill="#F26C28"
      />
      {/* 3 Orange Spark Rays */}
      <path
        d="M38.5 15.5L40 9.5"
        stroke="#F26C28"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M43.5 18L48.5 12"
        stroke="#F26C28"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M46.5 22L53.5 18.5"
        stroke="#F26C28"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * โลโก้ตัวอักษร ClassPic ครบองค์ประกอบตาม Brand Sheet:
 * Cla (กรมท่า) + ss (ส้มสด) + Pic (กรมท่า + จุดตัว i เป็นสามเหลี่ยมประกายส้ม)
 * พร้อมเส้นคั่น LEARNING & CREATIVE STUDIO และสโลแกน Bright Outside — Clear Inside
 */
export default function ClassPicLogo({
  size = "md",
  theme = "light",
  showSubtitle = true,
  showTagline = false,
  className = "",
}: ClassPicLogoProps) {
  const textColor = theme === "light" ? "text-[#142E4F]" : "text-white";
  const subColor = theme === "light" ? "text-[#142E4F]" : "text-[#AED6F4]";
  const lineColor = theme === "light" ? "bg-[#2856B0]/60" : "bg-[#AED6F4]/50";

  const sizeMap = {
    sm: {
      word: "text-2xl",
      spark: "w-3.5 h-3.5 -top-2.5 -left-0.5",
      sub: "text-[8px] tracking-[0.22em]",
      tag: "text-[10px]",
    },
    md: {
      word: "text-3xl sm:text-[34px]",
      spark: "w-4 h-4 -top-3 left-0",
      sub: "text-[9px] tracking-[0.24em]",
      tag: "text-xs",
    },
    lg: {
      word: "text-4xl sm:text-5xl",
      spark: "w-5 h-5 -top-4 left-0.5",
      sub: "text-[10px] sm:text-[11px] tracking-[0.26em]",
      tag: "text-sm",
    },
    xl: {
      word: "text-5xl sm:text-6xl",
      spark: "w-6 h-6 -top-5 left-1",
      sub: "text-xs tracking-[0.28em]",
      tag: "text-base",
    },
  }[size];

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      {/* Main Wordmark: Cla + ss + P + dotless i with spark + c */}
      <div
        className={`font-extrabold tracking-[-0.03em] leading-none flex items-baseline ${sizeMap.word}`}
      >
        <span className={textColor}>Cla</span>
        <span className="text-[#F26C28]">ss</span>
        <span className={textColor}>P</span>
        <span className={`relative inline-block ${textColor}`}>
          {/* Dotless i stem */}
          <span>ı</span>
          {/* Custom Orange Play + Spark Burst replacing the dot on 'i' */}
          <span className={`absolute ${sizeMap.spark} pointer-events-none`}>
            <ClassPicSpark className="w-full h-full" />
          </span>
        </span>
        <span className={textColor}>c</span>
      </div>

      {/* Subtitle with flanking horizontal rules */}
      {showSubtitle && (
        <div className="w-full flex items-center gap-2 mt-1.5">
          <span className={`h-[1.5px] flex-1 ${lineColor}`} />
          <span className={`font-bold uppercase whitespace-nowrap ${subColor} ${sizeMap.sub}`}>
            LEARNING &amp; CREATIVE STUDIO
          </span>
          <span className={`h-[1.5px] flex-1 ${lineColor}`} />
        </div>
      )}

      {/* Italic Tagline: Bright Outside — Clear Inside */}
      {showTagline && (
        <p
          className={`w-full text-center italic font-medium mt-1 ${
            theme === "light" ? "text-[#142E4F]/85" : "text-[#AED6F4]"
          } ${sizeMap.tag}`}
        >
          Bright Outside — Clear Inside
        </p>
      )}
    </div>
  );
}
