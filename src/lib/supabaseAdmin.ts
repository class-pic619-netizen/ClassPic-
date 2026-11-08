import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * อ่านค่า environment ที่จำเป็น ถ้าไม่มีให้ล้มทันที (ไม่มีค่าสำรองในโค้ดเด็ดขาด — SEC.3)
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing environment variable ${name} (ตั้งค่าใน .env.local หรือ Vercel)`);
  }
  return value.trim();
}

let adminClient: SupabaseClient | null = null;

/**
 * Supabase client ฝั่งเซิร์ฟเวอร์เท่านั้น — ใช้ secret/service_role key ซึ่งข้าม RLS ได้
 * ห้าม import ไฟล์นี้ใน Client Component
 */
export function supabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin() must only run on the server");
  }
  if (!adminClient) {
    adminClient = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return adminClient;
}

export const BUCKETS = {
  previews: "public-previews",
  pdfs: "private-pdfs",
  slips: "payment-slips",
} as const;
