import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import jsQR from "jsqr";
import crypto from "crypto";
import { getOrder, isSlipUsed, recordSlip, setOrderStatus, uploadSlipImage } from "@/lib/db";

const MAX_SLIP_BYTES = 8 * 1024 * 1024;

/** อ่านข้อมูลแบบ TLV (แท็ก 2 หลัก + ความยาว 2 หลัก + ค่า) ตามมาตรฐาน QR ของธนาคารไทย */
function parseTlv(input: string): Map<string, string> {
  const out = new Map<string, string>();
  let i = 0;
  while (i + 4 <= input.length) {
    const tag = input.slice(i, i + 2);
    const len = Number(input.slice(i + 2, i + 4));
    if (!Number.isFinite(len) || i + 4 + len > input.length) break;
    out.set(tag, input.slice(i + 4, i + 4 + len));
    i += 4 + len;
  }
  return out;
}

/**
 * ดึงรหัสอ้างอิงธุรกรรมจาก Mini QR บนสลิปธนาคารไทย
 * โครงสร้าง: แท็ก 00 = { 00: API ID "000001", 01: รหัสธนาคารผู้โอน, 02: รหัสธุรกรรม } , 51: "TH", 91: CRC
 * ถ้าไม่ใช่รูปแบบนี้ ใช้ hash ของข้อความ QR แทน (ยังกันสลิปซ้ำได้)
 */
function extractSlipRef(qrData: string): { transRef: string; bankCode?: string } {
  const top = parseTlv(qrData);
  const inner = top.get("00");
  if (inner && top.get("51") === "TH") {
    const sub = parseTlv(inner);
    const ref = sub.get("02");
    if (ref && /^[A-Za-z0-9]{8,40}$/.test(ref)) {
      return { transRef: ref.toUpperCase(), bankCode: sub.get("01") };
    }
  }
  return { transRef: `QR-${crypto.createHash("sha256").update(qrData).digest("hex").slice(0, 16).toUpperCase()}` };
}

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * รับสลิปโอนเงิน
 *
 * - โหมดฟรี (ไม่มี EASYSLIP_API_KEY): เก็บสลิป + จองรหัสอ้างอิง แล้วตั้งสถานะ PENDING_REVIEW
 *   ให้เจ้าของร้านกดอนุมัติในหน้า /admin ก่อน ไฟล์จึงจะเปิดให้โหลด (SEC.1)
 * - โหมดอัตโนมัติ (มี EASYSLIP_API_KEY): ถ้า EasySlip ยืนยันยอดเงินพอ → PAID ทันที
 *   ถ้า EasySlip ใช้ไม่ได้ชั่วคราว → ตกไปรอแอดมินตรวจเหมือนโหมดฟรี
 */
export async function POST(req: NextRequest) {
  try {
    let orderId = "";
    let image: Buffer | null = null;
    let contentType = "image/jpeg";

    if ((req.headers.get("content-type") || "").includes("multipart/form-data")) {
      const formData = await req.formData();
      orderId = String(formData.get("orderId") || "");
      const file = formData.get("slip") || formData.get("slipImage") || formData.get("file");
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const blob = file as Blob;
        contentType = blob.type || contentType;
        image = Buffer.from(await blob.arrayBuffer());
      }
    } else {
      const body = await req.json();
      orderId = String(body.orderId || "");
      if (typeof body.slipImageBase64 === "string") {
        const m = body.slipImageBase64.match(/^data:(image\/\w+);base64,/);
        if (m) contentType = m[1];
        image = Buffer.from(body.slipImageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
      }
    }

    if (!orderId) return json({ success: false, error: "ไม่พบเลขคำสั่งซื้อ" }, 400);

    const order = await getOrder(orderId);
    if (!order) return json({ success: false, error: `ไม่พบคำสั่งซื้อ ${orderId}` }, 404);

    if (order.status === "PAID" || order.status === "VERIFIED") {
      return json({ success: true, orderId: order.id, status: order.status, message: "คำสั่งซื้อนี้ชำระแล้ว ดาวน์โหลดได้เลย" });
    }
    if (order.status === "PENDING_REVIEW") {
      return json({ success: true, orderId: order.id, status: order.status, message: "ได้รับสลิปแล้ว รอร้านตรวจสอบ" });
    }

    // ใบงานฟรีทั้งหมด ไม่ต้องใช้สลิป
    if (order.total_amount === 0) {
      await setOrderStatus(order.id, "PAID", { trans_ref: `FREE-${order.id}` });
      return json({ success: true, orderId: order.id, status: "PAID", message: "รับใบงานฟรีได้เลย" });
    }

    if (!image || image.length === 0) return json({ success: false, error: "กรุณาแนบรูปสลิปการโอนเงิน" }, 400);
    if (image.length > MAX_SLIP_BYTES) return json({ success: false, error: "รูปสลิปใหญ่เกิน 8 MB" }, 400);
    if (!contentType.startsWith("image/")) return json({ success: false, error: "กรุณาแนบไฟล์รูปภาพเท่านั้น" }, 400);

    // ตรวจว่าเป็นรูปจริง และอ่าน Mini QR บนสลิป
    let qrPayload: string | null = null;
    try {
      const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const qr = jsQR(new Uint8ClampedArray(data), info.width, info.height, { inversionAttempts: "attemptBoth" });
      qrPayload = qr?.data ?? null;
    } catch {
      return json({ success: false, error: "เปิดรูปสลิปไม่ได้ กรุณาแนบเป็นไฟล์ JPG หรือ PNG" }, 400);
    }

    const imageHash = crypto.createHash("sha256").update(image).digest("hex");
    const slipRef = qrPayload ? extractSlipRef(qrPayload) : null;
    let transRef = slipRef?.transRef ?? `IMG-${imageHash.slice(0, 16).toUpperCase()}`;

    if (await isSlipUsed(transRef, imageHash)) {
      return json({ success: false, isDuplicate: true, error: "สลิปนี้เคยใช้กับคำสั่งซื้ออื่นไปแล้ว ใช้ซ้ำไม่ได้" }, 400);
    }

    // โหมดอัตโนมัติผ่าน EasySlip
    let autoApproved = false;
    let paidAmount = order.total_amount;
    if (process.env.EASYSLIP_API_KEY) {
      try {
        const res = await fetch("https://developer.easyslip.com/api/v1/verify", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.EASYSLIP_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ image: image.toString("base64") }),
        });
        if (res.ok) {
          const result = await res.json();
          const amount = Number(result.data?.amount?.amount || 0);
          if (amount < order.total_amount) {
            return json({ success: false, error: `ยอดในสลิป (฿${amount}) น้อยกว่ายอดที่ต้องชำระ (฿${order.total_amount})` }, 400);
          }
          if (result.data?.transRef) {
            transRef = String(result.data.transRef).toUpperCase();
            if (await isSlipUsed(transRef, imageHash)) {
              return json({ success: false, isDuplicate: true, error: "สลิปนี้เคยใช้กับคำสั่งซื้ออื่นไปแล้ว ใช้ซ้ำไม่ได้" }, 400);
            }
          }
          paidAmount = amount;
          autoApproved = true;
        } else if (res.status >= 400 && res.status < 500) {
          const err = await res.json().catch(() => ({}));
          return json({ success: false, error: err.message || "ตรวจสลิปไม่ผ่าน กรุณาตรวจสอบรูปสลิปอีกครั้ง" }, 400);
        }
        // 5xx: ระบบตรวจสลิปขัดข้อง → ให้แอดมินตรวจเอง
      } catch (e) {
        console.error("EasySlip error, falling back to manual review:", e);
      }
    }

    const slipPath = await uploadSlipImage(order.id, image, contentType);

    const reserved = await recordSlip({
      trans_ref: transRef,
      image_hash: imageHash,
      amount: paidAmount,
      order_id: order.id,
      sender_bank: slipRef?.bankCode ? `BANK-${slipRef.bankCode}` : qrPayload ? "QR_UNKNOWN" : "IMAGE_ONLY",
    });
    if (!reserved) {
      return json({ success: false, isDuplicate: true, error: "สลิปนี้เคยใช้กับคำสั่งซื้ออื่นไปแล้ว ใช้ซ้ำไม่ได้" }, 400);
    }

    const status = autoApproved ? "PAID" : "PENDING_REVIEW";
    await setOrderStatus(order.id, status, { trans_ref: transRef, slip_image_url: slipPath });

    notifyTelegram(
      autoApproved
        ? `ClassPic: ออเดอร์ ${order.id} ชำระแล้ว ฿${order.total_amount} (EasySlip ตรวจผ่าน)`
        : `ClassPic: มีสลิปใหม่รอตรวจ ออเดอร์ ${order.id} ฿${order.total_amount}\nผู้ซื้อ: ${order.customer_contact}\nQR บนสลิป: ${qrPayload ? "มี" : "ไม่พบ"}\nเข้าไปอนุมัติที่หน้า /admin`
    );

    return json({
      success: true,
      orderId: order.id,
      status,
      message: autoApproved
        ? "ตรวจสลิปผ่าน ดาวน์โหลดไฟล์ได้เลย"
        : "ได้รับสลิปแล้ว ร้านจะตรวจและเปิดให้ดาวน์โหลดโดยเร็ว",
    });
  } catch (error) {
    console.error("verify-slip error:", error);
    return json({ success: false, error: "เกิดข้อผิดพลาดในการรับสลิป กรุณาลองใหม่อีกครั้ง" }, 500);
  }
}

function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch((e) => console.error("Telegram notify error:", e));
}
