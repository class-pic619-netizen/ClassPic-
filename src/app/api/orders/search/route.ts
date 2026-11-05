import { NextRequest, NextResponse } from "next/server";
import { findOrdersByContact } from "@/lib/ordersStore";


export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({
      success: true,
      orders: []
    });
  }

  const orders = findOrdersByContact(query);

  return NextResponse.json({
    success: true,
    count: orders.length,
    orders
  });
}
