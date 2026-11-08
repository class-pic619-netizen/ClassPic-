# ACCOUNT_SETUP_GUIDE.md — คู่มือสิ่งที่ต้องทำในอีเมลใหม่ (ฟรี ฿0 ทุกขั้นตอน)

เอกสารนี้สรุปขั้นตอนการเตรียมบัญชีด้วย **อีเมลใหม่ของแบรนด์ ClassPic** แบบทีละก้าว เพื่อให้พร้อมเชื่อมต่อกับเว็บได้ทันที

---

## ขั้นตอนที่ 1: สมัครอีเมลใหม่และบัญชีหลัก 3 ตัว (ใช้เวลาประมาณ 10 นาที)

1. **สร้าง Gmail ใหม่สำหรับแบรนด์ ClassPic**
   - ตัวอย่างชื่ออีเมล: `classpic.studio@gmail.com` หรือ `classpic.official@gmail.com`
2. **สมัคร GitHub (ที่เก็บโค้ดเว็บ)**
   - เข้าเว็บ `https://github.com` > สมัครด้วย Gmail ใหม่
   - ตั้งชื่อ Username แนะนำ: `classpic-studio`
   - สร้าง Repository ใหม่ชื่อ: `classpic-store` (เลือกเป็น **Private** ได้เลย)
3. **สมัคร Vercel (ตัวแสดงหน้าเว็บออนไลน์ฟรี)**
   - เข้าเว็บ `https://vercel.com` > กด **Continue with GitHub** (เชื่อมกับ GitHub ใหม่เมื่อสักครู่)
   - แพ็กเกจ **Hobby (ฟรีตลอดชีพ)** จะได้ชื่อเว็บ `https://classpic.vercel.app` หรือ `https://classpic-store.vercel.app`
4. **สมัคร Supabase (ฐานข้อมูลและถังเก็บไฟล์ PDF ฟรี)**
   - เข้าเว็บ `https://supabase.com` > กด **Continue with GitHub**
   - กด **New Project** > ตั้งชื่อโปรเจกต์ว่า `classpic-db` > ตั้งรหัสผ่านฐานข้อมูล > เลือก Region เป็น **Southeast Asia (Singapore)** เพื่อให้เปิดจากไทยเร็วที่สุด

---

## ขั้นตอนที่ 2: ตั้งค่าฐานข้อมูลและถังเก็บไฟล์ใน Supabase (ทำครั้งเดียวจบ)

เมื่อโปรเจกต์ `classpic-db` ใน Supabase สร้างเสร็จแล้ว:

### 2.1 สร้างตาราง + ถังเก็บไฟล์ (รันไฟล์เดียวจบ)
1. เมนูซ้าย **SQL Editor** > **New query**
2. เปิดไฟล์ `supabase/schema.sql` คัดลอกทั้งหมดไปวาง แล้วกด **Run**
3. จะได้ตาราง `products`, `orders`, `order_items`, `verified_slips` (เปิด RLS ล็อกสิทธิ์แล้ว)
   และถังไฟล์ `public-previews` (สาธารณะ), `private-pdfs` (ส่วนตัว), `payment-slips` (ส่วนตัว)
   - ไม่ต้องสร้างถังเองที่เมนู Storage
   - อย่าใช้ไฟล์ `database/schema.sql` (เลิกใช้แล้ว)

### 2.2 คัดลอกคีย์ลงไฟล์ `.env.local`
1. เมนูซ้าย **Project Settings** (รูปเฟือง) > **API Keys** และหน้า **Data API** สำหรับ Project URL
2. เปิดไฟล์ `.env.local` ในโฟลเดอร์โปรเจกต์ แล้ววางค่า 3 ตัว:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Publishable key (หรือ `anon` `public`)
   - `SUPABASE_SERVICE_ROLE_KEY` = Secret key (หรือ `service_role`) — **ห้ามส่งให้ใครหรือวางในแชต**
3. ตั้ง `ADMIN_PASSWORD` เอง (`DOWNLOAD_SECRET` สร้างสุ่มไว้ให้แล้ว)

---

## ขั้นตอนที่ 3: เตรียมระบบแจ้งเตือนสลิปเข้ามือถือฟรี ฿0 (Telegram Bot)

เพื่อให้เวลามีลูกค้าแนบสลิปโอนเงิน แล้วเด้งเข้ามือถือคุณทันทีพร้อมปุ่มกดอนุมัติ (โดยไม่ต้องเสียเงินค่า API ช่วงแรก):
1. เปิดแอป **Telegram** ในมือถือ > ค้นหาชื่อ `@BotFather`
2. พิมพ์ `/newbot` > ตั้งชื่อบอทว่า `ClassPic Order Notify` > จะได้รหัส **`TELEGRAM_BOT_TOKEN`** มาเก็บไว้
3. กดลิงก์บอทที่ได้ > กด Start แล้วพิมพ์อะไรก็ได้ 1 ข้อความ > เข้าหน้า `/admin` แท็บ **แจ้งเตือน Telegram** กด **หาเลข Chat ID ของฉัน** จะได้ตัวเลข **`TELEGRAM_CHAT_ID`** (หรือใช้ `@userinfobot` ก็ได้)
4. ใส่ทั้งสองค่าใน `.env.local` และ Vercel แล้วกด **ส่งข้อความทดสอบ** ในแท็บเดิม
5. (ไม่บังคับ) ใส่ `NEXT_PUBLIC_SITE_URL` เช่น `https://classpic.vercel.app` เพื่อให้ข้อความแจ้งเตือนมีลิงก์กดเข้าหน้าอนุมัติ

*(หมายเหตุ: ในช่วงเริ่มเขียนโค้ดโมดูล M1–M5 บนเครื่องคอมพิวเตอร์ ยังไม่ต้องใส่คีย์เหล่านี้ก็สามารถรันเว็บจำลองและทดสอบทุกหน้าได้ทันที ค่อยนำคีย์มาใส่ตอนโมดูล M6 เมื่อจะเอาเว็บขึ้นออนไลน์จริงครับ)*
