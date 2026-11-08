/**
 * ชั้นข้อมูลของร้าน — อ่าน/เขียน Supabase ผ่าน service role (ฝั่งเซิร์ฟเวอร์เท่านั้น)
 * แทนที่ ordersStore / productsStore เดิมที่เก็บในหน่วยความจำ
 */
import crypto from "crypto";
import { cacheLife, cacheTag } from "next/cache";
import { supabaseAdmin, BUCKETS } from "./supabaseAdmin";
import type { CartItem, GradeLevel, Order, OrderStatus, Product, SubjectCategory } from "@/types";

export const PRODUCTS_TAG = "products";

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  grade_level: string;
  subject: string;
  page_count: number;
  has_answer_key: boolean;
  price: number | string;
  original_price: number | string | null;
  is_free_sample: boolean;
  is_coming_soon: boolean;
  cover_image: string;
  preview_images: string[] | null;
  pdf_file_url: string | null;
  tags: string[] | null;
  is_published: boolean;
  created_at: string;
}

/** แปลง path ในถัง public-previews เป็น URL สาธารณะ (ค่าที่เป็น URL/พาธเว็บอยู่แล้วใช้ตามเดิม) */
function previewUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//.test(pathOrUrl) || pathOrUrl.startsWith("/")) return pathOrUrl;
  return supabaseAdmin().storage.from(BUCKETS.previews).getPublicUrl(pathOrUrl).data.publicUrl;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    grade_level: row.grade_level as GradeLevel,
    subject: row.subject as SubjectCategory,
    page_count: row.page_count,
    has_answer_key: row.has_answer_key,
    price: Number(row.price),
    original_price: row.original_price == null ? undefined : Number(row.original_price),
    is_free_sample: row.is_free_sample,
    is_coming_soon: row.is_coming_soon,
    cover_image: previewUrl(row.cover_image),
    preview_images: (row.preview_images ?? []).map(previewUrl),
    pdf_file_url: row.pdf_file_url ?? undefined,
    tags: row.tags ?? [],
    created_at: row.created_at,
  };
}

/** ใบงานที่เปิดแสดงหน้าร้าน (แคชไว้ ล้างด้วย revalidateTag(PRODUCTS_TAG) เมื่อแอดมินแก้ไข) */
export async function getPublishedProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(PRODUCTS_TAG);

  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`โหลดรายการใบงานไม่ได้: ${error.message}`);
  return (data as ProductRow[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getPublishedProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

/** ทุกชุด รวมที่ซ่อนไว้ (สำหรับหลังบ้าน ไม่แคช) */
export async function getAllProductsForAdmin(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(toProduct);
}

export type NewProductInput = Omit<Product, "id" | "created_at">;

export async function insertProduct(input: NewProductInput): Promise<Product> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .insert({
      slug: input.slug,
      title: input.title,
      description: input.description,
      grade_level: input.grade_level,
      subject: input.subject,
      page_count: input.page_count,
      has_answer_key: input.has_answer_key,
      price: input.price,
      original_price: input.original_price ?? null,
      is_free_sample: Boolean(input.is_free_sample),
      is_coming_soon: Boolean(input.is_coming_soon),
      cover_image: input.cover_image ?? "",
      preview_images: input.preview_images ?? [],
      pdf_file_url: input.pdf_file_url ?? null,
      tags: input.tags ?? [],
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toProduct(data as ProductRow);
}

export async function updateProduct(id: string, patch: Partial<ProductRow>): Promise<boolean> {
  const { data, error } = await supabaseAdmin().from("products").update(patch).eq("id", id).select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

export async function deleteProductById(id: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin().from("products").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

interface OrderItemRow {
  product_id: string | null;
  product_title: string;
  price: number | string;
  quantity: number;
  products: ProductRow | null;
}

interface OrderRow {
  id: string;
  customer_contact: string;
  total_amount: number | string;
  status: OrderStatus;
  trans_ref: string | null;
  slip_image_url: string | null;
  paid_at: string | null;
  created_at: string;
  order_items: OrderItemRow[];
}

const ORDER_SELECT = "*, order_items(product_id, product_title, price, quantity, products(*))";

function toOrder(row: OrderRow): Order {
  const items: CartItem[] = row.order_items.map((item) => {
    const product: Product = item.products
      ? toProduct(item.products)
      : {
          // ใบงานถูกลบไปแล้ว — ยังแสดงชื่อในประวัติได้
          id: item.product_id ?? "deleted",
          slug: "",
          title: item.product_title,
          description: "",
          grade_level: "ป.1-ป.3",
          subject: "ศิลปะและกิจกรรม",
          page_count: 0,
          has_answer_key: false,
          price: Number(item.price),
          cover_image: "",
          preview_images: [],
          tags: [],
          created_at: row.created_at,
        };
    return { product: { ...product, price: Number(item.price) }, quantity: item.quantity };
  });

  return {
    id: row.id,
    customer_contact: row.customer_contact,
    total_amount: Number(row.total_amount),
    status: row.status,
    items,
    slip_image_url: row.slip_image_url ?? undefined,
    trans_ref: row.trans_ref ?? undefined,
    paid_at: row.paid_at ?? undefined,
    created_at: row.created_at,
  };
}

/** เลขคำสั่งซื้อแบบเดายาก: CP-YYYYMMDD-XXXXXXXX */
export function generateOrderId(): string {
  const yyyymmdd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(8);
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `CP-${yyyymmdd}-${suffix}`;
}

export class OrderInputError extends Error {}

/**
 * สร้างคำสั่งซื้อ — ราคาคิดจากฐานข้อมูลเสมอ ไม่เชื่อยอดเงินที่ส่งมาจากเบราว์เซอร์
 */
export async function createOrder(contact: string, productIds: string[]): Promise<Order> {
  const cleanContact = contact.trim();
  if (!cleanContact || cleanContact.length > 120) throw new OrderInputError("กรุณากรอกเบอร์โทรหรืออีเมลให้ถูกต้อง");

  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));
  if (uniqueIds.length === 0) throw new OrderInputError("ไม่มีใบงานในคำสั่งซื้อ");

  const products = (await getPublishedProducts()).filter((p) => uniqueIds.includes(p.id));
  if (products.length !== uniqueIds.length) throw new OrderInputError("มีใบงานบางชุดที่ไม่พบในร้าน กรุณารีเฟรชแล้วลองใหม่");
  if (products.some((p) => p.is_coming_soon)) throw new OrderInputError("มีใบงานที่ยังไม่เปิดขายอยู่ในตะกร้า");

  const total = products.reduce((sum, p) => sum + p.price, 0);
  const id = generateOrderId();
  const db = supabaseAdmin();

  const { error: orderError } = await db.from("orders").insert({
    id,
    customer_contact: cleanContact,
    total_amount: total,
    status: "PENDING",
  });
  if (orderError) throw new Error(orderError.message);

  const { error: itemsError } = await db.from("order_items").insert(
    products.map((p) => ({ order_id: id, product_id: p.id, product_title: p.title, price: p.price, quantity: 1 }))
  );
  if (itemsError) {
    await db.from("orders").delete().eq("id", id);
    throw new Error(itemsError.message);
  }

  const order = await getOrder(id);
  if (!order) throw new Error("สร้างคำสั่งซื้อแล้วแต่อ่านกลับไม่ได้");
  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  if (!/^[A-Za-z0-9-]{4,40}$/.test(orderId)) return null;
  const { data, error } = await supabaseAdmin().from("orders").select(ORDER_SELECT).eq("id", orderId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toOrder(data as unknown as OrderRow) : null;
}

function normalizeContact(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]/g, "");
}

/** ค้นหาคำสั่งซื้อด้วยเบอร์/อีเมล (ต้องตรงทั้งหมด ไม่ใช่ค้นบางส่วน) */
export async function findOrdersByContact(contact: string): Promise<Order[]> {
  const target = normalizeContact(contact);
  if (target.length < 6) return [];
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data as unknown as OrderRow[])
    .filter((row) => normalizeContact(row.customer_contact) === target)
    .map(toOrder);
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data as unknown as OrderRow[]).map(toOrder);
}

export async function setOrderStatus(
  orderId: string,
  status: OrderStatus,
  extra: { trans_ref?: string; slip_image_url?: string } = {}
): Promise<Order | null> {
  const patch: Record<string, unknown> = { status, ...extra };
  if (status === "PAID" || status === "VERIFIED") patch.paid_at = new Date().toISOString();
  const { error } = await supabaseAdmin().from("orders").update(patch).eq("id", orderId);
  if (error) throw new Error(error.message);
  return getOrder(orderId);
}

/* ------------------------------------------------------------------ */
/* Slips                                                               */
/* ------------------------------------------------------------------ */

/** สลิปนี้ (รหัสอ้างอิงหรือรูปเดียวกัน) เคยใช้แล้วหรือยัง */
export async function isSlipUsed(transRef: string, imageHash: string): Promise<boolean> {
  const safeRef = transRef.replace(/[^A-Za-z0-9_-]/g, "");
  const safeHash = imageHash.replace(/[^a-f0-9]/g, "");
  const { data, error } = await supabaseAdmin()
    .from("verified_slips")
    .select("trans_ref")
    .or(`trans_ref.eq.${safeRef},image_hash.eq.${safeHash}`)
    .limit(1);
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

/** จองสลิป (กันใช้ซ้ำ) — คืนค่า false ถ้ามีคนใช้ไปแล้ว */
export async function recordSlip(slip: {
  trans_ref: string;
  image_hash: string;
  amount: number;
  order_id: string;
  sender_bank?: string;
  receiver_bank?: string;
}): Promise<boolean> {
  const { error } = await supabaseAdmin().from("verified_slips").insert(slip);
  if (!error) return true;
  if (error.code === "23505") return false; // unique violation
  throw new Error(error.message);
}

/** อัปโหลดรูปสลิปเข้าถังส่วนตัว คืนค่า path */
export async function uploadSlipImage(orderId: string, image: Buffer, contentType: string): Promise<string> {
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const path = `${orderId}/${Date.now()}.${ext}`;
  const { error } = await supabaseAdmin().storage.from(BUCKETS.slips).upload(path, image, { contentType, upsert: false });
  if (error) throw new Error(`อัปโหลดสลิปไม่ได้: ${error.message}`);
  return path;
}

/** ลิงก์ชั่วคราวดูรูปสลิป (สำหรับหลังบ้าน) */
export async function signedSlipUrl(path: string, seconds = 600): Promise<string | null> {
  if (!path || path.startsWith("/") || /^https?:/.test(path)) return path || null;
  const { data } = await supabaseAdmin().storage.from(BUCKETS.slips).createSignedUrl(path, seconds);
  return data?.signedUrl ?? null;
}

/** ลิงก์ชั่วคราวดาวน์โหลด PDF ตัวจริงจากถัง private-pdfs */
export async function signedPdfUrl(path: string, filename: string, seconds = 120): Promise<string | null> {
  const { data } = await supabaseAdmin().storage.from(BUCKETS.pdfs).createSignedUrl(path, seconds, { download: filename });
  return data?.signedUrl ?? null;
}
