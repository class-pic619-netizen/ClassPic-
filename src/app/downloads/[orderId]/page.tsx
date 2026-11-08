import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getOrder } from "@/lib/db";
import OrderDetailClient from "./OrderDetailClient";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `คำสั่งซื้อ #${orderId} — ClassPic`,
    description: "ดาวน์โหลดไฟล์ใบงานดิจิทัล ขนาด A4 มาตรฐานไทย คุณภาพสูง",
  };
}

async function OrderContent({ params }: Props) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-cp-navy">ไม่พบคำสั่งซื้อ {orderId}</h1>
        <p className="text-muted mt-2 mb-7">
          เลขคำสั่งซื้ออาจไม่ถูกต้อง ลองค้นหาด้วยเบอร์โทรหรืออีเมลที่ใช้ตอนสั่งซื้อแทน
        </p>
        <Link href="/downloads" className="btn-primary">
          ค้นหาคำสั่งซื้อ
        </Link>
      </div>
    );
  }

  return <OrderDetailClient initialOrder={order} />;
}

export default function OrderDetailPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-cp-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderContent {...props} />
    </Suspense>
  );
}
