import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { getOrder } from "@/lib/ordersStore";
import OrderDetailClient from "./OrderDetailClient";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateStaticParams() {
  return [
    { orderId: "CP-20261105-001" },
    { orderId: "CP-20261105-002" },
    { orderId: "CP-20261105-003" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `คำสั่งซื้อ #${orderId} — ClassPic Store`,
    description: "ดาวน์โหลดไฟล์ใบงานดิจิทัล ขนาด A4 มาตรฐานไทย คุณภาพสูง",
  };
}

async function OrderContent({ params }: Props) {
  const { orderId } = await params;
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#142E4F] mb-2">
            ไม่พบคำสั่งซื้อหมายเลข #{orderId}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            รหัสคำสั่งซื้อนี้อาจไม่ถูกต้อง หรือหมดอายุการค้นหา กรุณาตรวจสอบและค้นหาใหม่อีกครั้ง
          </p>
          <Link
            href="/downloads"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#142E4F] hover:bg-[#2856B0] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปหน้าค้นหาใบงาน</span>
          </Link>
        </div>
      </div>
    );
  }

  return <OrderDetailClient initialOrder={order} />;
}

export default function OrderDetailPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#2856B0] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderContent {...props} />
    </Suspense>
  );
}
