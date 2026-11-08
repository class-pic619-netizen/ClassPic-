import Link from "next/link";
import Image from "next/image";
import { getPublishedProducts } from "@/lib/db";
import CatalogSection from "@/components/CatalogSection";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";

const HERO_SHEETS = [
  { subject: "คณิตศาสตร์", grade: "ป.2", title: "บวกเลขสองหลัก", pos: "left-[6%] top-[14%] -rotate-6" },
  { subject: "ภาษาอังกฤษ", grade: "ป.1", title: "Match the words", pos: "left-[28%] top-[7%] rotate-3 z-[2]" },
  { subject: "ภาษาไทย", grade: "อนุบาล", title: "ฝึกเขียน ก ข ค", pos: "right-[5%] top-[22%] rotate-[9deg] z-[3]" },
];

const FACTS = [
  { title: "มีเฉลยทุกชุด", sub: "อยู่ท้ายไฟล์" },
  { title: "ได้ไฟล์ทันที", sub: "หลังแนบสลิป" },
  { title: "โหลดซ้ำได้", sub: "ด้วยเบอร์โทร" },
];

const STEPS = [
  { icon: "/icons/tag.svg", title: "เลือกชุดใบงาน", text: "ใส่ตะกร้าได้หลายชุด กรอกแค่เบอร์โทรหรืออีเมล ไม่ต้องสมัครสมาชิก" },
  { icon: "/icons/cashing-check.svg", title: "สแกนจ่ายพร้อมเพย์", text: "ยอดเงินขึ้นให้อัตโนมัติ โอนเสร็จแล้วแนบสลิป" },
  { icon: "/icons/download-tray.svg", title: "ดาวน์โหลด PDF", text: "ได้ไฟล์ทันที ถ้าหาย กลับมาโหลดใหม่ได้ด้วยเบอร์เดิม" },
];

export default async function Home() {
  const products = await getPublishedProducts();
  const freeSample = products.find((p) => p.is_free_sample);

  return (
    <>
      {/* หัวเว็บ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-7 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center py-14 lg:py-20">
        <div>
          <h1 className="text-[36px] sm:text-[46px] leading-[1.25] font-extrabold text-cp-navy tracking-[-0.01em]">
            ใบงาน A4 พร้อมพิมพ์
            <br />
            สำหรับครู<span className="text-cp-orange">อนุบาล–ป.6</span>
          </h1>
          <p className="text-[18px] sm:text-[19px] text-muted mt-5 mb-8 max-w-[30em]">
            เลือกชุดที่ต้องการ จ่ายผ่านพร้อมเพย์ แล้วดาวน์โหลด PDF ได้เลย ไม่ต้องสมัครสมาชิก
            พิมพ์ได้ทั้งขาวดำและสี
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#catalog" className="btn-primary text-base px-7 py-3.5">
              ดูใบงานทั้งหมด
            </a>
            {freeSample && (
              <Link
                href={`/products/${freeSample.slug}`}
                className="font-head font-medium text-cp-blue border-b-[1.5px] border-current pb-px hover:text-cp-navy"
              >
                ลองชุดฟรี {freeSample.page_count} แผ่นก่อน
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-x-9 gap-y-4 mt-11 pt-6 border-t border-line text-[15px] text-muted">
            {FACTS.map((f) => (
              <div key={f.title}>
                <strong className="block font-head font-semibold text-cp-navy text-base">{f.title}</strong>
                {f.sub}
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[1.1/1] rounded-[20px] bg-cp-mist">
          {HERO_SHEETS.map((s) => (
            <div key={s.title} className={`absolute w-[46%] aspect-[210/297] ${s.pos}`}>
              <WorksheetPaperPreview
                slug={s.title}
                title={s.title}
                subject={s.subject}
                gradeLevel={s.grade}
              />
            </div>
          ))}
          <span className="absolute left-5 bottom-5 z-[3] rounded-lg bg-white px-3 py-1.5 text-sm text-cp-navy">
            ตัวอย่างจากชุดที่ขายอยู่
          </span>
        </div>
      </section>

      <CatalogSection products={products} />

      {/* ขั้นตอนการซื้อ */}
      <section className="bg-cp-bg py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-7">
          <h2 className="text-[28px] sm:text-[30px] font-semibold text-cp-navy">ซื้อแล้วได้ไฟล์ยังไง</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 mt-8">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="flex items-center gap-3">
                  <Image src={step.icon} alt="" width={36} height={36} className="w-9 h-9" />
                  <span className="font-head font-semibold text-cp-orange">ขั้นที่ {i + 1}</span>
                </div>
                <h3 className="text-[19px] font-semibold text-cp-navy mt-3 mb-1">{step.title}</h3>
                <p className="text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
