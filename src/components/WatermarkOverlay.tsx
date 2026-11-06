export default function WatermarkOverlay({
  text = "ClassPic Studio",
  subtext = "ตัวอย่างเพื่อการทดลองดู — ไม่อนุญาตให้นำไปพิมพ์ซ้ำ",
  variant = "diagonal",
}: {
  text?: string;
  subtext?: string;
  variant?: "diagonal" | "badge" | "full";
}) {
  if (variant === "badge") {
    return (
      <div className="absolute bottom-2.5 right-2.5 z-10 bg-[#142E4F]/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium flex items-center gap-1 shadow-sm border border-white/10 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F26C28]"></span>
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none flex flex-col items-center justify-center overflow-hidden">
      {/* Repeating Diagonal Watermark Grid */}
      <div className="w-[150%] h-[150%] -rotate-25 flex flex-col justify-around items-center opacity-30 sm:opacity-35">
        <div className="flex gap-12 whitespace-nowrap text-xs font-bold tracking-widest text-[#142E4F] uppercase">
          <span>{text}</span>
          <span>•</span>
          <span>{text}</span>
          <span>•</span>
          <span>{text}</span>
        </div>
        <div className="flex gap-8 whitespace-nowrap text-sm sm:text-base font-extrabold tracking-widest text-[#142E4F] uppercase bg-white/40 px-6 py-1 rounded-full border border-[#142E4F]/10 shadow-xs">
          <span>{text}</span>
          <span className="text-[#F26C28]">•</span>
          <span>PREVIEW ONLY</span>
        </div>
        <div className="flex gap-12 whitespace-nowrap text-xs font-bold tracking-widest text-[#142E4F] uppercase">
          <span>{text}</span>
          <span>•</span>
          <span>{text}</span>
          <span>•</span>
          <span>{text}</span>
        </div>
      </div>

      {/* Subtle corner badge for safety */}
      <div className="absolute bottom-2.5 right-2.5 bg-[#142E4F]/85 backdrop-blur-xs text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 shadow-sm border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F26C28]"></span>
        <span>{text}</span>
      </div>
    </div>
  );
}
