import { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "cp-001",
    slug: "english-vocab-p1",
    title: "ชุดใบงานคำศัพท์ภาษาอังกฤษพื้นฐาน ป.1 (First Words 100)",
    description: "ใบงานคำศัพท์ภาษาอังกฤษพร้อมภาพประกอบสดใส คมชัด ขนาด A4 ออกแบบตามหลักสูตรแกนกลาง เสริมสร้างทักษะการจำคำศัพท์ การสะกด และการเชื่อมโยงความหมาย พร้อมแบบฝึกหัดทบทวนท้ายบท",
    grade_level: "ป.1-ป.3",
    subject: "ภาษาอังกฤษ",
    page_count: 25,
    has_answer_key: true,
    price: 59,
    original_price: 99,
    is_free_sample: false,
    is_coming_soon: false,
    cover_image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
    preview_images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["ภาษาอังกฤษ", "ป.1", "คำศัพท์", "มีเฉลย", "A4"],
    created_at: "2026-11-05T00:00:00Z"
  },
  {
    id: "cp-002",
    slug: "kindergarten-brain-booster",
    title: "ชุดฝึกทักษะเชาวน์ปัญญาและกล้ามเนื้อมัดเล็ก ปฐมวัย (อนุบาล 1-3)",
    description: "แบบฝึกเสริมทักษะการสังเกต จับคู่ภาพ ลากเส้นตามรอยประ และระบายสี สำหรับเด็กอนุบาล พัฒนากล้ามเนื้อมือและการทำงานประสานกันของสายตาและสมอง ปริ้นท์ A4 ไม่แตก เส้นคมกริบ",
    grade_level: "อนุบาล",
    subject: "เชาวน์ปัญญา",
    page_count: 30,
    has_answer_key: false,
    price: 79,
    original_price: 120,
    is_free_sample: false,
    is_coming_soon: false,
    cover_image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=60",
    preview_images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["อนุบาล", "เชาวน์ปัญญา", "กล้ามเนื้อมัดเล็ก", "ปฐมวัย", "ระบายสี"],
    created_at: "2026-11-05T00:00:00Z"
  },
  {
    id: "cp-003",
    slug: "math-speed-challenge-p2",
    title: "ชุดแบบฝึกคณิตคิดเร็ว ป.2 (การบวก-ลบระคน & โจทย์ปัญหา)",
    description: "เสริมพื้นฐานการคำนวณที่แม่นยำและรวดเร็ว ฝึกวิเคราะห์โจทย์ปัญหาในชีวิตประจำวัน พร้อมตารางสรุปคะแนนและเฉลยละเอียดทุกข้อ",
    grade_level: "ป.1-ป.3",
    subject: "คณิตศาสตร์",
    page_count: 35,
    has_answer_key: true,
    price: 69,
    original_price: 110,
    is_free_sample: false,
    is_coming_soon: true,
    cover_image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=60",
    preview_images: [
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["คณิตศาสตร์", "ป.2", "คิดเลขเร็ว", "โจทย์ปัญหา", "เร็วๆ นี้"],
    created_at: "2026-11-05T00:00:00Z"
  },
  {
    id: "cp-004",
    slug: "free-starter-pack-sample",
    title: "ชุดทดลองฟรี ใบงานสองภาษา 2 แผ่น",
    description: "ดาวน์โหลดทดลองปริ้นท์และใช้สอนได้ฟรีทันที 100% ไม่มีเงื่อนไข เพื่อทดสอบความคมชัดของเส้นและขนาดมาตรฐาน A4 จากสตูดิโอ ClassPic",
    grade_level: "2 ภาษา",
    subject: "ศิลปะและกิจกรรม",
    page_count: 2,
    has_answer_key: true,
    price: 0,
    original_price: 0,
    is_free_sample: true,
    is_coming_soon: false,
    cover_image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60",
    preview_images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["แจกฟรี", "ตัวอย่างทดลองสอน", "A4", "ClassPic", "2 ภาษา"],
    created_at: "2026-11-05T00:00:00Z"
  },
  {
    id: "cp-005",
    slug: "science-lab-p4-p6",
    title: "ชุดใบงานวิทยาศาสตร์และการทดลอง ป.4-ป.6 (Science Hands-on Lab)",
    description: "ใบงานสรุปการทดลองวิทยาศาสตร์ แผนผังความคิด (Mind Map) และแบบฝึกหัดวิเคราะห์การทดลองตามหลักสูตร สพฐ. พิมพ์ A4 สวยงาม อ่านง่าย",
    grade_level: "ป.4-ป.6",
    subject: "วิทยาศาสตร์",
    page_count: 40,
    has_answer_key: true,
    price: 89,
    original_price: 149,
    is_free_sample: false,
    is_coming_soon: false,
    cover_image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60",
    preview_images: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["วิทยาศาสตร์", "ป.4-ป.6", "การทดลอง", "มีเฉลย", "A4"],
    created_at: "2026-11-05T00:00:00Z"
  },
  {
    id: "cp-006",
    slug: "special-ed-daily-communication",
    title: "ชุดสื่อภาพสื่อสารและฝึกทักษะการช่วยเหลือตนเอง (การศึกษาพิเศษ / IEP)",
    description: "สื่อภาพสื่อสาร (PECS) และใบงานลำดับขั้นตอนกิจวัตรประจำวัน ออกแบบสำหรับเด็กที่มีความต้องการจำเป็นพิเศษ ลายเส้นชัด ตัวหนังสือใหญ่อ่านสบายตา",
    grade_level: "การศึกษาพิเศษ",
    subject: "เชาวน์ปัญญา",
    page_count: 32,
    has_answer_key: false,
    price: 79,
    original_price: 129,
    is_free_sample: false,
    is_coming_soon: false,
    cover_image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60",
    preview_images: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["การศึกษาพิเศษ", "IEP", "สื่อภาพ", "กล้ามเนื้อมัดเล็ก", "A4"],
    created_at: "2026-11-05T00:00:00Z"
  }
];
