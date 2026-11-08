/**
 * แจ้งเตือนเจ้าของร้านผ่าน Telegram Bot (ฝั่งเซิร์ฟเวอร์เท่านั้น)
 * ตั้งค่า TELEGRAM_BOT_TOKEN (จาก @BotFather) และ TELEGRAM_CHAT_ID (ห้องแชตของเจ้าของร้าน)
 * ถ้าไม่ได้ตั้งค่า ระบบจะข้ามการแจ้งเตือนเงียบ ๆ ร้านยังทำงานได้ปกติ
 */
import { after } from "next/server";

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim());
}

function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : "";
}

/** ลิงก์หน้าหลังบ้าน (ถ้ารู้โดเมนของเว็บ) */
export function adminLink(): string {
  const base = siteUrl();
  return base ? `${base}/admin` : "หน้า /admin";
}

/** ส่งข้อความทันทีและรอผล (ใช้กับปุ่มทดสอบในหลังบ้าน) */
export async function sendTelegram(
  text: string,
  chatIdOverride?: string
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = (chatIdOverride || process.env.TELEGRAM_CHAT_ID || "").trim();
  if (!token) return { ok: false, error: "ยังไม่ได้ตั้งค่า TELEGRAM_BOT_TOKEN" };
  if (!chatId) return { ok: false, error: "ยังไม่ได้ตั้งค่า TELEGRAM_CHAT_ID" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
    if (!res.ok || !data.ok) return { ok: false, error: data.description || `Telegram ตอบกลับ ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "ส่งข้อความไม่สำเร็จ" };
  }
}

/** แจ้งเตือนแบบไม่หน่วงการตอบลูกค้า (ทำงานหลังส่ง response แล้ว ใช้ได้บน Vercel) */
export function notifyOwner(text: string): void {
  if (!isTelegramConfigured()) return;
  after(async () => {
    const r = await sendTelegram(text);
    if (!r.ok) console.error("Telegram notify error:", r.error);
  });
}

/** ห้องแชตที่เพิ่งทักบอท — ช่วยหา TELEGRAM_CHAT_ID โดยไม่ต้องใช้เครื่องมืออื่น */
export async function findRecentChats(): Promise<{ ok: boolean; chats: { id: string; name: string }[]; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return { ok: false, chats: [], error: "ยังไม่ได้ตั้งค่า TELEGRAM_BOT_TOKEN" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`, { signal: AbortSignal.timeout(8000) });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      description?: string;
      result?: { message?: { chat?: { id: number; first_name?: string; last_name?: string; title?: string; username?: string } } }[];
    };
    if (!data.ok) return { ok: false, chats: [], error: data.description || "Token ไม่ถูกต้อง" };
    const map = new Map<string, string>();
    for (const u of data.result ?? []) {
      const c = u.message?.chat;
      if (!c) continue;
      const name = c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || "ไม่มีชื่อ";
      map.set(String(c.id), name);
    }
    return { ok: true, chats: Array.from(map, ([id, name]) => ({ id, name })) };
  } catch (e) {
    return { ok: false, chats: [], error: e instanceof Error ? e.message : "เชื่อมต่อ Telegram ไม่ได้" };
  }
}

export function baht(n: number): string {
  return `฿${n.toLocaleString("th-TH")}`;
}
