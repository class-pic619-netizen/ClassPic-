-- ClassPic schema แบบคำสั่งเดียว (ใช้เมื่อ SQL Editor ขึ้นว่า "Only singular query allowed")
-- เนื้อหาเหมือน supabase/schema.sql ทุกอย่าง แค่ห่อด้วย DO block ให้รันเป็นคำสั่งเดียว
do $classpic$
begin
  create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    description text not null default '',
    grade_level text not null,
    subject text not null,
    page_count integer not null default 1,
    has_answer_key boolean not null default true,
    price numeric(10, 2) not null default 0,
    original_price numeric(10, 2),
    is_free_sample boolean not null default false,
    is_coming_soon boolean not null default false,
    cover_image text not null default '',
    preview_images jsonb not null default '[]',
    pdf_file_url text,
    tags jsonb not null default '[]',
    is_published boolean not null default true,
    created_at timestamptz not null default now()
  );
  create table if not exists public.orders (
    id text primary key,
    customer_contact text not null,
    total_amount numeric(10, 2) not null,
    status text not null default 'PENDING'
      check (status in ('PENDING', 'PENDING_REVIEW', 'PAID', 'VERIFIED', 'REJECTED', 'FAILED')),
    trans_ref text,
    slip_image_url text,
    paid_at timestamptz,
    created_at timestamptz not null default now()
  );
  create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id text not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_title text not null,
    price numeric(10, 2) not null,
    quantity integer not null default 1,
    created_at timestamptz not null default now()
  );
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
  alter table public.products       enable row level security;
  alter table public.orders         enable row level security;
  alter table public.order_items    enable row level security;
  alter table public.verified_slips enable row level security;
  drop policy if exists "Public can read published products" on public.products;
  create policy "Public can read published products"
    on public.products for select
    to anon, authenticated
    using (is_published = true);
  insert into storage.buckets (id, name, public)
  values
    ('public-previews', 'public-previews', true),
    ('private-pdfs',    'private-pdfs',    false),
    ('payment-slips',   'payment-slips',   false)
  on conflict (id) do update set public = excluded.public;
end
$classpic$;
