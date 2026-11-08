import { NextRequest, NextResponse } from "next/server";
import { getOrder, signedPdfUrl } from "@/lib/db";
import { generateSignedDownloadUrl, verifyDownloadToken, generateMasterA4Pdf } from "@/lib/pdfSecurity";


interface RouteParams {
  params: Promise<{
    orderId: string;
    productId: string;
  }>;
}

export async function GET(req: NextRequest, props: RouteParams) {
  try {
    const { orderId, productId } = await props.params;
    const searchParams = req.nextUrl.searchParams;

    const expires = searchParams.get("expires");
    const token = searchParams.get("token");
    const format = searchParams.get("format");

    // 1. ตรวจสอบว่ามีคำสั่งซื้อนี้จริงหรือไม่
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `ไม่พบคำสั่งซื้อหมายเลข ${orderId}` },
        { status: 404 }
      );
    }

    // 2. ตรวจสอบสถานะการชำระเงิน (ต้องเป็น PAID หรือ VERIFIED เท่านั้น)
    if (order.status !== "PAID" && order.status !== "VERIFIED") {
      return NextResponse.json(
        {
          success: false,
          error: "คำสั่งซื้อนี้ยังไม่ได้รับการยืนยันการชำระเงิน กรุณาแนบสลิปเพื่อปลดล็อกไฟล์",
          status: order.status
        },
        { status: 403 }
      );
    }

    // 3. ตรวจสอบว่าสินค้าชุดนี้อยู่ในคำสั่งซื้อนี้จริงหรือไม่
    const orderItem = order.items.find(
      (item) => item.product.id === productId || item.product.slug === productId
    );

    if (!orderItem) {
      return NextResponse.json(
        { success: false, error: "ชุดใบงานนี้ไม่ได้อยู่ในรายการคำสั่งซื้อของคุณ" },
        { status: 403 }
      );
    }

    const product = orderItem.product;

    // หากผู้ใช้ขอแค่ Signed URL ชั่วคราว (เช่น เพื่อเอาไปเปิดในแท็บใหม่หรือแสดงเวลาหมดอายุ)
    if (format === "json") {
      const signedData = generateSignedDownloadUrl(order.id, product.id, 900); // 15 นาที
      return NextResponse.json({
        success: true,
        orderId: order.id,
        productId: product.id,
        productTitle: product.title,
        downloadUrl: signedData.url,
        expiresAt: signedData.expiresAt,
        expiresInSeconds: 900,
        message: "สร้างลิงก์ดาวน์โหลดปลอดภัยสำเร็จ ลิงก์มีอายุ 15 นาที"
      });
    }

    // 4. หากมีพารามิเตอร์ token และ expires ให้ตรวจสอบอายุของลิงก์ (15 นาที)
    if (expires && token) {
      const verification = verifyDownloadToken(order.id, product.id, Number(expires), token);
      if (!verification.valid) {
        return new NextResponse(
          `<html><head><meta charset="utf-8"><title>ลิงก์หมดอายุ</title></head>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #F8FAFC; margin: 0;">
            <div style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; max-width: 440px;">
              <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
              <h2 style="color: #142E4F; margin: 0 0 8px;">ลิงก์ดาวน์โหลดหมดอายุ</h2>
              <p style="color: #64748B; font-size: 14px; line-height: 1.6;">${verification.reason || "ลิงก์มีความปลอดภัยและมีอายุ 15 นาที"}</p>
              <a href="/downloads/${order.id}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #F26C28; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
                กลับไปหน้ารับไฟล์เพื่อกดขอลิงก์ใหม่
              </a>
            </div>
          </body></html>`,
          {
            status: 401,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          }
        );
      }
    }

    const safeFilename = `ClassPic-${product.slug || product.id}.pdf`;

    // 5. มีไฟล์ PDF ตัวจริงในถัง private-pdfs → ส่งลิงก์ชั่วคราว 2 นาทีจาก Supabase Storage
    if (product.pdf_file_url) {
      const signed = await signedPdfUrl(product.pdf_file_url, safeFilename);
      if (signed) return NextResponse.redirect(signed, 302);
      console.error("Cannot sign PDF for", product.id, product.pdf_file_url);
      return NextResponse.json(
        { success: false, error: "ไฟล์ใบงานชุดนี้ยังเปิดไม่ได้ กรุณาติดต่อร้านทาง LINE" },
        { status: 500 }
      );
    }

    // ยังไม่ได้อัปโหลด PDF จริง → ส่งไฟล์ตัวอย่างที่ระบบสร้าง (ใช้ระหว่างทดสอบ)
    const pdfBuffer = generateMasterA4Pdf({
      productTitle: product.title,
      gradeLevel: product.grade_level,
      subject: product.subject,
      pageCount: product.page_count,
      buyerContact: order.customer_contact,
      orderId: order.id,
      hasAnswerKey: product.has_answer_key
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-ClassPic-Security": "Authorized-Order-Delivery",
        "X-Order-Id": order.id
      }
    });
  } catch (error) {
    console.error("Download route error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการสร้างไฟล์ดาวน์โหลด" },
      { status: 500 }
    );
  }
}
