/**
 * ไอคอน Streamline Flex ที่ระบายสีแบรนด์แล้ว (ไฟล์อยู่ใน /public/icons)
 * ใช้เท่าที่จำเป็น — ดูแนวทางในสกิล anti-ai-ui-brand-dna
 */
export type BrandIconName =
  | "printer"
  | "graduation-cap"
  | "padlock-square-1"
  | "receipt"
  | "cloud-download"
  | "book-reading"
  | "tag"
  | "cashing-check"
  | "download-tray";

export default function BrandIcon({
  name,
  className = "w-5 h-5",
}: {
  name: BrandIconName;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/icons/${name}.svg`} alt="" aria-hidden="true" className={`shrink-0 ${className}`} />
  );
}
