import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, setSessionCookie } from "@/lib/adminAuth";
import {
  hashPassword,
  loadAdminSettings,
  passwordProblem,
  saveAdminSettings,
  telegramConfig,
  verifyAdminPassword,
} from "@/lib/adminSettings";
import { sendTelegram } from "@/lib/telegram";

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

function maskToken(token?: string): string {
  if (!token) return "";
  const [id] = token.split(":");
  return `${id}:••••••${token.slice(-4)}`;
}

/** สถานะการตั้งค่า (ไม่ส่ง Token ตัวเต็มออกไปเด็ดขาด) */
export async function GET(req: NextRequest) {
  const s = await loadAdminSettings();
  if (!(await isAdminRequest(req, s))) return json({ success: false, message: "กรุณาเข้าสู่ระบบหลังบ้านก่อน" }, 401);
  const tg = telegramConfig(s);
  return json({
    success: true,
    passwordSource: s.passwordHash ? "web" : "env",
    twoFactor: s.twoFactor,
    telegram: {
      configured: Boolean(tg.botToken && tg.chatId),
      tokenMasked: maskToken(tg.botToken),
      tokenSource: s.telegram?.botToken ? "web" : tg.botToken ? "env" : "none",
      chatId: tg.chatId ?? "",
      chatSource: s.telegram?.chatId ? "web" : tg.chatId ? "env" : "none",
    },
  });
}

/**
 * ทุกการแก้ไขต้องใส่รหัสผ่านปัจจุบัน (กันคนที่แอบใช้เครื่องที่ล็อกอินค้างไว้)
 *  - change_password  { currentPassword, newPassword }
 *  - set_telegram     { currentPassword, botToken?, chatId? }   (ช่องที่เว้นว่าง = ใช้ค่าเดิม)
 *  - set_two_factor   { currentPassword, enabled }
 */
export async function PATCH(req: NextRequest) {
  try {
    const s = await loadAdminSettings();
    if (!(await isAdminRequest(req, s))) return json({ success: false, message: "กรุณาเข้าสู่ระบบหลังบ้านก่อน" }, 401);

    const body = await req.json().catch(() => ({}));
    if (!verifyAdminPassword(s, body.currentPassword)) {
      return json({ success: false, message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, 401);
    }

    if (body.action === "change_password") {
      const weak = passwordProblem(body.newPassword);
      if (weak) return json({ success: false, message: weak }, 400);
      if (body.newPassword === body.currentPassword) return json({ success: false, message: "รหัสใหม่ต้องไม่ซ้ำรหัสเดิม" }, 400);
      s.passwordHash = hashPassword(body.newPassword);
      s.sessionVersion += 1; // เครื่องอื่นที่ล็อกอินค้างไว้หลุดทั้งหมด
      await saveAdminSettings(s);
      const tg = telegramConfig(s);
      if (tg.botToken && tg.chatId) await sendTelegram("🔑 ClassPic: เปลี่ยนรหัสผ่านหลังบ้านแล้ว", tg);
      const res = json({ success: true, message: "เปลี่ยนรหัสผ่านแล้ว เครื่องอื่นที่ล็อกอินค้างไว้ถูกออกจากระบบ" });
      setSessionCookie(res, s); // เครื่องนี้ยังอยู่ในระบบต่อ
      return res;
    }

    if (body.action === "set_telegram") {
      const botToken = typeof body.botToken === "string" ? body.botToken.trim() : "";
      const chatId = typeof body.chatId === "string" ? body.chatId.trim() : "";
      if (botToken && !/^\d{5,15}:[A-Za-z0-9_-]{30,}$/.test(botToken)) {
        return json({ success: false, message: "รูปแบบ Bot Token ไม่ถูกต้อง (ควรเป็น ตัวเลข:ตัวอักษรยาว ๆ จาก BotFather)" }, 400);
      }
      if (chatId && !/^-?\d{3,20}$/.test(chatId)) {
        return json({ success: false, message: "Chat ID ต้องเป็นตัวเลข" }, 400);
      }
      if (!botToken && !chatId) return json({ success: false, message: "กรอก Token หรือ Chat ID อย่างน้อย 1 ช่อง" }, 400);

      const next = { ...s.telegram };
      if (botToken) next.botToken = botToken;
      if (chatId) next.chatId = chatId;
      const merged = { botToken: next.botToken || telegramConfig(s).botToken, chatId: next.chatId || telegramConfig(s).chatId };

      // ถ้าครบทั้งคู่ ลองส่งจริงก่อนบันทึก จะได้รู้ทันทีว่าใช้ได้
      if (merged.botToken && merged.chatId) {
        const r = await sendTelegram("🔔 ClassPic: เชื่อมต่อ Telegram สำเร็จ ต่อไปจะแจ้งเตือนมาที่นี่ครับ", merged);
        if (!r.ok) return json({ success: false, message: `ยังไม่ได้บันทึก — ส่งข้อความไม่สำเร็จ: ${r.error}` }, 400);
      }
      s.telegram = next;
      await saveAdminSettings(s);
      return json({
        success: true,
        message: merged.botToken && merged.chatId ? "บันทึกแล้ว และส่งข้อความทดสอบเข้า Telegram แล้ว" : "บันทึก Token แล้ว ต่อไปกดหาเลข Chat ID",
      });
    }

    if (body.action === "set_two_factor") {
      const enabled = Boolean(body.enabled);
      const tg = telegramConfig(s);
      if (enabled && !(tg.botToken && tg.chatId)) {
        return json({ success: false, message: "ต้องตั้ง Telegram ให้ใช้ได้ก่อน จึงจะเปิดรหัสยืนยัน 2 ชั้นได้" }, 400);
      }
      s.twoFactor = enabled;
      await saveAdminSettings(s);
      return json({
        success: true,
        message: enabled ? "เปิดแล้ว: ล็อกอินครั้งต่อไปต้องใส่รหัส 6 หลักจาก Telegram" : "ปิดรหัสยืนยัน 2 ชั้นแล้ว",
      });
    }

    return json({ success: false, message: "action ไม่ถูกต้อง" }, 400);
  } catch (error) {
    console.error("admin settings error:", error);
    return json({ success: false, message: "บันทึกการตั้งค่าไม่สำเร็จ" }, 500);
  }
}
