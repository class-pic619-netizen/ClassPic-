-- ==============================================================================
-- CLASSPIC STORE — SEED DATA
-- ข้อมูลชุดใบงานตั้งต้น สำหรับนำไปรันใน Supabase SQL Editor
-- ==============================================================================

insert into public.products (slug, title, description, grade_level, subject, price_thb, original_price_thb, page_count, has_answer_key, status, preview_urls, full_pdf_path)
values 
(
  'english-vocab-p1',
  'ใบงานคำศัพท์ภาษาอังกฤษพื้นฐาน ป.1 (ชุดสัตว์และสิ่งของรอบตัว)',
  'แบบฝึกหัดคำศัพท์ภาษาอังกฤษระดับชั้นประถมศึกษาปีที่ 1 พร้อมภาพประกอบระบายสี ช่วยให้นักเรียนจดจำคำศัพท์ได้รวดเร็วและสนุกสนาน ออกแบบตามมาตรฐานกระทรวงศึกษาธิการ',
  'ป.1-ป.3',
  'ภาษาอังกฤษ',
  59,
  99,
  25,
  true,
  'ACTIVE',
  '["/worksheets/preview-eng-p1-1.jpg", "/worksheets/preview-eng-p1-2.jpg", "/worksheets/preview-eng-p1-3.jpg"]'::jsonb,
  'worksheets/english-vocab-p1-master.pdf'
),
(
  'kindergarten-brain-booster',
  'ชุดฝึกเชาวน์ปัญญาและลากเส้นต่อจุด สำหรับเด็กปฐมวัย',
  'แบบฝึกเสริมพัฒนาการกล้ามเนื้อมัดเล็ก การสังเกต และการคิดวิเคราะห์สำหรับเด็กอนุบาล 1-3 รูปภาพน่ารัก ลายเส้นคมชัด เหมาะสำหรับคุณครูและผู้ปกครองนำไปปริ้นท์ให้เด็กฝึกทำ',
  'อนุบาล',
  'เชาวน์ปัญญา',
  79,
  120,
  30,
  false,
  'ACTIVE',
  '["/worksheets/preview-kg-1.jpg", "/worksheets/preview-kg-2.jpg"]'::jsonb,
  'worksheets/kindergarten-brain-master.pdf'
),
(
  'math-speed-multiply-p2',
  'แบบฝึกคณิตคิดเร็ว ป.2 ชุดสูตรคูณและโจทย์ระคน',
  'ชุดใบงานเสริมทักษะการคูณเบื้องต้น พร้อมตารางสูตรคูณและเทคนิคคิดลัด มีแบบทดสอบจับเวลาท้ายบท และเฉลยวิธีทำอย่างละเอียดทุกข้อ',
  'ป.1-ป.3',
  'คณิตศาสตร์',
  69,
  110,
  20,
  true,
  'COMING_SOON',
  '[]'::jsonb,
  null
),
(
  'special-edu-visual-cards',
  'ชุดบัตรภาพและใบงานการสื่อสารเบื้องต้น (การศึกษาพิเศษ / เด็กพิเศษ)',
  'ออกแบบพิเศษด้วยตัวหนังสือขนาดใหญ่ รูปภาพสื่อความหมายชัดเจน คอนทราสต์สูง ลดสิ่งรบกวนสายตา เหมาะสำหรับเด็กที่มีความต้องการพิเศษ ออทิสติก และเด็กที่มีปัญหาทางการเรียนรู้',
  'การศึกษาพิเศษ',
  'ศิลปะและกิจกรรม',
  89,
  150,
  35,
  true,
  'ACTIVE',
  '["/worksheets/preview-se-1.jpg"]'::jsonb,
  'worksheets/special-edu-cards-master.pdf'
)
on conflict (slug) do nothing;
