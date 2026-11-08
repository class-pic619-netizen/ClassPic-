/**
 * ลายน้ำบนรูปตัวอย่างใบงานหน้าร้าน (กฎความปลอดภัยใน AGENTS.md)
 * ใช้คำเดียวแบบจาง ๆ ให้ยังอ่านเนื้อหาใบงานได้ แต่ถ่ายไปพิมพ์ซ้ำแล้วติดลายน้ำแน่นอน
 */
export default function WatermarkOverlay({
  text = "ClassPic Studio",
  variant = "diagonal",
}: {
  text?: string;
  subtext?: string;
  variant?: "diagonal" | "badge" | "full";
}) {
  if (variant === "badge") {
    return (
      <div className="absolute bottom-2 right-2 z-10 rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-medium text-cp-navy pointer-events-none select-none">
        {text}
      </div>
    );
  }

  const repeated = variant === "full";

  return (
    <div
      className="absolute inset-0 z-10 grid place-items-center overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        className="font-head font-bold whitespace-nowrap text-cp-navy/[0.08] -rotate-[30deg] flex flex-col items-center"
        style={{ fontSize: repeated ? "2.2em" : "2.6em", gap: repeated ? "3em" : 0 }}
      >
        {repeated ? (
          <>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );
}
