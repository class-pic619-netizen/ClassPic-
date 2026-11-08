import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-7 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Image
            src="/logo-wordmark.png"
            alt="ClassPic"
            width={800}
            height={167}
            className="h-7 w-auto"
          />
          <p className="text-[15px] text-muted max-w-sm">
            ใบงาน A4 สำหรับครูอนุบาลถึงประถม ออกแบบให้เด็กอยากทำ และครูพิมพ์ใช้ได้ทันที
          </p>
        </div>

        <div>
          <h4 className="font-head font-semibold text-cp-navy mb-3">ร้านค้า</h4>
          <ul className="space-y-2 text-[15px] text-muted">
            <li><Link href="/#catalog" className="hover:text-cp-navy">ใบงานทั้งหมด</Link></li>
            <li><Link href="/#free" className="hover:text-cp-navy">ชุดฟรี</Link></li>
            <li><Link href="/downloads" className="hover:text-cp-navy">โหลดไฟล์ที่ซื้อแล้ว</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-head font-semibold text-cp-navy mb-3">ติดต่อ</h4>
          <ul className="space-y-2 text-[15px] text-muted">
            <li>LINE: @classpic</li>
            <li>
              <Link href="/admin" className="hover:text-cp-navy">
                สำหรับเจ้าของร้าน
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 sm:px-7 py-5 flex flex-col sm:flex-row justify-between gap-2 text-sm text-muted">
          <span>© 2026 ClassPic Learning &amp; Creative Studio</span>
          <span>
            ไอคอนโดย{" "}
            <a
              href="https://www.streamlinehq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-cp-navy"
            >
              Streamline
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
