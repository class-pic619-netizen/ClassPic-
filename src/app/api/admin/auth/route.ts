import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, isAdminRequest, setSessionCookie } from "@/lib/adminAuth";
import {
  LOCK_MINUTES,
  MAX_FAILED_LOGINS,
  checkCode,
  hashPassword,
  issueCode,
  loadAdminSettings,
  lockedMessage,
  passwordProblem,
  resendWaitSeconds,
  saveAdminSettings,
  telegramConfig,
  verifyAdminPassword,
  type AdminSettings,
} from "@/lib/adminSettings";
import { sendTelegram } from "@/lib/telegram";

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

function hasTelegram(s: AdminSettings): boolean {
  const t = telegramConfig(s);
  return Boolean(t.botToken && t.chatId);
}

/** ตรวจว่ายังล็อกอินอยู่ไหม + มีปุ่ม "ลืมรหัสผ่าน" ให้ใช้ไหม */
export async function GET(req: NextRequest) {
  try {
    const s = await loadAdminSettings();
    return json({ authenticated: await isAdminRequest(req, s), canResetViaTelegram: hasTelegram(s) });
  } catch {
    return json({ authenticated: false, canResetViaTelegram: false });
  }
}

/**
 * action:
 *  - (ไม่ระบุ) / "login"  { password }            → เข้าระบบ หรือส่งรหัสยืนยันทาง Telegram ถ้าเปิด 2 ชั้น
 *  - "verify_login"       { nonce, code }         → ยืนยันรหัส 6 หลักตอนล็อกอิน
 *  - "forgot"                                     → ส่งรหัสรีเซ็ตเข้า Telegram
 *  - "reset"              { nonce, code, newPassword } → ตั้งรหัสใหม่
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = typeof body.action === "string" ? body.action : "login";
    const s = await loadAdminSettings();

    if (action === "login") {
      const locked = lockedMessage(s);
      if (locked) return json({ success: false, message: locked }, 429);

      if (!verifyAdminPassword(s, body.password)) {
        s.failedLogins += 1;
        if (s.failedLogins >= MAX_FAILED_LOGINS) {
          s.failedLogins = 0;
          s.lockedUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
          await saveAdminSettings(s);
          const tg = telegramConfig(s);
          if (tg.botToken && tg.chatId) {
            await sendTelegram(`⚠️ ClassPic: มีคนใส่รหัสหลังบ้านผิด ${MAX_FAILED_LOGINS} ครั้ง ระบบล็อกไว้ ${LOCK_MINUTES} นาที`, tg);
          }
          return json({ success: false, message: lockedMessage(s) }, 429);
        }
        await saveAdminSettings(s);
        return json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" }, 401);
      }

      const hadFailures = s.failedLogins > 0 || Boolean(s.lockedUntil);
      s.failedLogins = 0;
      s.lockedUntil = undefined;

      if (s.twoFactor && hasTelegram(s)) {
        const { code, nonce } = issueCode(s, "login");
        await saveAdminSettings(s);
        const sent = await sendTelegram(`🔐 ClassPic: รหัสเข้าหลังบ้าน ${code}\n(ใช้ได้ 5 นาที ถ้าไม่ได้ล็อกอินเอง ให้เปลี่ยนรหัสผ่านทันที)`, telegramConfig(s));
        if (!sent.ok) return json({ success: false, message: `ส่งรหัสเข้า Telegram ไม่ได้: ${sent.error}` }, 502);
        return json({ success: true, needCode: true, nonce, message: "ส่งรหัส 6 หลักเข้า Telegram แล้ว" });
      }

      if (hadFailures) await saveAdminSettings(s).catch((e) => console.error("reset failed-login counter:", e));
      const res = json({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
      setSessionCookie(res, s);
      return res;
    }

    if (action === "verify_login") {
      const problem = checkCode(s, "login", body.nonce, body.code);
      await saveAdminSettings(s);
      if (problem) return json({ success: false, message: problem }, 401);
      const res = json({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
      setSessionCookie(res, s);
      return res;
    }

    if (action === "forgot") {
      if (!hasTelegram(s)) {
        return json(
          {
            success: false,
            message:
              "ยังไม่ได้ตั้ง Telegram จึงรีเซ็ตผ่านหน้าเว็บไม่ได้ — ให้ตั้งค่า ADMIN_PASSWORD ใหม่ใน Vercel แล้วกด Redeploy",
          },
          400
        );
      }
      const wait = resendWaitSeconds(s);
      if (wait > 0) return json({ success: false, message: `รอ ${wait} วินาทีแล้วค่อยขอรหัสใหม่` }, 429);
      const { code, nonce } = issueCode(s, "reset");
      await saveAdminSettings(s);
      const sent = await sendTelegram(`🔑 ClassPic: รหัสตั้งรหัสผ่านหลังบ้านใหม่ ${code}\n(ใช้ได้ 5 นาที ถ้าไม่ได้ขอเอง ไม่ต้องทำอะไร)`, telegramConfig(s));
      if (!sent.ok) return json({ success: false, message: `ส่งรหัสเข้า Telegram ไม่ได้: ${sent.error}` }, 502);
      return json({ success: true, nonce, message: "ส่งรหัส 6 หลักเข้า Telegram แล้ว" });
    }

    if (action === "reset") {
      const weak = passwordProblem(body.newPassword);
      if (weak) return json({ success: false, message: weak }, 400);
      const problem = checkCode(s, "reset", body.nonce, body.code);
      if (problem) {
        await saveAdminSettings(s);
        return json({ success: false, message: problem }, 401);
      }
      s.passwordHash = hashPassword(body.newPassword);
      s.sessionVersion += 1;
      s.failedLogins = 0;
      s.lockedUntil = undefined;
      await saveAdminSettings(s);
      await sendTelegram("✅ ClassPic: ตั้งรหัสผ่านหลังบ้านใหม่เรียบร้อย เครื่องที่ล็อกอินค้างไว้ถูกออกจากระบบทั้งหมด", telegramConfig(s));
      const res = json({ success: true, message: "ตั้งรหัสผ่านใหม่แล้ว เข้าสู่ระบบให้เลย" });
      setSessionCookie(res, s);
      return res;
    }

    return json({ success: false, message: "action ไม่ถูกต้อง" }, 400);
  } catch (error) {
    console.error("admin auth error:", error);
    return json(
      { success: false, message: "ระบบหลังบ้านยังตั้งค่าไม่ครบ (Supabase / ADMIN_PASSWORD / DOWNLOAD_SECRET)" },
      500
    );
  }
}

/** ออกจากระบบ */
export async function DELETE() {
  const res = json({ success: true });
  clearSessionCookie(res);
  return res;
}
