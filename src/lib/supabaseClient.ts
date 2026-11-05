import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase Client สำหรับฝั่ง Client และ Public Queries
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * ตรวจสอบว่าระบบเชื่อมต่อกับ Supabase อยู่หรือไม่
 */
export function isSupabaseConnected(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
