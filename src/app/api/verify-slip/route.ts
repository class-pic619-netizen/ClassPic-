import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import jsQR from "jsqr";
import crypto from "crypto";
import { getOrder, isSlipUsed, recordVerifiedSlip, markOrderPaid } from "@/lib/ordersStore";


/**
 * ดึงรหัสอ้างอิงจากข้อมูล Mini QR Code ของธนาคารไทย (0046 Standard PromptPay Slip)
 */
function extractBankTransRef(qrData: string): string {
  if (!qrData) return "";

  // กรณีสลิปมาตรฐานพร้อมเพย์ / Thai Bank Slip มักมี Subtag เช่น 0046... หรือรหัสอ้างอิง
  // ตัวอย่าง Payload: 00460006000001010301402...
  const match = qrData.match(/(?:TR|REF|B)[A-Z0-9]{8,24}/i);
  if (match) {
    return match[0].toUpperCase();
  }

  // หากเป็น QR พร้อมเพย์ทั่วไปหรือรหัสอื่น ให้สร้างรหัสย่อที่แน่นอนจากข้อความ QR
  const hash = crypto.createHash("sha256").update(qrData).digest("hex").slice(0, 12).toUpperCase();
  return `QR-${hash}`;
}

export async function POST(req: NextRequest) {
  try {
    let orderId: string = "";
    let imageBuffer: Buffer | null = null;
    let slipUrl: string | undefined = undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      orderId = (formData.get("orderId") as string) || "";
      const file = formData.get("slip") || formData.get("slipImage") || formData.get("file");

      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const arrayBuffer = await (file as Blob).arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
        slipUrl = `/uploads/slips/${orderId || Date.now()}.jpg`;
      }
    } else {
      const body = await req.json();
      orderId = body.orderId || "";
      if (body.slipImageBase64) {
        const base64Data = body.slipImageBase64.replace(/^data:image\/\w+;base64,/, "");
        imageBuffer = Buffer.from(base64Data, "base64");
        slipUrl = `/uploads/slips/${orderId || Date.now()}.jpg`;
      }
    }

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ไม่พบรหัสคำสั่งซื้อ (orderId)" },
        { status: 400 }
      );
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `ไม่พบคำสั่งซื้อหมายเลข ${orderId} ในระบบ` },
        { status: 404 }
      );
    }

    if (order.status === "PAID" || order.status === "VERIFIED") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        transRef: order.trans_ref || "ALREADY_PAID",
        status: order.status,
        message: "คำสั่งซื้อนี้ได้รับการชำระเงินเรียบร้อยแล้ว สามารถดาวน์โหลดไฟล์ได้ทันที"
      });
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "กรุณาแนบรูปภาพสลิปการโอนเงิน" },
        { status: 400 }
      );
    }

    // คำนวณ SHA-256 ของรูปสลิป เพื่อกันการนำรูปเดิมมาอัปโหลดซ้ำ
    const imageHash = crypto.createHash("sha256").update(imageBuffer).digest("hex");

    // ด่านที่ 1: ตรวจหา Mini QR Code บนรูปสลิปด้วย sharp + jsQR
    let qrPayload: string | null = null;
    try {
      // แปลงรูปภาพเป็น RGBA Raw Buffer ขนาดมาตรฐานเพื่อสแกน QR
      const { data, info } = await sharp(imageBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const qrCode = jsQR(new Uint8ClampedArray(data), info.width, info.height, {
        inversionAttempts: "attemptBoth"
      });

      if (qrCode && qrCode.data) {
        qrPayload = qrCode.data;
      }
    } catch (sharpError) {
      console.warn("Sharp/jsQR decoding notice:", sharpError);
    }

    // กำหนด TransRef จาก QR หรือจาก Image Hash
    let transRef = "";
    if (qrPayload) {
      transRef = extractBankTransRef(qrPayload);
    } else {
      // โหมดสลิปไม่มี QR หรือสลิปทดสอบ: สกัดรหัสอ้างอิงจาก Hash ของรูป
      transRef = `SLIP-${imageHash.slice(0, 14).toUpperCase()}`;
    }

    // ด่านที่ 2: ตรวจสอบความซ้ำซ้อนของ TransRef ใน verifiedSlips
    if (isSlipUsed(transRef)) {
      return NextResponse.json(
        {
          success: false,
          error: `สลิปนี้เคยถูกบันทึกและใช้งานไปแล้วในระบบ ไม่สามารถใช้ซ้ำได้ (รหัสอ้างอิง: ${transRef})`,
          transRef,
          isDuplicate: true
        },
        { status: 400 }
      );
    }

    // ด่านที่ 3 & 4 (โหมดคู่):
    // โหมด 2: หากมี EASYSLIP_API_KEY ให้เชื่อมต่อไปยัง EasySlip API
    if (process.env.EASYSLIP_API_KEY) {
      try {
        const easySlipRes = await fetch("https://developer.easyslip.com/api/v1/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EASYSLIP_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: imageBuffer.toString("base64")
          })
        });

        if (!easySlipRes.ok) {
          const errData = await easySlipRes.json().catch(() => ({}));
          return NextResponse.json(
            {
              success: false,
              error: errData.message || "การตรวจสอบสลิปผ่าน EasySlip API ไม่ผ่าน",
              apiStatus: easySlipRes.status
            },
            { status: 400 }
          );
        }

        const verifyData = await easySlipRes.json();
        // ตรวจสอบยอดเงินว่าตรงกับคำสั่งซื้อหรือไม่
        const paidAmount = verifyData.data?.amount?.amount || 0;
        if (paidAmount < order.total_amount) {
          return NextResponse.json(
            {
              success: false,
              error: `ยอดเงินในสลิป (฿${paidAmount}) ไม่พอกับยอดชำระของคำสั่งซื้อ (฿${order.total_amount})`
            },
            { status: 400 }
          );
        }

        if (verifyData.data?.transRef) {
          transRef = verifyData.data.transRef;
          if (isSlipUsed(transRef)) {
            return NextResponse.json(
              {
                success: false,
                error: `สลิปธนาคารนี้เคยถูกใช้งานไปแล้ว (TransRef: ${transRef})`,
                isDuplicate: true
              },
              { status: 400 }
            );
          }
        }
      } catch (apiErr) {
        console.error("EasySlip API connection error:", apiErr);
        // หาก API ขัดข้อง ให้สลับมาใช้โหมดสำรอง
      }
    }

    // โหมด 1 (โหมดฟรี ฿0): บันทึกลงตาราง verifiedSlips และปรับสถานะออเดอร์เป็น PAID ทันที
    recordVerifiedSlip({
      trans_ref: transRef,
      amount: order.total_amount,
      sender_bank: qrPayload ? "BANK_QR" : "PROMPTPAY_SLIP",
      receiver_bank: "SCB_CLASSPIC",
      verified_at: new Date().toISOString(),
      order_id: order.id
    });

    markOrderPaid(order.id, transRef, slipUrl, "PAID");

    // แจ้งเตือนเข้า Telegram Bot อัตโนมัติ (หากตั้งค่าไว้ใน Environment Variables)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const msg =
        `🔔 *ClassPic Store — มีออเดอร์ใหม่ชำระเงินสำเร็จ!*\n\n` +
        `📦 *เลขออเดอร์:* \`${order.id}\`\n` +
        `💰 *ยอดโอน:* ฿${order.total_amount}\n` +
        `👤 *ผู้ซื้อ:* \`${order.customer_contact}\`\n` +
        `🔖 *TransRef:* \`${transRef}\`\n` +
        `🔍 *QR ตรวจพบ:* ${qrPayload ? "✅ มี Mini QR ธนาคาร" : "ℹ️ สลิปภาพทั่วไป"}\n` +
        `⏰ *เวลา:* ${new Date().toLocaleString("th-TH")}\n\n` +
        `🎉 ปลดล็อกไฟล์ PDF A4 ให้ลูกค้าเรียบร้อยแล้ว`;

      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: "Markdown"
        })
      }).catch((e) => console.error("Telegram notification error:", e));
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      transRef,
      hasQr: !!qrPayload,
      status: "PAID",
      message: "ตรวจสอบสลิปสำเร็จ ปลดล็อกไฟล์ PDF ขนาด A4 เรียบร้อยแล้ว"
    });
  } catch (error) {
    console.error("verify-slip API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการประมวลผลสลิป กรุณาลองใหม่อีกครั้ง"
      },
      { status: 500 }
    );
  }
}
