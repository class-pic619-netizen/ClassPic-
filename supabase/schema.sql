// Supabase Database Schema for ClassPic Store
// Run this in Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Create Products Table (ใบงาน A4 มาตรฐานไทย)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    grade_level TEXT NOT NULL, -- 'อนุบาล', 'ป.1-ป.3', 'ป.4-ป.6', 'การศึกษาพิเศษ', '2 ภาษา'
    subject TEXT NOT NULL,     -- 'ภาษาอังกฤษ', 'คณิตศาสตร์', 'ภาษาไทย', ฯลฯ
    page_count INTEGER NOT NULL DEFAULT 20,
    has_answer_key BOOLEAN NOT NULL DEFAULT true,
    price NUMERIC(10, 2) NOT NULL DEFAULT 59.00,
    original_price NUMERIC(10, 2),
    is_free_sample BOOLEAN NOT NULL DEFAULT false,
    is_coming_soon BOOLEAN NOT NULL DEFAULT false,
    cover_image TEXT NOT NULL,
    preview_images TEXT[] DEFAULT '{}',
    pdf_file_url TEXT, -- private-pdfs/xxx.pdf
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Orders Table (คำสั่งซื้อ)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- เช่น CP-20261105-1234
    customer_contact TEXT NOT NULL, -- เบอร์โทรศัพท์ หรือ อีเมล
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'REJECTED'
    trans_ref TEXT, -- รหัสอ้างอิงธนาคารจากสลิป
    slip_image_url TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Order Items Table (รายการใบงานในแต่ละคำสั่งซื้อ)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Verified Slips Table (ป้องกันสลิปใช้ซ้ำ 100%)
CREATE TABLE IF NOT EXISTS public.verified_slips (
    trans_ref TEXT PRIMARY KEY, -- รหัสธุรกรรมธนาคาร ห้ามซ้ำเด็ดขาด
    amount NUMERIC(10, 2) NOT NULL,
    sender_bank TEXT,
    receiver_bank TEXT,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_contact ON public.orders(customer_contact);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_products_grade ON public.products(grade_level);
CREATE INDEX IF NOT EXISTS idx_products_subject ON public.products(subject);

-- Storage Buckets Configuration Note:
-- Create 3 buckets in Supabase Storage Dashboard:
-- 1. 'public-previews' -> Public bucket (สำหรับรูปหน้าปก & ตัวอย่างติดลายน้ำ)
-- 2. 'private-pdfs'    -> Private bucket (สำหรับไฟล์ PDF A4 ตัวเต็ม ล็อกแน่นหนา)
-- 3. 'payment-slips'   -> Private bucket (สำหรับรูปสลิปโอนเงิน)
