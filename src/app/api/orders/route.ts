import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrder, findOrdersByContact } from "@/lib/ordersStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contact, items, totalAmount } = body;

    if (!contact || typeof contact !== "string") {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุข้อมูลติดต่อ (เบอร์โทรศัพท์ หรือ อีเมล)" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "ไม่มีรายการสินค้าในคำสั่งซื้อ" },
        { status: 400 }
      );
    }

    const order = createOrder(contact, items, Number(totalAmount) || 0);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { success: false, error: "ไม่สามารถสร้างคำสั่งซื้อได้" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const contact = searchParams.get("contact");

    if (orderId) {
      const order = getOrder(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, error: "ไม่พบคำสั่งซื้อ" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    if (contact) {
      const orders = findOrdersByContact(contact);
      return NextResponse.json({ success: true, orders });
    }

    return NextResponse.json(
      { success: false, error: "กรุณาระบุ orderId หรือ contact" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการค้นหาคำสั่งซื้อ" },
      { status: 500 }
    );
  }
}
