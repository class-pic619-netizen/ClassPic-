import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin, BUCKETS } from "@/lib/supabaseAdmin";

/**
 * ADM.1 — ขอลิงก์อัปโหลดชั่วคราวให้เบราว์เซอร์ส่งไฟล์ตรงเข้า Supabase Storage
 * (ไม่ผ่านเซิร์ฟเวอร์ของเรา จึงไม่ติดเพดานขนาดคำขอ 4.5 MB ของ Vercel)
 *
 * kind = "pdf"   → ถังลับ private-pdfs (ไฟล์ใบงานตัวเต็ม ห้ามเป็นสาธารณะ)
 * kind = "image" → ถัง public-previews (รูปตัวอย่างหน้าร้าน แสดงพร้อมลายน้ำ)
 */
const RULES = {
  pdf: { bucket: BUCKETS.pdfs, maxBytes: 50 * 1024 * 1024, types: ["application/pdf"], exts: ["pdf"] },
  image: {
    bucket: BUCKETS.previews,
    maxBytes: 8 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp"],
    exts: ["jpg", "jpeg", "png", "webp"],
  },
} as const;

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json().catch(() => ({}));
    const kind = body.kind === "pdf" || body.kind === "image" ? (body.kind as keyof typeof RULES) : null;
    if (!kind) return NextResponse.json({ success: false, message: "ชนิดไฟล์ไม่ถูกต้อง" }, { status: 400 });

    const rule = RULES[kind];
    const contentType = String(body.contentType || "");
    const size = Number(body.size) || 0;
    const ext = String(body.filename || "").split(".").pop()?.toLowerCase() || "";

    if (!(rule.types as readonly string[]).includes(contentType) || !(rule.exts as readonly string[]).includes(ext)) {
      return NextResponse.json(
        { success: false, message: kind === "pdf" ? "ต้องเป็นไฟล์ PDF เท่านั้น" : "รูปต้องเป็น JPG, PNG หรือ WEBP" },
        { status: 400 }
      );
    }
    if (size <= 0 || size > rule.maxBytes) {
      return NextResponse.json(
        { success: false, message: `ไฟล์ใหญ่เกิน ${Math.round(rule.maxBytes / 1024 / 1024)} MB` },
        { status: 400 }
      );
    }

    // ตั้งชื่อไฟล์เองแบบสุ่ม (ไม่ใช้ชื่อเดิมจากเครื่อง กันชื่อภาษาไทย/อักขระแปลก และเดาชื่อไม่ได้)
    const month = new Date().toISOString().slice(0, 7);
    const path = `${kind === "pdf" ? "worksheets" : "previews"}/${month}/${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`;

    const { data, error } = await supabaseAdmin().storage.from(rule.bucket).createSignedUploadUrl(path);
    if (error || !data) throw new Error(error?.message || "สร้างลิงก์อัปโหลดไม่ได้");

    return NextResponse.json({ success: true, path: data.path, uploadUrl: data.signedUrl, contentType });
  } catch (error) {
    console.error("admin uploads POST error:", error);
    return NextResponse.json({ success: false, message: "สร้างลิงก์อัปโหลดไม่ได้ ตรวจการตั้งค่า Supabase" }, { status: 500 });
  }
}
