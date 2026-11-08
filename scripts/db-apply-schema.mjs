// รัน supabase/schema.sql ตรงเข้าฐานข้อมูล Supabase (ไม่ต้องผ่าน SQL Editor บนเว็บ)
// ใช้: node --env-file=.env.local scripts/db-apply-schema.mjs
// ต้องมี DATABASE_URL ใน .env.local (Supabase > Connect > Session pooler)
import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url || url.includes("[YOUR-PASSWORD]")) {
  console.error("ยังไม่ได้ตั้ง DATABASE_URL ใน .env.local (หรือยังไม่ได้แทน [YOUR-PASSWORD])");
  process.exit(1);
}

const sql = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  const tables = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' order by 1"
  );
  const rls = await client.query(
    "select relname, relrowsecurity from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' order by 1"
  );
  const buckets = await client.query("select id, public from storage.buckets order by id");
  console.log("✓ รัน schema สำเร็จ");
  console.log("ตาราง:", tables.rows.map((r) => r.table_name).join(", "));
  console.log("RLS:", rls.rows.map((r) => `${r.relname}=${r.relrowsecurity ? "เปิด" : "ปิด"}`).join(", "));
  console.log("ถังไฟล์:", buckets.rows.map((r) => `${r.id}(${r.public ? "สาธารณะ" : "ส่วนตัว"})`).join(", "));
} catch (err) {
  console.error("✗ ผิดพลาด:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
