import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, markOrderPaid, getOrder } from "@/lib/ordersStore";
import { OrderStatus } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const orders = getAllOrders();
    return NextResponse.json({
      success: true,
      orders,
      totalCount: orders.length,
      pendingCount: orders.filter((o) => o.status === "PENDING").length,
      paidCount: orders.filter((o) => o.status === "PAID").length,
      totalRevenue: orders
        .filter((o) => o.status === "PAID")
        .reduce((sum, o) => sum + o.total_amount, 0),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, action, transRef, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "ต้องระบุ orderId" },
        { status: 400 }
      );
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      const updated = markOrderPaid(
        orderId,
        transRef || `MANUAL-${Date.now().toString().slice(-6)}`,
        order.slip_image_url,
        "PAID"
      );
      return NextResponse.json({
        success: true,
        message: "อนุมัติคำสั่งซื้อเรียบร้อยแล้ว",
        order: updated,
      });
    } else if (action === "reject") {
      order.status = "REJECTED";
      return NextResponse.json({
        success: true,
        message: "ปฏิเสธคำสั่งซื้อแล้ว",
        order,
      });
    }

    return NextResponse.json(
      { success: false, message: "action ไม่ถูกต้อง" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตคำสั่งซื้อ" },
      { status: 500 }
    );
  }
}
