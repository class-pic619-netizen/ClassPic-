// ใส่ใบงานตัวอย่าง (จาก src/data/mockProducts.ts) ลงตาราง products ถ้ายังไม่มี slug นั้น
// ใช้: node --env-file=.env.local scripts/seed-products.mjs
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const src = await readFile(new URL("../src/data/mockProducts.ts", import.meta.url), "utf8");
const js = src.replace(/^import .*$/m, "").replace(/: Product\[\]/, "");
const { MOCK_PRODUCTS } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const rows = MOCK_PRODUCTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  grade_level: p.grade_level,
  subject: p.subject,
  page_count: p.page_count,
  has_answer_key: p.has_answer_key,
  price: p.price,
  original_price: p.original_price || null,
  is_free_sample: Boolean(p.is_free_sample),
  is_coming_soon: Boolean(p.is_coming_soon),
  cover_image: "", // ยังไม่มีรูปสแกนจริง — หน้าเว็บวาดหน้าใบงานจำลองแทน
  preview_images: [],
  tags: p.tags || [],
}));

const { data, error } = await db.from("products").upsert(rows, { onConflict: "slug", ignoreDuplicates: true }).select("slug");
if (error) {
  console.error("✗", error.message);
  process.exit(1);
}
console.log(`✓ เพิ่มใบงานใหม่ ${data.length} ชุด (ชุดที่มีอยู่แล้วข้าม)`);
const { count } = await db.from("products").select("*", { count: "exact", head: true });
console.log(`รวมในฐานข้อมูล ${count} ชุด`);
