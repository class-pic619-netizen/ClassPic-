import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkAdminPassword, createSessionValue, isAdminRequest } from "@/lib/adminAuth";

/** ตรวจว่ายังล็อกอินอยู่ไหม */
export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: isAdminRequest(req) });
}

/** ล็อกอิน */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (typeof password !== "string" || !checkAdminPassword(password)) {
      return NextResponse.json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const session = createSessionValue();
    const res = NextResponse.json({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
    res.cookies.set(ADMIN_COOKIE, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: session.maxAge,
    });
    return res;
  } catch (error) {
    console.error("admin auth error:", error);
    return NextResponse.json(
      { success: false, message: "ระบบหลังบ้านยังตั้งค่าไม่ครบ (ADMIN_PASSWORD / DOWNLOAD_SECRET)" },
      { status: 500 }
    );
  }
}

/** ออกจากระบบ */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
