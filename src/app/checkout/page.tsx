"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2, AlertCircle, Download, Loader2 } from "lucide-react";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import BrandIcon from "@/components/BrandIcon";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, totalItems, clearCart } = useCart();

  // Contact info
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState("");

  // Order state
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // QR Generation state
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [promptpayId, setPromptpayId] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);

  // Slip upload state
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [orderTotal, setOrderTotal] = useState<number | null>(null);

  // สร้างคำสั่งซื้อในระบบ (ครั้งเดียวต่อการชำระเงิน) คืนค่าเลขคำสั่งซื้อและยอดจริง
  const ensureOrder = async (contactValue: string): Promise<{ id: string; total: number } | null> => {
    if (currentOrderId && orderTotal !== null) return { id: currentOrderId, total: orderTotal };
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contactValue, items: cart.map((item) => item.product.id) }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        setSubmitError(orderData.error || "สร้างคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่");
        return null;
      }
      setCurrentOrderId(orderData.order.id);
      setOrderTotal(orderData.order.total_amount);
      return { id: orderData.order.id, total: orderData.order.total_amount };
    } catch {
      setSubmitError("เชื่อมต่อไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่");
      return null;
    }
  };

  // Generate QR Code and initialize pending order
  const generateQRCode = async (contactVal?: string) => {
    const val = contactVal !== undefined ? contactVal : contact;
    if (!val.trim()) {
      setContactError("กรุณากรอกเบอร์โทรศัพท์ หรืออีเมลเพื่อรับไฟล์ใบงาน");
      return;
    }
    setContactError("");
    setIsGeneratingQR(true);
    setSubmitError(null);

    try {
      // 1. สร้างคำสั่งซื้อครั้งเดียว (ยอดเงินคิดจากฐานข้อมูลฝั่งเซิร์ฟเวอร์)
      const ensured = await ensureOrder(val.trim());
      if (!ensured) return;

      // 2. Fetch PromptPay QR Code
      const res = await fetch("/api/promptpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: ensured.total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQrDataUrl(data.qrDataUrl);
        setPromptpayId(data.promptpayId || "0812345678");
        setQrGenerated(true);
      } else {
        setSubmitError(data.error || "ไม่สามารถสร้าง QR Code ได้");
      }
    } catch (err) {
      console.error("QR Fetch Error:", err);
      setSubmitError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setSubmitError("กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG)");
      return;
    }
    setSubmitError(null);
    setSlipFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setSlipPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  // Download QR Code to device
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `PromptPay-ClassPic-${orderTotal ?? totalAmount}THB.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Confirm and Verify Slip
  const handleVerifySlip = async () => {
    if (!contact.trim()) {
      setContactError("กรุณากรอกเบอร์โทรศัพท์ หรืออีเมล");
      return;
    }

    if (totalAmount > 0 && !slipFile && !slipPreview) {
      setSubmitError("กรุณาแนบรูปภาพสลิปการโอนเงินก่อนยืนยัน");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const ensured = await ensureOrder(contact.trim());
    if (!ensured) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      if (slipFile) formData.append("slip", slipFile);
      formData.append("orderId", ensured.id);

      const response = await fetch("/api/verify-slip", { method: "POST", body: formData });
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "ส่งสลิปไม่สำเร็จ กรุณาตรวจสอบรูปแล้วลองใหม่");
      }

      clearCart();
      router.push(`/downloads/${resData.orderId || ensured.id}`);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "ส่งสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty on initial render
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-cp-navy">ยังไม่มีใบงานที่ต้องชำระ</h1>
        <p className="text-muted mt-2 mb-7">เลือกใบงานใส่ตะกร้าก่อน แล้วค่อยกลับมาที่หน้านี้</p>
        <Link href="/#catalog" className="btn-primary">
          ดูใบงานทั้งหมด
        </Link>
      </div>
    );
  }

  const stepTitle = (n: number, title: string, sub?: string) => (
    <div className="flex items-start gap-3 mb-5">
      <span className="w-8 h-8 shrink-0 rounded-full bg-cp-navy text-white grid place-items-center font-head font-semibold">
        {n}
      </span>
      <div>
        <h2 className="text-lg font-semibold text-cp-navy leading-8">{title}</h2>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-7 py-8 lg:py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 font-head text-[15px] font-medium text-muted hover:text-cp-navy"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับไปตะกร้า
      </Link>
      <h1 className="text-[30px] font-bold text-cp-navy mt-5 mb-8">ชำระเงิน</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
        <div className="space-y-6">
          {/* ขั้นที่ 1 */}
          <section className="panel p-6">
            {stepTitle(1, "เบอร์โทรหรืออีเมล", "ใช้สำหรับกลับมาโหลดไฟล์ซ้ำ ไม่ต้องสมัครสมาชิก")}
            <input
              type="text"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (contactError) setContactError("");
              }}
              placeholder="เช่น 0812345678 หรือ teacher@school.ac.th"
              className={`input-field ${contactError ? "!border-[#c0392b]" : ""}`}
            />
            {contactError && (
              <p className="text-sm text-[#c0392b] flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-4 h-4" />
                {contactError}
              </p>
            )}
          </section>

          {totalAmount > 0 && (
            <>
          {/* ขั้นที่ 2 */}
          <section className="panel p-6">
            {stepTitle(2, "สแกนจ่ายพร้อมเพย์", "ใช้แอปธนาคารไหนก็ได้ ยอดเงินขึ้นให้อัตโนมัติ")}

            {!qrGenerated ? (
              <div className="rounded-xl bg-cp-bg p-8 text-center">
                <p className="text-muted mb-4">
                  ยอดที่ต้องโอน <strong className="font-head text-cp-navy text-lg">฿{totalAmount}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => generateQRCode()}
                  disabled={isGeneratingQR}
                  className="btn-primary cursor-pointer"
                >
                  {isGeneratingQR ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> กำลังสร้าง QR...
                    </>
                  ) : (
                    "แสดง QR พร้อมเพย์"
                  )}
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-[220px_1fr] gap-6 items-start">
                <div className="text-center">
                  <div className="relative w-[220px] h-[220px] rounded-xl border border-line bg-white p-2 mx-auto">
                    {qrDataUrl ? (
                      <Image src={qrDataUrl} alt="QR พร้อมเพย์" fill className="object-contain p-2" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-cp-bg animate-pulse rounded-lg" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-head font-medium text-cp-blue hover:text-cp-navy cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    บันทึกรูป QR
                  </button>
                </div>
                <div>
                  <div className="text-sm text-muted">ยอดโอน</div>
                  <div className="font-head text-[32px] font-bold text-cp-navy leading-tight">฿{orderTotal ?? totalAmount}</div>
                  <div className="text-sm text-muted mt-1">
                    ชื่อบัญชี ClassPic Studio · พร้อมเพย์ {promptpayId}
                  </div>
                  <ol className="mt-5 space-y-1.5 text-[15px] text-ink list-decimal pl-5">
                    <li>เปิดแอปธนาคาร เลือก &ldquo;สแกน&rdquo;</li>
                    <li>สแกน QR นี้ หรือเลือกรูป QR จากอัลบั้ม</li>
                    <li>ตรวจยอดให้เป็น ฿{orderTotal ?? totalAmount} แล้วกดยืนยัน</li>
                    <li>เก็บรูปสลิปไว้แนบในขั้นถัดไป</li>
                  </ol>
                </div>
              </div>
            )}
          </section>

          {/* ขั้นที่ 3 */}
          <section className="panel p-6">
            {stepTitle(3, "แนบสลิป", "แนบรูปสลิปจากแอปธนาคาร แล้วกดยืนยัน")}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-cp-blue bg-cp-mist"
                  : slipPreview
                    ? "border-[#1b8a4b]/40 bg-[#1b8a4b]/5"
                    : "border-[#CFD7E0] hover:border-cp-blue bg-cp-bg"
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {slipPreview ? (
                <div className="space-y-3">
                  <div className="relative w-36 h-48 mx-auto rounded-lg overflow-hidden border border-line bg-white">
                    <Image src={slipPreview} alt="สลิปที่เลือก" fill className="object-contain" unoptimized />
                  </div>
                  <p className="text-sm text-[#1b8a4b] font-medium inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> เลือกสลิปแล้ว · กดเพื่อเปลี่ยนรูป
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="font-head font-medium text-cp-navy">กดเพื่อเลือกรูปสลิป</p>
                  <p className="text-sm text-muted mt-1">หรือลากรูปมาวางตรงนี้ (JPG, PNG)</p>
                </div>
              )}
            </div>

            {submitError && (
              <div className="mt-4 rounded-xl bg-[#c0392b]/5 border border-[#c0392b]/20 p-3 text-sm text-[#c0392b] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {submitError}
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifySlip}
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 mt-6 text-base cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> กำลังตรวจสลิป...
                </>
              ) : (
                "ยืนยันและรับไฟล์"
              )}
            </button>
          </section>
            </>
          )}

          {totalAmount === 0 && (
            <section className="panel p-6">
              {stepTitle(2, "รับใบงานฟรี", "ไม่ต้องโอนเงิน กดปุ่มแล้วไปหน้าดาวน์โหลดได้เลย")}
              {submitError && (
                <div className="mb-4 rounded-xl bg-[#c0392b]/5 border border-[#c0392b]/20 p-3 text-sm text-[#c0392b] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}
              <button type="button" onClick={handleVerifySlip} disabled={isSubmitting} className="btn-primary w-full py-3.5 cursor-pointer">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "รับใบงานฟรี"}
              </button>
            </section>
          )}
        </div>

        {/* สรุปรายการ */}
        <aside className="panel p-6 lg:sticky lg:top-24">
          <h3 className="font-semibold text-cp-navy mb-2 flex items-center gap-2">
            <BrandIcon name="receipt" className="w-6 h-6" />
            รายการ <span className="text-muted font-normal">({totalItems})</span>
          </h3>
          <ul className="max-h-80 overflow-y-auto">
            {cart.map((item) => (
              <li key={item.product.id} className="flex gap-3 py-3 border-b border-line last:border-0">
                <div className="w-11 shrink-0 aspect-[210/297]">
                  <WorksheetPaperPreview
                    slug={item.product.slug}
                    title={item.product.title}
                    gradeLevel={item.product.grade_level}
                    subject={item.product.subject}
                    coverImage={item.product.cover_image}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-cp-navy line-clamp-2 leading-snug">{item.product.title}</h4>
                  <p className="text-xs text-muted mt-0.5">{item.product.page_count} หน้า</p>
                </div>
                <span className="font-head text-sm font-semibold text-cp-navy">฿{item.product.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-baseline border-t border-line mt-2 pt-4">
            <span className="font-head font-semibold text-cp-navy">รวม</span>
            <span className="font-head text-[28px] font-bold text-cp-navy">฿{totalAmount}</span>
          </div>
          <p className="text-sm text-muted mt-4">
            มีปัญหาเรื่องไฟล์ ติดต่อ LINE @classpic ได้เลย
          </p>
        </aside>
      </div>
    </div>
  );
}
