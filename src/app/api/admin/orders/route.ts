import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAllOrders, getOrder, setOrderStatus, signedSlipUrl } from "@/lib/db";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const orders = await getAllOrders();
    // รูปสลิปอยู่ในถังส่วนตัว — ส่งลิงก์ชั่วคราว 10 นาทีให้หลังบ้านดู
    const withSlipLinks = await Promise.all(
      orders.map(async (o) => ({
        ...o,
        slip_image_url: o.slip_image_url ? (await signedSlipUrl(o.slip_image_url)) ?? undefined : undefined,
      }))
    );
    const paid = orders.filter((o) => o.status === "PAID" || o.status === "VERIFIED");
    return NextResponse.json({
      success: true,
      orders: withSlipLinks,
      totalCount: orders.length,
      pendingCount: orders.filter((o) => o.status === "PENDING" || o.status === "PENDING_REVIEW").length,
      paidCount: paid.length,
      totalRevenue: paid.reduce((sum, o) => sum + o.total_amount, 0),
    });
  } catch (error) {
    console.error("admin orders GET error:", error);
    return NextResponse.json({ success: false, message: "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { orderId, action } = await req.json();
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ success: false, message: "ต้องระบุ orderId" }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
    }

    if (action === "approve") {
      const updated = await setOrderStatus(orderId, "PAID", {
        trans_ref: order.trans_ref || `MANUAL-${Date.now().toString().slice(-6)}`,
      });
      return NextResponse.json({ success: true, message: "อนุมัติคำสั่งซื้อเรียบร้อยแล้ว", order: updated });
    }
    if (action === "reject") {
      const updated = await setOrderStatus(orderId, "REJECTED");
      return NextResponse.json({ success: true, message: "ปฏิเสธคำสั่งซื้อแล้ว", order: updated });
    }

    return NextResponse.json({ success: false, message: "action ไม่ถูกต้อง" }, { status: 400 });
  } catch (error) {
    console.error("admin orders PATCH error:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการอัปเดตคำสั่งซื้อ" }, { status: 500 });
  }
}
