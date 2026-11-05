import { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "ระบบจัดการร้านค้าหลังบ้าน (Admin) — ClassPic Store",
  description: "จัดการคำสั่งซื้อ ตรวจสอบสลิปโอนเงิน และเพิ่มชุดใบงานใหม่สำหรับสตูดิโอ ClassPic",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
