import { NextResponse } from "next/server";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const customPromptPayId = body.phoneNumber?.trim();

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "จำนวนเงินไม่ถูกต้อง (ต้องมากกว่า 0 บาท)" },
        { status: 400 }
      );
    }

    // Default PromptPay ID from env or fallback
    const promptpayId =
      customPromptPayId ||
      process.env.NEXT_PUBLIC_PROMPTPAY_ID ||
      "0812345678";

    // Generate EMVCo QR Payload
    const payload = generatePayload(promptpayId, { amount });

    // Generate high resolution QR Data URL
    const qrDataUrl = await QRCode.toDataURL(payload, {
      type: "image/png",
      width: 400,
      margin: 2,
      color: {
        dark: "#082340", // Navy from ClassPic Brand
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      success: true,
      qrDataUrl,
      amount,
      promptpayId,
    });
  } catch (error) {
    console.error("PromptPay QR Generation Error:", error);
    return NextResponse.json(
      { success: false, error: "ไม่สามารถสร้าง QR Code PromptPay ได้" },
      { status: 500 }
    );
  }
}
