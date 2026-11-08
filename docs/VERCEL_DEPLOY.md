# ขึ้นเว็บจริงบน Vercel (ทำในมือถือได้ทั้งหมด)

โค้ดล่าสุดอยู่สาขา `main` ใน GitHub แล้ว Vercel จะสร้างเว็บใหม่ให้เองทุกครั้งที่ `main` เปลี่ยน

## 1. นำโปรเจกต์เข้า Vercel
1. เปิด https://vercel.com/new ในเบราว์เซอร์มือถือ → ล็อกอินด้วย GitHub
2. หา repo **ClassPic-** → กด **Import** (ถ้าไม่เห็น กด "Adjust GitHub App Permissions" แล้วอนุญาต repo นี้)
3. Framework ต้องขึ้นว่า **Next.js** ไม่ต้องแก้ Build Command
4. กาง **Environment Variables** แล้วใส่ค่าตามตารางข้อ 2 **ก่อน** กด Deploy

## 2. ค่าที่ต้องใส่ (คัดลอกค่าจากไฟล์ `.env.local` ในคอม หรือจากเว็บ Supabase)
| ชื่อ | เอามาจากไหน | จำเป็น |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → secret key | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API Keys → publishable key | แนะนำ |
| `NEXT_PUBLIC_PROMPTPAY_ID` | เบอร์/เลขบัตรพร้อมเพย์ของร้าน | ✅ |
| `ADMIN_PASSWORD` | ตั้งเอง ยาว 12 ตัวขึ้นไป | ✅ |
| `DOWNLOAD_SECRET` | ตั้งเอง ตัวอักษรมั่ว ๆ ยาว 32 ตัวขึ้นไป | ✅ |
| `TELEGRAM_BOT_TOKEN` | @BotFather | ไม่บังคับ |
| `TELEGRAM_CHAT_ID` | แท็บ "แจ้งเตือน Telegram" ใน /admin | ไม่บังคับ |
| `NEXT_PUBLIC_SITE_URL` | ลิงก์เว็บที่ได้ เช่น `https://classpic.vercel.app` | ไม่บังคับ |
| `EASYSLIP_API_KEY` | easyslip.com (ถ้าจะตรวจสลิปอัตโนมัติ) | ไม่บังคับ |

> ⚠️ ถ้าขาดค่าที่จำเป็น การ Deploy จะล้ม (ขึ้น `Missing environment variable ...`) ให้เพิ่มค่าที่ขาดแล้ว Redeploy

## 3. หลัง Deploy สำเร็จ
1. เปิดลิงก์ที่ Vercel ให้ → ลองหน้าแรก, `/admin` ล็อกอินด้วย `ADMIN_PASSWORD`
2. ใส่ `NEXT_PUBLIC_SITE_URL` เป็นลิงก์นั้น
3. ตั้ง Telegram: ใส่ `TELEGRAM_BOT_TOKEN` → Redeploy → ทักบอท → /admin แท็บแจ้งเตือน กด "หาเลข Chat ID" → ใส่ `TELEGRAM_CHAT_ID` → Redeploy → กด "ส่งข้อความทดสอบ"

**เพิ่ม/แก้ค่าทีหลัง:** Vercel → โปรเจกต์ → Settings → Environment Variables → แก้ → แท็บ Deployments → ⋯ ที่อันล่าสุด → **Redeploy** (ค่าใหม่มีผลหลัง Redeploy เท่านั้น)
