/**
 * ล็อกอินหลังบ้านด้วยคุกกี้ httpOnly ที่เซ็นด้วย HMAC (SEC.2)
 * - ไม่มีรหัสสำรองในโค้ด (SEC.3): รหัสมาจากที่แอดมินตั้งในหน้าเว็บ หรือ ADMIN_PASSWORD
 * - คุกกี้ผูกกับ sessionVersion: เปลี่ยนรหัสเมื่อไร ทุกเครื่องที่ล็อกอินค้างไว้หลุดทันที (ADM.2)
 */
import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireEnv } from "./supabaseAdmin";
import { loadAdminSettings, type AdminSettings } from "./adminSettings";

export const ADMIN_COOKIE = "cp_admin";
const SESSION_SECONDS = 60 * 60 * 12; // 12 ชั่วโมง

function sign(expires: string, version: string): string {
  return crypto
    .createHmac("sha256", requireEnv("DOWNLOAD_SECRET"))
    .update(`admin:${expires}:${version}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function setSessionCookie(res: NextResponse, settings: AdminSettings): void {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const version = String(settings.sessionVersion);
  res.cookies.set(ADMIN_COOKIE, `${expires}.${version}.${sign(expires, version)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function isAdminRequest(req: NextRequest, settings?: AdminSettings): Promise<boolean> {
  const raw = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!raw) return false;
  const [expires, version, signature] = raw.split(".");
  if (!expires || !version || !signature) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  try {
    if (!safeEqual(signature, sign(expires, version))) return false;
    const s = settings ?? (await loadAdminSettings());
    return String(s.sessionVersion) === version;
  } catch {
    return false;
  }
}

/** ใช้ต้น route หลังบ้าน: คืน response 401 ถ้ายังไม่ได้ล็อกอิน */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  if (await isAdminRequest(req)) return null;
  return NextResponse.json({ success: false, message: "กรุณาเข้าสู่ระบบหลังบ้านก่อน" }, { status: 401 });
}
