import { NextResponse } from "next/server";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";
import { getOrder } from "@/lib/db";
import { requireEnv } from "@/lib/supabaseAdmin";

/**
 * สร้าง QR พร้อมเพย์ของคำสั่งซื้อ
 * - เบอร์พร้อมเพย์มาจาก NEXT_PUBLIC_PROMPTPAY_ID เท่านั้น (ไม่มีเบอร์สำรอง ไม่รับเบอร์จากเบราว์เซอร์)
 * - ยอดเงินมาจากคำสั่งซื้อในฐานข้อมูล ไม่รับยอดจากเบราว์เซอร์
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    if (!orderId) {
      return NextResponse.json({ success: false, error: "ไม่พบเลขคำสั่งซื้อ" }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
    }
    if (order.total_amount <= 0) {
      return NextResponse.json({ success: false, error: "คำสั่งซื้อนี้ไม่ต้องชำระเงิน" }, { status: 400 });
    }

    const promptpayId = requireEnv("NEXT_PUBLIC_PROMPTPAY_ID").replace(/[^0-9]/g, "");
    const payload = generatePayload(promptpayId, { amount: order.total_amount });
    const qrDataUrl = await QRCode.toDataURL(payload, {
      type: "image/png",
      width: 400,
      margin: 2,
      color: { dark: "#142E4F", light: "#FFFFFF" },
    });

    return NextResponse.json({
      success: true,
      qrDataUrl,
      amount: order.total_amount,
      // แสดงบางส่วนพอให้ลูกค้าตรวจ ไม่ต้องโชว์เบอร์เต็มบนหน้าเว็บ
      promptpayId: promptpayId.replace(/^(\d{3})\d+(\d{3})$/, "$1-xxx-$2"),
    });
  } catch (error) {
    console.error("PromptPay QR Generation Error:", error);
    return NextResponse.json({ success: false, error: "ไม่สามารถสร้าง QR พร้อมเพย์ได้" }, { status: 500 });
  }
}
