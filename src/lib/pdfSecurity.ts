import crypto from "crypto";

const SECRET_KEY = process.env.DOWNLOAD_SECRET || "classpic-secure-download-token-secret-2026";

/**
 * สร้างลิงก์ดาวน์โหลดที่มีลายเซ็นดิจิทัล (Signed URL) และกำหนดอายุการใช้งาน (ค่าเริ่มต้น 15 นาที = 900 วินาที)
 */
export function generateSignedDownloadUrl(
  orderId: string,
  productId: string,
  validitySeconds: number = 900
): { url: string; expiresAt: number; token: string } {
  const expiresAt = Math.floor(Date.now() / 1000) + validitySeconds;
  const payload = `${orderId}:${productId}:${expiresAt}`;
  const token = crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");

  const url = `/api/download/${orderId}/${productId}?expires=${expiresAt}&token=${token}`;
  return { url, expiresAt, token };
}

/**
 * ตรวจสอบความถูกต้องของ Token ลายเซ็นดิจิทัลและวันหมดอายุของลิงก์ดาวน์โหลด (15 นาที)
 */
export function verifyDownloadToken(
  orderId: string,
  productId: string,
  expiresAt: number,
  token: string
): { valid: boolean; reason?: string } {
  const now = Math.floor(Date.now() / 1000);

  if (now > expiresAt) {
    return { valid: false, reason: "ลิงก์ดาวน์โหลดหมดอายุการใช้งานแล้ว (เกิน 15 นาที) กรุณากดขอรับลิงก์ใหม่" };
  }

  const payload = `${orderId}:${productId}:${expiresAt}`;
  const expectedToken = crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");

  if (token !== expectedToken) {
    return { valid: false, reason: "ลายเซ็นความปลอดภัยของลิงก์ดาวน์โหลดไม่ถูกต้อง" };
  }

  return { valid: true };
}

/**
 * สร้างไฟล์ PDF ขนาด A4 มาตรฐานไทย (210 x 297 mm = 595.28 x 841.89 pt) คมชัด 300 DPI
 * มีลายน้ำยืนยันลิขสิทธิ์เฉพาะผู้สั่งซื้อ และหน้าเฉลยตามมาตรฐาน ClassPic Studio
 */
export function generateMasterA4Pdf(params: {
  productTitle: string;
  gradeLevel: string;
  subject: string;
  pageCount: number;
  buyerContact: string;
  orderId: string;
  hasAnswerKey: boolean;
}): Buffer {
  const { productTitle, gradeLevel, subject, pageCount, buyerContact, orderId, hasAnswerKey } = params;

  // ปลอดภัยต่อ PDF string encoding
  const safeTitle = productTitle.replace(/[^\x20-\x7E]/g, " ").trim() || "Worksheet Master";
  const safeContact = buyerContact.replace(/[^\x20-\x7E]/g, "*").trim();
  const safeOrderId = orderId.replace(/[^\x20-\x7E]/g, "").trim();

  // สร้างหน้าจำลอง 3 หน้าตัวแทน: หน้าใบงาน 1, หน้าแบบฝึกหัด 2, หน้าเฉลย
  const totalRenderPages = Math.min(pageCount, 3);
  const pagesData: { pageNum: number; isAnswer: boolean; title: string }[] = [];

  for (let i = 1; i <= totalRenderPages; i++) {
    const isAnswer = hasAnswerKey && i === totalRenderPages;
    pagesData.push({
      pageNum: i,
      isAnswer,
      title: isAnswer ? "Answer Key & Teacher Solutions" : `Exercise Sheet Part ${i}`
    });
  }

  let output = "%PDF-1.4\n";
  const offsets: number[] = [];

  function addObj(content: string) {
    offsets.push(output.length);
    output += content + "\n";
  }

  // 1: Catalog
  addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");

  // 2: Pages
  const pageRefs = pagesData.map((_, i) => `${5 + i * 2} 0 R`).join(" ");
  addObj(`2 0 obj\n<< /Type /Pages /Kids [${pageRefs}] /Count ${pagesData.length} >>\nendobj`);

  // 3 & 4: Fonts
  addObj("3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj");
  addObj("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");

  pagesData.forEach((p, idx) => {
    const pageObjNum = 5 + idx * 2;
    const contentObjNum = 6 + idx * 2;

    addObj(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjNum} 0 R >>\nendobj`
    );

    // วาดกราฟิกและเนื้อหาด้วย PostScript PDF vector commands
    let stream = "";

    // 1. กรอบขอบกระดาษ A4 มาตรฐาน
    stream += "0.85 0.88 0.92 RG 1.5 w\n";
    stream += "28.35 28.35 538.58 785.19 re s\n";

    // 2. แถบ Header สีกรมท่า #142E4F (0.08 0.18 0.31)
    stream += "0.08 0.18 0.31 rg\n";
    stream += "28.35 770.0 538.58 43.54 re f\n";

    // แถบเส้นสีส้ม #F26C28 (0.95 0.42 0.16)
    stream += "0.95 0.42 0.16 rg\n";
    stream += "28.35 766.0 538.58 4.0 re f\n";

    // ข้อความใน Header
    stream += "BT\n/F1 14 Tf 1 1 1 rg 45 788 Td (ClassPic - Learning & Creative Studio) Tj ET\n";
    stream += `BT\n/F2 9 Tf 0.68 0.84 0.96 rg 45 775 Td (Standard Thai A4 Master Sheet | 300 DPI Quality) Tj ET\n`;

    // 3. กล่องข้อมูลนักเรียน (Name / Date / Score)
    stream += "0.95 0.97 1.0 rg 45 710 505 40 re f\n";
    stream += "0.8 0.85 0.9 RG 1 w 45 710 505 40 re s\n";
    stream += "BT\n/F1 10 Tf 0.08 0.18 0.31 rg 55 732 Td (Name: ______________________________________) Tj ET\n";
    stream += "BT\n/F1 10 Tf 0.08 0.18 0.31 rg 320 732 Td (Date: ____________) Tj ET\n";
    stream += "BT\n/F1 10 Tf 0.08 0.18 0.31 rg 440 732 Td (Score: ____ / 10) Tj ET\n";

    // 4. หัวข้อใบงานและหมวดหมู่
    stream += `BT\n/F1 16 Tf 0.08 0.18 0.31 rg 45 670 Td (${p.isAnswer ? "[ANSWER KEY] " : ""}${safeTitle}) Tj ET\n`;
    stream += `BT\n/F2 11 Tf 0.2 0.35 0.55 rg 45 650 Td (Subject: ${subject} | Level: ${gradeLevel} | Total: ${pageCount} Pages) Tj ET\n`;

    // 5. พื้นที่กิจกรรมแบบฝึกหัด (Exercise Box)
    stream += "0.9 0.92 0.95 RG 1 w\n";
    stream += "45 200 505 425 re s\n";

    if (p.isAnswer) {
      // หน้าเฉลย
      stream += "0.95 0.42 0.16 rg 55 580 485 30 re f\n";
      stream += "BT\n/F1 12 Tf 1 1 1 rg 70 592 Td (OFFICIAL ANSWER KEYS & STEP-BY-STEP SOLUTIONS) Tj ET\n";
      stream += "BT\n/F2 11 Tf 0.1 0.1 0.1 rg 70 540 Td (1. Solution item A: Complete correctly) Tj ET\n";
      stream += "BT\n/F2 11 Tf 0.1 0.1 0.1 rg 70 510 Td (2. Solution item B: Full credit answer) Tj ET\n";
      stream += "BT\n/F2 11 Tf 0.1 0.1 0.1 rg 70 480 Td (3. Solution item C: Extra review notes) Tj ET\n";
    } else {
      // หน้าแบบฝึกหัด
      stream += "BT\n/F1 12 Tf 0.08 0.18 0.31 rg 65 590 Td (Directions: Complete each activity carefully on this A4 sheet.) Tj ET\n";
      stream += "BT\n/F2 11 Tf 0.2 0.2 0.2 rg 65 550 Td (Question 1: Fill in the missing answers and practice.) Tj ET\n";
      stream += "BT\n/F2 11 Tf 0.2 0.2 0.2 rg 65 490 Td (Question 2: Match the pairs and draw the connection lines.) Tj ET\n";
      stream += "BT\n/F2 11 Tf 0.2 0.2 0.2 rg 65 430 Td (Question 3: Write your reflection or creative response below.) Tj ET\n";

      // เส้นบรรทัดสำหรับเขียนคำตอบ
      stream += "0.85 0.85 0.85 RG 0.8 w\n";
      stream += "65 370 465 0 re s\n";
      stream += "65 330 465 0 re s\n";
      stream += "65 290 465 0 re s\n";
      stream += "65 250 465 0 re s\n";
    }

    // 6. ลายน้ำระบุลิขสิทธิ์ผู้สั่งซื้อ (Watermark / Security License Box)
    stream += "0.98 0.98 0.98 rg 45 60 505 85 re f\n";
    stream += "0.85 0.85 0.85 RG 0.5 w 45 60 505 85 re s\n";
    stream += `BT\n/F1 9 Tf 0.08 0.18 0.31 rg 55 125 Td (ClassPic Authenticated License - Order #${safeOrderId}) Tj ET\n`;
    stream += `BT\n/F2 8 Tf 0.4 0.4 0.4 rg 55 110 Td (Licensed to Customer: ${safeContact}) Tj ET\n`;
    stream += "BT\n/F2 8 Tf 0.4 0.4 0.4 rg 55 95 Td (For personal, classroom, or homeschooling educational use. Resale prohibited.) Tj ET\n";
    stream += `BT\n/F2 8 Tf 0.4 0.4 0.4 rg 55 80 Td (Generated at: ${new Date().toISOString()} | Secure A4 Vector Stream) Tj ET\n`;

    // 7. หมายเลขหน้า
    stream += `BT\n/F1 9 Tf 0.08 0.18 0.31 rg 480 40 Td (Page ${p.pageNum} of ${totalRenderPages}) Tj ET\n`;

    addObj(`${contentObjNum} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`);
  });

  const startxref = output.length;
  output += `xref\n0 ${5 + pagesData.length * 2}\n`;
  output += "0000000000 65535 f \n";
  for (let i = 0; i < offsets.length; i++) {
    output += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  output += `trailer\n<< /Size ${5 + pagesData.length * 2} /Root 1 0 R >>\n`;
  output += `startxref\n${startxref}\n%%EOF`;

  return Buffer.from(output, "utf-8");
}
