import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/db";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

export async function GET(_req: NextRequest, props: RouteParams) {
  const { orderId } = await props.params;
  try {
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: `ไม่พบคำสั่งซื้อ ${orderId}` }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Fetch order error:", err);
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
