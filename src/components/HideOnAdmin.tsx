"use client";

import { usePathname } from "next/navigation";

/** ซ่อนส่วนหัว/ท้ายของหน้าร้านในหลังบ้าน (/admin มีโครงหน้าของตัวเอง) */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
