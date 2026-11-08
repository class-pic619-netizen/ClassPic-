/**
 * ล็อกอินหลังบ้านด้วยคุกกี้ httpOnly ที่เซ็นด้วย HMAC (SEC.2)
 * - ไม่มีรหัสสำรองในโค้ด: ถ้าไม่ได้ตั้ง ADMIN_PASSWORD / DOWNLOAD_SECRET จะเข้าไม่ได้เลย (SEC.3)
 */
import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireEnv } from "./supabaseAdmin";

export const ADMIN_COOKIE = "cp_admin";
const SESSION_SECONDS = 60 * 60 * 12; // 12 ชั่วโมง

function sign(value: string): string {
  return crypto.createHmac("sha256", requireEnv("DOWNLOAD_SECRET")).update(`admin:${value}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function checkAdminPassword(input: string): boolean {
  const expected = requireEnv("ADMIN_PASSWORD");
  // เทียบ hash เพื่อให้ความยาวเท่ากันเสมอ
  const h = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
  return safeEqual(h(input), h(expected));
}

export function createSessionValue(): { value: string; maxAge: number } {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return { value: `${expires}.${sign(String(expires))}`, maxAge: SESSION_SECONDS };
}

export function isAdminRequest(req: NextRequest): boolean {
  const raw = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!raw) return false;
  const [expires, signature] = raw.split(".");
  if (!expires || !signature) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  try {
    return safeEqual(signature, sign(expires));
  } catch {
    return false;
  }
}

/** ใช้ต้น route หลังบ้าน: คืน response 401 ถ้ายังไม่ได้ล็อกอิน */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (isAdminRequest(req)) return null;
  return NextResponse.json({ success: false, message: "กรุณาเข้าสู่ระบบหลังบ้านก่อน" }, { status: 401 });
}
