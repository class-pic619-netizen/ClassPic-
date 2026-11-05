import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || "admin1234";

    if (password === expectedPassword) {
      return NextResponse.json({
        success: true,
        message: "เข้าสู่ระบบสำเร็จ",
        token: Buffer.from(`classpic-admin-session-${Date.now()}`).toString("base64"),
      });
    }

    return NextResponse.json(
      { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน" },
      { status: 500 }
    );
  }
}
