"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  CheckCircle2,
  Upload,
  AlertCircle,
  Download,
  Loader2,
  Phone,
  Mail,
  ShieldCheck,
  QrCode,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

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
      // 1. Create or ensure Order exists in system
      let orderId = currentOrderId;
      try {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact: val.trim(),
            items: cart,
            totalAmount,
          }),
        });
        const orderData = await orderRes.json();
        if (orderData.success && orderData.order?.id) {
          orderId = orderData.order.id;
          setCurrentOrderId(orderId);
        }
      } catch (orderErr) {
        console.warn("Order creation API note:", orderErr);
      }

      // 2. Fetch PromptPay QR Code
      const res = await fetch("/api/promptpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
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
    a.download = `PromptPay-ClassPic-${totalAmount.toFixed(2)}THB.png`;
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

    let activeOrderId = currentOrderId;

    // If order was not created yet, create it now
    if (!activeOrderId) {
      try {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact: contact.trim(),
            items: cart,
            totalAmount,
          }),
        });
        const orderData = await orderRes.json();
        if (orderData.success && orderData.order?.id) {
          activeOrderId = orderData.order.id;
          setCurrentOrderId(activeOrderId);
        }
      } catch (err) {
        console.warn("Order creation error:", err);
      }
    }

    // Fallback order ID if API failed
    if (!activeOrderId) {
      activeOrderId = `CP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
    }

    try {
      // Create FormData to send slip to /api/verify-slip
      const formData = new FormData();
      if (slipFile) {
        formData.append("slip", slipFile);
      }
      formData.append("orderId", activeOrderId);
      formData.append("contact", contact.trim());
      formData.append("amount", totalAmount.toString());

      const response = await fetch("/api/verify-slip", {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "การตรวจสอบสลิปไม่ผ่าน กรุณาตรวจสอบรูปภาพ");
      }

      const finalOrderId = resData.orderId || activeOrderId;

      // Save order record to localStorage for fast client-side download fallback
      const orderRecord = {
        id: finalOrderId,
        customer_contact: contact.trim(),
        total_amount: totalAmount,
        status: "PAID",
        items: cart,
        slip_image_url: slipPreview || "",
        trans_ref: resData.transRef || `REF-${Date.now()}`,
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem("classpic_orders") || "[]");
        existingOrders.unshift(orderRecord);
        localStorage.setItem("classpic_orders", JSON.stringify(existingOrders));
        localStorage.setItem("classpic_latest_order", JSON.stringify(orderRecord));
      } catch (storageErr) {
        console.error("Local storage error:", storageErr);
      }

      // Clear shopping cart
      clearCart();

      // Redirect to downloads page
      router.push(`/downloads/${finalOrderId}`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการตรวจสอบสลิป กรุณาลองใหม่อีกครั้ง";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty on initial render
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#082340] mb-2">ไม่มีสินค้าที่ต้องชำระ</h2>
          <p className="text-sm text-slate-500 mb-6">
            ตะกร้าสินค้าของคุณยังว่างอยู่ กรุณาเลือกใบงานก่อนเข้าสู่หน้าชำระเงิน
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#1C64B8] hover:bg-[#082340] text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-xs text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปเลือกใบงาน</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1C64B8] hover:text-[#082340] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปที่ตะกร้าสินค้า</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082340] flex items-center gap-2">
            <span>ชำระเงินและรับไฟล์ใบงาน</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              ดาวน์โหลดได้ทันที
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            สแกนชำระผ่าน PromptPay QR ยอดตรง 100% แล้วแนบสลิปเพื่อปลดล็อกไฟล์ PDF คุณภาพสูง
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1C64B8] text-white flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#082340]">
                    ข้อมูลสำหรับรับไฟล์และค้นหาย้อนหลัง
                  </h2>
                  <p className="text-xs text-slate-500">
                    ไม่ต้องสมัครสมาชิก ใช้เบอร์โทรหรืออีเมลเพื่อดาวน์โหลดซ้ำได้ตลอดเวลา
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  เบอร์โทรศัพท์ หรือ อีเมลของคุณครู/ผู้ปกครอง <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {contact.includes("@") ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      if (contactError) setContactError("");
                    }}
                    placeholder="เช่น 0812345678 หรือ teacher@school.ac.th"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C64B8] transition ${
                      contactError ? "border-rose-400 ring-rose-200" : "border-slate-300"
                    }`}
                  />
                </div>
                {contactError && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {contactError}
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: PromptPay QR Code Generation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#1C64B8] text-white flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#082340]">
                      สแกนจ่ายด้วยแอปธนาคารใดก็ได้
                    </h2>
                    <p className="text-xs text-slate-500">
                      รองรับ Mobile Banking ทุกธนาคาร (กสิกร, ไทยพาณิชย์, กรุงไทย, ฯลฯ)
                    </p>
                  </div>
                </div>

                {!qrGenerated && (
                  <button
                    type="button"
                    onClick={() => generateQRCode()}
                    disabled={isGeneratingQR}
                    className="text-xs font-semibold bg-[#1C64B8] hover:bg-[#082340] text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingQR ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <QrCode className="w-3.5 h-3.5" />
                    )}
                    <span>สร้าง QR Code</span>
                  </button>
                )}
              </div>

              {!qrGenerated ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                  <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    กดปุ่มสร้าง QR Code เพื่อรับภาพพร้อมเพย์ล็อกยอดเงิน ฿{totalAmount.toFixed(2)}
                  </p>
                  <button
                    type="button"
                    onClick={() => generateQRCode()}
                    disabled={isGeneratingQR}
                    className="mt-2 inline-flex items-center gap-2 bg-[#F5760A] hover:bg-[#d96303] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer text-sm"
                  >
                    {isGeneratingQR ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>กำลังสร้าง QR Code...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>สร้าง QR Code ชำระเงิน</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Thai QR Payment Container */}
                  <div className="max-w-sm mx-auto bg-white rounded-2xl border-2 border-[#1C64B8] overflow-hidden shadow-md">
                    {/* Official Thai QR Header Style */}
                    <div className="bg-[#082340] px-4 py-3 text-white text-center">
                      <div className="text-xs font-medium tracking-wider text-[#B5D5F2]">
                        THAI QR PAYMENT
                      </div>
                      <div className="text-sm font-bold mt-0.5">
                        พร้อมเพย์ (PromptPay)
                      </div>
                    </div>

                    <div className="p-5 flex flex-col items-center bg-white text-center">
                      {qrDataUrl ? (
                        <div className="relative w-56 h-56 border border-slate-100 rounded-lg p-2 bg-white shadow-inner">
                          <Image
                            src={qrDataUrl}
                            alt="PromptPay QR Code"
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-56 h-56 bg-slate-100 animate-pulse rounded-lg" />
                      )}

                      {/* Locked Amount Display */}
                      <div className="mt-4 w-full bg-[#B5D5F2]/20 border border-[#B5D5F2] rounded-xl py-2 px-3">
                        <div className="text-[11px] text-slate-500 font-medium">
                          ยอดโอนชำระสุทธิ (ล็อกยอดอัตโนมัติ)
                        </div>
                        <div className="text-2xl font-black text-[#F5760A]">
                          ฿{totalAmount.toFixed(2)}
                        </div>
                      </div>

                      {/* Account Details */}
                      <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                        <p>
                          <span className="font-semibold text-slate-700">ชื่อบัญชี:</span>{" "}
                          ClassPic Studio
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          พร้อมเพย์: {promptpayId}
                        </p>
                      </div>

                      {/* Download QR Button */}
                      <button
                        type="button"
                        onClick={handleDownloadQR}
                        className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-[#082340] text-xs font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>บันทึกภาพ QR Code ลงเครื่อง</span>
                      </button>
                    </div>
                  </div>

                  {/* Transfer Instructions */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                    <strong className="font-bold text-[#082340] block">
                      📌 ขั้นตอนการโอนเงิน:
                    </strong>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>เปิดแอปธนาคารของท่าน แล้วเลือกเมนู "สแกน"</li>
                      <li>สแกนภาพ QR Code ด้านบน หรือเลือกภาพจากอัลบั้ม</li>
                      <li>ตรวจสอบยอดเงินให้ตรงกับ <strong>฿{totalAmount.toFixed(2)}</strong> แล้วกดยืนยัน</li>
                      <li>บันทึกภาพสลิปการโอนเงินเพื่อนำมาแนบในขั้นตอนถัดไป</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Slip Upload & Verification */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1C64B8] text-white flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#082340]">
                    แนบรูปสลิปโอนเงิน
                  </h2>
                  <p className="text-xs text-slate-500">
                    ระบบจะตรวจสอบความถูกต้องของสลิปและปลดล็อกไฟล์ PDF ทันที
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  isDragging
                    ? "border-[#1C64B8] bg-[#B5D5F2]/20"
                    : slipPreview
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-300 hover:border-[#1C64B8] bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {slipPreview ? (
                  <div className="space-y-3">
                    <div className="relative w-40 h-52 mx-auto rounded-lg overflow-hidden border border-slate-200 shadow-xs">
                      <Image
                        src={slipPreview}
                        alt="Slip Preview"
                        fill
                        className="object-contain bg-slate-100"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        เลือกรูปสลิปเรียบร้อยแล้ว
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        กดเพื่อเปลี่ยนรูปสลิปใหม่
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-slate-200/80 rounded-full flex items-center justify-center mx-auto text-slate-500">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      คลิกเพื่อเลือกรูปสลิป หรือลากไฟล์มาวางที่นี่
                    </p>
                    <p className="text-xs text-slate-400">
                      รองรับไฟล์ภาพ JPG, PNG (รูปสลิปจากแอปธนาคารที่มี Mini QR)
                    </p>
                  </div>
                )}
              </div>

              {submitError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Confirm & Verify Button */}
              <button
                type="button"
                onClick={handleVerifySlip}
                disabled={isSubmitting}
                className="mt-6 w-full bg-[#F5760A] hover:bg-[#d96303] text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-base active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>กำลังยืนยันและตรวจสอบสลิป...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>ยืนยันการโอนเงินและรับไฟล์ใบงาน</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Summary (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-5">
              <h3 className="text-lg font-bold text-[#082340] pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>สรุปรายการสั่งซื้อ</span>
                <span className="text-xs font-normal text-slate-500">
                  {totalItems} รายการ
                </span>
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <div className="relative w-12 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={item.product.cover_image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#082340] line-clamp-2">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.product.grade_level} • {item.product.page_count} หน้า PDF
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#F5760A] shrink-0">
                      ฿{item.product.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>ราคารวมสินค้า</span>
                  <span>฿{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าบริการจัดส่ง</span>
                  <span className="text-emerald-600 font-medium">฿0.00 (ดาวน์โหลดทันที)</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#082340]">ยอดชำระสุทธิ</span>
                  <span className="text-2xl font-black text-[#F5760A]">
                    ฿{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Guarantee Box */}
              <div className="bg-[#B5D5F2]/20 border border-[#B5D5F2] rounded-xl p-3.5 space-y-2 text-[11px] text-[#082340]">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#1C64B8]" />
                  <span>การันตีความปลอดภัยและคุณภาพ ClassPic</span>
                </div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>ไฟล์ต้นฉบับคมชัด มาตรฐาน A4 สำหรับปริ้นท์</li>
                  <li>สลิปจะถูกบันทึกรหัสธุรกรรมป้องกันการใช้ซ้ำ</li>
                  <li>หากพบปัญหา ติดต่อแอดมินเพื่อขอรับไฟล์ใหม่ได้ทันที</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
