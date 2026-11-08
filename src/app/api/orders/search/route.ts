import { NextRequest, NextResponse } from "next/server";
import { findOrdersByContact } from "@/lib/db";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  if (!query.trim()) {
    return NextResponse.json({ success: true, orders: [] });
  }

  try {
    const orders = await findOrdersByContact(query);
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("Order search error:", err);
    return NextResponse.json({ success: false, error: "ค้นหาไม่สำเร็จ กรุณาลองใหม่" }, { status: 500 });
  }
}
