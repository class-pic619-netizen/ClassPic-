/**
 * ค่าตั้งค่าหลังบ้านที่แอดมินแก้เองได้จากหน้า /admin (ไม่ต้องเข้า Vercel)
 * เก็บเป็นไฟล์ JSON ในถังลับ private-pdfs/_system/ — อ่าน/เขียนได้เฉพาะเซิร์ฟเวอร์ (service role)
 * จึงไม่ต้องสร้างตารางใหม่ในฐานข้อมูล
 */
import crypto from "crypto";
import { supabaseAdmin, BUCKETS } from "./supabaseAdmin";

const SETTINGS_PATH = "_system/admin-settings.json";

export interface PendingCode {
  purpose: "login" | "reset";
  nonce: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  sentAt: number;
}

export interface AdminSettings {
  /** รหัสผ่านที่ตั้งจากหน้าเว็บ (scrypt) — ถ้าไม่มีใช้ ADMIN_PASSWORD จาก env */
  passwordHash?: string;
  /** เพิ่มเลขทุกครั้งที่เปลี่ยนรหัส → ทุกเครื่องที่ล็อกอินค้างไว้หลุดทันที */
  sessionVersion: number;
  /** ขอรหัสยืนยันทาง Telegram ทุกครั้งที่ล็อกอิน */
  twoFactor: boolean;
  telegram?: { botToken?: string; chatId?: string };
  failedLogins: number;
  lockedUntil?: number;
  pending?: PendingCode;
}

const DEFAULTS: AdminSettings = { sessionVersion: 1, twoFactor: false, failedLogins: 0 };

export async function loadAdminSettings(): Promise<AdminSettings> {
  const { data, error } = await supabaseAdmin().storage.from(BUCKETS.pdfs).download(SETTINGS_PATH);
  if (error || !data) return { ...DEFAULTS }; // ยังไม่เคยบันทึก
  try {
    return { ...DEFAULTS, ...(JSON.parse(await data.text()) as Partial<AdminSettings>) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveAdminSettings(settings: AdminSettings): Promise<void> {
  const body = Buffer.from(JSON.stringify(settings));
  const { error } = await supabaseAdmin()
    .storage.from(BUCKETS.pdfs)
    .upload(SETTINGS_PATH, body, { contentType: "application/json", upsert: true, cacheControl: "0" });
  if (error) throw new Error(`บันทึกการตั้งค่าไม่ได้: ${error.message}`);
}

/* ---------------- รหัสผ่าน ---------------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

/** ตรวจรหัสผ่าน: ใช้รหัสที่ตั้งจากหน้าเว็บก่อน ถ้ายังไม่เคยตั้งใช้ ADMIN_PASSWORD จาก env */
export function verifyAdminPassword(settings: AdminSettings, input: unknown): boolean {
  if (typeof input !== "string" || !input) return false;
  if (settings.passwordHash) return verifyHash(input, settings.passwordHash);
  const envPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!envPassword) return false;
  const h = (v: string) => crypto.createHash("sha256").update(v).digest();
  return crypto.timingSafeEqual(h(input), h(envPassword));
}

export function passwordProblem(password: unknown): string | null {
  if (typeof password !== "string" || !password) return "กรุณากรอกรหัสผ่านใหม่";
  if (password.length < 10) return "รหัสผ่านใหม่ต้องยาวอย่างน้อย 10 ตัวอักษร";
  if (password.length > 128) return "รหัสผ่านยาวเกินไป";
  if (/^\d+$/.test(password)) return "อย่าใช้ตัวเลขล้วน ให้ผสมตัวอักษรด้วย";
  return null;
}

/* ---------------- กันเดารหัส ---------------- */

export const MAX_FAILED_LOGINS = 8;
export const LOCK_MINUTES = 15;

export function lockedMessage(s: AdminSettings): string | null {
  if (s.lockedUntil && s.lockedUntil > Date.now()) {
    const mins = Math.ceil((s.lockedUntil - Date.now()) / 60000);
    return `ใส่รหัสผิดหลายครั้ง ระบบล็อกไว้ชั่วคราว ลองใหม่ใน ${mins} นาที (หรือกด "ลืมรหัสผ่าน" เพื่อรีเซ็ตผ่าน Telegram)`;
  }
  return null;
}

/* ---------------- รหัสยืนยัน 6 หลักทาง Telegram ---------------- */

export const CODE_TTL_MS = 5 * 60 * 1000;
export const CODE_RESEND_MS = 60 * 1000;
export const CODE_MAX_ATTEMPTS = 5;

function hashCode(nonce: string, code: string): string {
  return crypto.createHash("sha256").update(`${nonce}:${code}`).digest("hex");
}

export function issueCode(s: AdminSettings, purpose: PendingCode["purpose"]): { code: string; nonce: string } {
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const nonce = crypto.randomBytes(16).toString("hex");
  s.pending = {
    purpose,
    nonce,
    codeHash: hashCode(nonce, code),
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0,
    sentAt: Date.now(),
  };
  return { code, nonce };
}

/** ขอรหัสใหม่ถี่เกินไปไหม (ไม่เกิน 1 ครั้งต่อนาที) */
export function resendWaitSeconds(s: AdminSettings): number {
  if (!s.pending) return 0;
  return Math.max(0, Math.ceil((s.pending.sentAt + CODE_RESEND_MS - Date.now()) / 1000));
}

/** ตรวจรหัส — คืนข้อความผิดพลาด หรือ null ถ้าถูกต้อง (และลบรหัสทิ้งเมื่อใช้แล้ว) */
export function checkCode(
  s: AdminSettings,
  purpose: PendingCode["purpose"],
  nonce: unknown,
  code: unknown
): string | null {
  const p = s.pending;
  if (!p || p.purpose !== purpose || typeof nonce !== "string" || p.nonce !== nonce) {
    return "รหัสยืนยันหมดอายุ กรุณาขอรหัสใหม่";
  }
  if (p.expiresAt < Date.now()) {
    s.pending = undefined;
    return "รหัสยืนยันหมดอายุ (5 นาที) กรุณาขอรหัสใหม่";
  }
  if (p.attempts >= CODE_MAX_ATTEMPTS) {
    s.pending = undefined;
    return "ใส่รหัสผิดเกินกำหนด กรุณาขอรหัสใหม่";
  }
  const clean = typeof code === "string" ? code.replace(/\D/g, "") : "";
  const a = Buffer.from(hashCode(nonce, clean));
  const b = Buffer.from(p.codeHash);
  if (clean.length !== 6 || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    p.attempts += 1;
    if (p.attempts >= CODE_MAX_ATTEMPTS) {
      s.pending = undefined;
      return "ใส่รหัสผิดเกินกำหนด กรุณาขอรหัสใหม่";
    }
    return `รหัสยืนยันไม่ถูกต้อง (เหลือ ${CODE_MAX_ATTEMPTS - p.attempts} ครั้ง)`;
  }
  s.pending = undefined;
  return null;
}

/* ---------------- Telegram ที่ใช้งานจริง (ตั้งในหน้าเว็บ > env) ---------------- */

export function telegramConfig(s: AdminSettings): { botToken?: string; chatId?: string } {
  return {
    botToken: s.telegram?.botToken || process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined,
    chatId: s.telegram?.chatId || process.env.TELEGRAM_CHAT_ID?.trim() || undefined,
  };
}
