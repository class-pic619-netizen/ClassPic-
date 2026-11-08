import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { findRecentChats, isTelegramConfigured, sendTelegram } from "@/lib/telegram";

/** สถานะการตั้งค่า Telegram (ไม่ส่งค่า token ออกไป) */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({
    success: true,
    hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim()),
    hasChatId: Boolean(process.env.TELEGRAM_CHAT_ID?.trim()),
    configured: isTelegramConfigured(),
  });
}

/**
 * action = "test"      → ส่งข้อความทดสอบ (ใช้ chatId ที่ส่งมา ถ้ายังไม่ได้ตั้ง TELEGRAM_CHAT_ID)
 * action = "find_chat" → ดูห้องแชตที่เพิ่งทักบอท เพื่อหาเลข Chat ID
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  if (body.action === "find_chat") {
    const r = await findRecentChats();
    return NextResponse.json({ success: r.ok, chats: r.chats, message: r.error });
  }
  if (body.action === "test") {
    const chatId = typeof body.chatId === "string" && /^-?\d{3,20}$/.test(body.chatId.trim()) ? body.chatId.trim() : undefined;
    const r = await sendTelegram("🔔 ClassPic: ทดสอบการแจ้งเตือนสำเร็จ ต่อไปจะได้รับข้อความเมื่อมีสลิปใหม่หรือมีคนรับใบงานฟรีครับ", chatId);
    return NextResponse.json({ success: r.ok, message: r.ok ? "ส่งข้อความทดสอบแล้ว เช็กใน Telegram ได้เลย" : r.error });
  }
  return NextResponse.json({ success: false, message: "action ไม่ถูกต้อง" }, { status: 400 });
}
