-- ==============================================================================
-- CLASSPIC STORE — DATABASE SCHEMA (PostgreSQL / Supabase)
-- แบรนด์: ClassPic Learning & Creative Studio (Bright Outside — Clear Inside)
-- ==============================================================================

-- 1. ตารางเก็บรายการใบงาน (products)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text default '',
  grade_level text not null, -- อนุบาล, ป.1-ป.3, ป.4-ป.6, การศึกษาพิเศษ, 2 ภาษา
  subject text not null,     -- ภาษาอังกฤษ, คณิตศาสตร์, ภาษาไทย, วิทยาศาสตร์, เชาวน์ปัญญา
  price_thb integer not null default 0,
  original_price_thb integer,
  page_count integer not null default 1,
  has_answer_key boolean default true,
  status text not null default 'ACTIVE', -- ACTIVE, COMING_SOON, DRAFT
  preview_urls jsonb default '[]'::jsonb,
  sample_pdf_url text,
  full_pdf_path text,        -- path inside private-pdfs bucket
  created_at timestamptz default now()
);

-- Index for searching and filtering
create index if not exists idx_products_grade_level on public.products(grade_level);
create index if not exists idx_products_subject on public.products(subject);
create index if not exists idx_products_status on public.products(status);

-- 2. ตารางเก็บคำสั่งซื้อ (orders)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,
  customer_contact text not null, -- Phone or Email
  total_amount_thb integer not null,
  status text not null default 'PENDING_VERIFY', -- PENDING_VERIFY, PAID, REJECTED
  slip_image_url text,
  trans_ref text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

create index if not exists idx_orders_customer_contact on public.orders(customer_contact);
create index if not exists idx_orders_status on public.orders(status);

-- 3. ตารางเก็บรายการสินค้าในแต่ละคำสั่งซื้อ (order_items)
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete restrict,
  price_at_purchase integer not null
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- 4. ตารางเก็บรหัสอ้างอิงสลิปเพื่อกันสลิปซ้ำ 100% (verified_slips)
create table if not exists public.verified_slips (
  trans_ref text primary key,
  order_id uuid references public.orders(id) on delete cascade,
  slip_image_path text not null,
  verified_amount integer not null,
  verify_mode text not null default 'MANUAL_ADMIN', -- MANUAL_ADMIN, AUTO_API
  verified_at timestamptz default now()
);

-- 5. Storage Buckets (สร้างใน Supabase Storage):
-- 1. 'public-previews' (Public) สำหรับเก็บรูปตัวอย่างและปกใบงานคาดลายน้ำ
-- 2. 'slips'           (Private) สำหรับเก็บรูปสลิปโอนเงินที่ลูกค้าแนบมา
-- 3. 'private-pdfs'    (Private) สำหรับเก็บไฟล์ PDF A4 ตัวเต็ม จ่ายผ่าน Signed URL เท่านั้น
