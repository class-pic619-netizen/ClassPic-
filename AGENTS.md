# AGENTS.md — กติกาและข้อบังคับสำหรับ AI ทุกตัวในโปรเจกต์ ClassPic Store

โปรเจกต์: **ClassPic Store** (เว็บไซต์ขายใบงานดิจิทัล ขนาด A4 มาตรฐานไทย)
แบรนด์: **ClassPic — Learning & Creative Studio** (*Bright Outside — Clear Inside*)

---

## 1. ลำดับการอ่านเอกสารก่อนเริ่มทำงานทุกครั้ง (บังคับ)
เมื่อเปิดโปรเจกต์นี้ขึ้นมา หรือได้รับคำสั่งใหม่ AI ต้องอ่านไฟล์ตามลำดับนี้ก่อนเสมอ:
1. **`docs/STATUS.md`** — ดูว่าปัจจุบันงานถึงขั้นตอนไหน อะไรเสร็จแล้ว อะไรค้างอยู่ และขั้นตอนถัดไปคืออะไร
2. **`docs/MASTER_CHECKLIST.md`** — ตารางเช็กลิสต์หลักของโครงการ (Module M0 ถึง M6)
3. **`docs/BLUEPRINT.md`** — พิมพ์เขียวสถาปัตยกรรมระบบ จุดเชื่อมต่อ ชื่อตารางฐานข้อมูล มาตรฐานสี และภาพร่างหน้าจอทั้ง 5 หน้า
4. **`.agents/skills/anti-ai-ui-brand-dna/SKILL.md`** — **(บังคับเมื่อออกแบบ/แก้ไขหน้าเว็บ UI)** สกิลฉีกกฎโค้ด AI สำเร็จรูปและบังคับใช้ DNA แบรนด์ ClassPic (*Bright Outside — Clear Inside*)
5. **`docs/ACCOUNT_SETUP_GUIDE.md`** — คู่มือการตั้งค่าบัญชีฟรี (GitHub, Vercel, Supabase, Telegram/EasySlip)

---

## 2. กฎเหล็กเรื่อง "การบันทึกความคืบหน้าอัตโนมัติ" (Automatic Progress Logging)
ผู้ใช้ต้องการให้การสร้างระบบมีการบันทึกความคืบหน้าไปตลอดจนกว่าจะสำเร็จ โดยที่ผู้ใช้ไม่ต้องคอยเตือน:
- **ก่อนเริ่มทำโมดูลใด:** ให้แก้ไข `docs/STATUS.md` ในหัวข้อ `สถานะปัจจุบัน (Current Active Task)` เพื่อระบุว่ากำลังทำโมดูลไหน
- **เมื่อทำเสร็จแต่ละข้อย่อย:** ให้ติ๊กเครื่องหมาย `[x]` ใน `docs/MASTER_CHECKLIST.md` พร้อมระบุวันที่แก้ไขล่าสุด
- **เมื่อจบ 1 โมดูล:**
  1. ทดสอบให้แน่ใจว่าโค้ดรันผ่าน ไม่มี Error
  2. อัปเดต `docs/STATUS.md` (สรุปสิ่งที่ทำเสร็จแล้ว + สิ่งที่ต้องทำต่อในก้าวถัดไป)
  3. อัปเดต `docs/MASTER_CHECKLIST.md`
  4. Commit โค้ดพร้อมไฟล์ `docs/STATUS.md` และ `docs/MASTER_CHECKLIST.md` เสมอ

---

## 3. กติกาการทำงานและข้อห้ามสำคัญ
1. **ตอบและสื่อสารเป็นภาษาไทยที่เข้าใจง่าย กระชับ ชัดเจน**
2. **ห้ามเปลี่ยนโครงสร้างสีและแบรนด์โดยพลการ:** ต้องใช้ชุดสีของ ClassPic (`#082340` Navy, `#1C64B8` Blue, `#B5D5F2` Sky, `#F5760A` Orange) และโลโก้จาก `assets/classpic-brand-sheet.jpg`
3. **ความปลอดภัยของไฟล์ใบงานและระบบตรวจสลิป:**
   - ห้ามนำไฟล์ PDF ใบงานตัวเต็มไปไว้ในโฟลเดอร์สาธารณะ (`public/`) เด็ดขาด ต้องเก็บในถังลับ (`private-pdfs`) และจ่ายไฟล์ผ่านลิงก์ชั่วคราว (Signed URL) เท่านั้น
   - รูปตัวอย่างใบงานหน้าร้านต้องคาดลายน้ำ `ClassPic Studio` เสมอ
   - ระบบตรวจสลิปต้องเช็กรหัสอ้างอิงธนาคาร (`TransRef`) ห้ามซ้ำในตาราง `verified_slips` ทุกครั้ง และรองรับทั้ง **โหมดฟรี ฿0 (อนุมัติผ่านมือถือ/หน้าแอดมิน)** และ **โหมดอัตโนมัติ (EasySlip / SlipOK API)**
4. **รองรับการทยอยลงใบงาน:** ระบบต้องทำงานได้สมบูรณ์แม้มีใบงานเริ่มต้นเพียง 1–3 ชุด และให้เจ้าของร้านกดอัปโหลดใบงานใหม่เพิ่มเองผ่านหน้า `/admin` ได้ตลอดเวลาโดยไม่ต้องแก้โค้ด

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
