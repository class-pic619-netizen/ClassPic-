-- ==============================================================================
-- ClassPic Store — Supabase schema
-- วิธีใช้: Supabase Dashboard > SQL Editor > New query > วางทั้งไฟล์ > Run
-- รันซ้ำได้ (ใช้ IF NOT EXISTS / ON CONFLICT ทุกจุด)
--
-- ความปลอดภัย:
--   * เปิด Row Level Security (RLS) ทุกตาราง
--   * คนทั่วไป (anon key ในเบราว์เซอร์) อ่านได้แค่รายการใบงาน — อ่าน/เขียนออเดอร์และสลิปไม่ได้
--   * เซิร์ฟเวอร์ของเว็บใช้ service_role key (เก็บใน .env.local / Vercel เท่านั้น) ซึ่งข้าม RLS ได้
-- ==============================================================================

-- 1. ใบงาน
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  grade_level text not null,          -- อนุบาล | ป.1-ป.3 | ป.4-ป.6 | การศึกษาพิเศษ | 2 ภาษา
  subject text not null,              -- ภาษาอังกฤษ | คณิตศาสตร์ | ภาษาไทย | วิทยาศาสตร์ | เชาวน์ปัญญา | ศิลปะและกิจกรรม
  page_count integer not null default 1,
  has_answer_key boolean not null default true,
  price numeric(10, 2) not null default 0,
  original_price numeric(10, 2),
  is_free_sample boolean not null default false,
  is_coming_soon boolean not null default false,
  cover_image text not null default '',          -- path ในถัง public-previews
  preview_images text[] not null default '{}',   -- path ในถัง public-previews
  pdf_file_url text,                             -- path ในถัง private-pdfs (ห้ามเปิดสาธารณะ)
  tags text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. คำสั่งซื้อ
create table if not exists public.orders (
  id text primary key,                           -- เช่น CP-20261108-1234
  customer_contact text not null,                -- เบอร์โทรหรืออีเมล
  total_amount numeric(10, 2) not null,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'PENDING_REVIEW', 'PAID', 'VERIFIED', 'REJECTED', 'FAILED')),
  trans_ref text,
  slip_image_url text,                           -- path ในถัง payment-slips
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- 3. ใบงานในแต่ละคำสั่งซื้อ
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  price numeric(10, 2) not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

-- 4. สลิปที่ใช้แล้ว (กันสลิปซ้ำ: trans_ref ห้ามซ้ำ)
create table if not exists public.verified_slips (
  trans_ref text primary key,
  image_hash text unique,
  amount numeric(10, 2) not null,
  sender_bank text,
  receiver_bank text,
  order_id text not null references public.orders(id) on delete cascade,
  verified_at timestamptz not null default now()
);

create index if not exists idx_orders_customer_contact on public.orders(customer_contact);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_products_grade on public.products(grade_level);
create index if not exists idx_products_subject on public.products(subject);

-- 5. Row Level Security
alter table public.products       enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.verified_slips enable row level security;

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
  on public.products for select
  to anon, authenticated
  using (is_published = true);
-- orders / order_items / verified_slips: ไม่มี policy = anon อ่าน/เขียนไม่ได้เลย
-- (เซิร์ฟเวอร์เข้าถึงด้วย service_role)

-- 6. ถังเก็บไฟล์ (Storage buckets)
insert into storage.buckets (id, name, public)
values
  ('public-previews', 'public-previews', true),   -- รูปตัวอย่างใบงาน (ติดลายน้ำแล้ว)
  ('private-pdfs',    'private-pdfs',    false),  -- ไฟล์ PDF ตัวเต็ม จ่ายผ่าน signed URL เท่านั้น
  ('payment-slips',   'payment-slips',   false)   -- รูปสลิปลูกค้า
on conflict (id) do update set public = excluded.public;
