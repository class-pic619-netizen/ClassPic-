import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrder, OrderInputError } from "@/lib/db";

/**
 * สร้างคำสั่งซื้อ — รับแค่เบอร์/อีเมลกับรายการ id ใบงาน
 * ยอดเงินคำนวณจากราคาในฐานข้อมูลเท่านั้น
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contact: unknown = body.contact;
    const items: unknown = body.items;

    if (typeof contact !== "string" || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "ข้อมูลคำสั่งซื้อไม่ครบ" }, { status: 400 });
    }

    const productIds = items
      .map((item) => (typeof item === "string" ? item : item?.product?.id ?? item?.productId))
      .filter((id): id is string => typeof id === "string");

    const order = await createOrder(contact, productIds);
    return NextResponse.json({ success: true, order });
  } catch (err) {
    if (err instanceof OrderInputError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
    console.error("Order creation error:", err);
    return NextResponse.json({ success: false, error: "ไม่สามารถสร้างคำสั่งซื้อได้" }, { status: 500 });
  }
}

/** ดูคำสั่งซื้อด้วยเลขคำสั่งซื้อ */
export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ success: false, error: "กรุณาระบุ orderId" }, { status: 400 });
    }
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Fetch order error:", err);
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาดในการค้นหาคำสั่งซื้อ" }, { status: 500 });
  }
}
