/**
 * แจ้งเตือนเจ้าของร้านผ่าน Telegram Bot (ฝั่งเซิร์ฟเวอร์เท่านั้น)
 * ตั้งค่า Token/Chat ID ได้ 2 ทาง: หน้า /admin แท็บ "แจ้งเตือน Telegram" (แนะนำ ทำในมือถือได้)
 * หรือ env TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID — ค่าที่ตั้งในหน้าเว็บใช้ก่อน
 * ถ้าไม่ได้ตั้งค่า ระบบจะข้ามการแจ้งเตือนเงียบ ๆ ร้านยังทำงานได้ปกติ
 */
import { after } from "next/server";
import { loadAdminSettings, telegramConfig, type AdminSettings } from "./adminSettings";

/** เปลี่ยนได้เฉพาะตอนทดสอบระบบ (ชี้ไปเซิร์ฟเวอร์จำลอง) */
const TELEGRAM_API = (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/$/, "");

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

export async function getTelegramConfig(settings?: AdminSettings) {
  return telegramConfig(settings ?? (await loadAdminSettings()));
}

/** ส่งข้อความทันทีและรอผล */
export async function sendTelegram(
  text: string,
  opts: { chatId?: string; botToken?: string; settings?: AdminSettings } = {}
): Promise<{ ok: boolean; error?: string }> {
  const cfg = opts.botToken && opts.chatId ? opts : { ...(await getTelegramConfig(opts.settings)), ...stripEmpty(opts) };
  const token = cfg.botToken?.trim();
  const chatId = cfg.chatId?.trim();
  if (!token) return { ok: false, error: "ยังไม่ได้ใส่ Bot Token" };
  if (!chatId) return { ok: false, error: "ยังไม่ได้ใส่ Chat ID" };
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
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

function stripEmpty(o: { chatId?: string; botToken?: string }) {
  const out: { chatId?: string; botToken?: string } = {};
  if (o.chatId) out.chatId = o.chatId;
  if (o.botToken) out.botToken = o.botToken;
  return out;
}

/** แจ้งเตือนแบบไม่หน่วงการตอบลูกค้า (ทำงานหลังส่ง response แล้ว ใช้ได้บน Vercel) */
export function notifyOwner(text: string): void {
  after(async () => {
    try {
      const cfg = await getTelegramConfig();
      if (!cfg.botToken || !cfg.chatId) return;
      const r = await sendTelegram(text, cfg);
      if (!r.ok) console.error("Telegram notify error:", r.error);
    } catch (e) {
      console.error("Telegram notify error:", e);
    }
  });
}

/** ห้องแชตที่เพิ่งทักบอท — ช่วยหา Chat ID โดยไม่ต้องใช้เครื่องมืออื่น */
export async function findRecentChats(
  botToken?: string
): Promise<{ ok: boolean; chats: { id: string; name: string }[]; error?: string }> {
  const token = botToken?.trim() || (await getTelegramConfig()).botToken;
  if (!token) return { ok: false, chats: [], error: "ยังไม่ได้ใส่ Bot Token" };
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/getUpdates`, { signal: AbortSignal.timeout(8000) });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      description?: string;
      result?: {
        message?: { chat?: { id: number; first_name?: string; last_name?: string; title?: string; username?: string } };
      }[];
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
