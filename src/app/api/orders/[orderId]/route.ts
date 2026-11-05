import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/ordersStore";


interface RouteParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(req: NextRequest, props: RouteParams) {
  const { orderId } = await props.params;
  const order = getOrder(orderId);

  if (!order) {
    return NextResponse.json(
      { success: false, error: `ไม่พบคำสั่งซื้อ #${orderId}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    order
  });
}
