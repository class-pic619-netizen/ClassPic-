"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Copy, Check, ArrowLeft, Loader2 } from "lucide-react";
import WorksheetPaperPreview from "@/components/WorksheetPaperPreview";
import { Order } from "@/types";
import BrandIcon from "@/components/BrandIcon";

interface Props {
  initialOrder: Order;
}

export default function OrderDetailClient({ initialOrder }: Props) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // สเตตสำหรับการแนบสลิปในหน้าออเดอร์ (กรณีสถานะยังเป็น PENDING)
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccessMsg, setVerifySuccessMsg] = useState<string | null>(null);

  const isPaid = order.status === "PAID" || order.status === "VERIFIED";
  const isReview = order.status === "PENDING_REVIEW";
  const isRejected = order.status === "REJECTED";

  const handleCopyLink = async (productId: string) => {
    try {
      const res = await fetch(`/api/download/${order.id}/${productId}?format=json`);
      const data = await res.json();
      if (data.success && data.downloadUrl) {
        const fullUrl = `${window.location.origin}${data.downloadUrl}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopiedId(productId);
        setTimeout(() => setCopiedId(null), 3000);
      }
    } catch (err) {
      console.error("Failed to copy signed url:", err);
    }
  };

  const handleDownloadDirect = (productId: string) => {
    setDownloadingId(productId);
    // เปิดดาวน์โหลดผ่าน route ที่ส่ง stream PDF ขนาด A4
    window.location.href = `/api/download/${order.id}/${productId}`;
    setTimeout(() => setDownloadingId(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      setVerifyError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifySlip = async () => {
    if (!slipFile) {
      setVerifyError("กรุณาเลือกไฟล์รูปภาพสลิปการโอนเงิน");
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    setVerifySuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("orderId", order.id);
      formData.append("slip", slipFile);

      const res = await fetch("/api/verify-slip", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerifySuccessMsg(data.message || "ตรวจสอบสลิปสำเร็จ ปลดล็อกไฟล์แล้ว");
        // ใช้สถานะจริงจากเซิร์ฟเวอร์ (PAID หรือ PENDING_REVIEW รอร้านตรวจ)
        setOrder((prev) => ({ ...prev, status: data.status ?? prev.status }));
      } else {
        setVerifyError(data.error || "ไม่สามารถตรวจสอบสลิปได้");
      }
    } catch {
      setVerifyError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-7 py-8 lg:py-10">
      <Link
        href="/downloads"
        className="inline-flex items-center gap-1.5 font-head text-[15px] font-medium text-muted hover:text-cp-navy"
      >
        <ArrowLeft className="w-4 h-4" />
        ค้นหาคำสั่งซื้ออื่น
      </Link>

      <div className="mt-6">
        {isPaid ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1b8a4b] bg-[#1b8a4b]/10 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" /> ชำระแล้ว
            </span>
            <h1 className="text-[30px] font-bold text-cp-navy mt-3">ดาวน์โหลดไฟล์ได้เลย</h1>
            <p className="text-muted mt-1">ขอบคุณที่อุดหนุน ClassPic ไฟล์อยู่ด้านล่าง กดโหลดซ้ำได้ตลอด</p>
          </>
        ) : isReview ? (
          <>
            <span className="inline-flex text-sm font-medium text-cp-blue bg-cp-mist px-2.5 py-0.5 rounded-full">
              รอร้านตรวจสลิป
            </span>
            <h1 className="text-[30px] font-bold text-cp-navy mt-3">ได้รับสลิปแล้ว</h1>
            <p className="text-muted mt-1">
              ร้านกำลังตรวจยอดโอน พอตรวจเสร็จ ปุ่มดาวน์โหลดจะขึ้นที่หน้านี้ กลับมาเปิดหน้านี้ หรือค้นหาด้วยเบอร์โทรได้ทุกเมื่อ
            </p>
          </>
        ) : (
          <>
            <span className="inline-flex text-sm font-medium text-cp-orange-dark bg-cp-orange/10 px-2.5 py-0.5 rounded-full">
              {isRejected ? "สลิปไม่ผ่านการตรวจ" : "รอชำระเงิน"}
            </span>
            <h1 className="text-[30px] font-bold text-cp-navy mt-3">แนบสลิปเพื่อรับไฟล์</h1>
            <p className="text-muted mt-1">
              {isRejected
                ? "ร้านตรวจแล้วยอดหรือสลิปไม่ตรง แนบสลิปที่ถูกต้องอีกครั้ง หรือทัก LINE @classpic"
                : "คำสั่งซื้อนี้ยังไม่มีสลิป แนบรูปสลิปด้านล่างแล้วร้านจะตรวจให้"}
            </p>
          </>
        )}
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 py-5 border-y border-line text-[15px]">
        <div>
          <dt className="text-sm text-muted">คำสั่งซื้อ</dt>
          <dd className="font-head font-semibold text-cp-navy">{order.id}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">ผู้ซื้อ</dt>
          <dd className="text-cp-navy break-all">{order.customer_contact}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">ยอดชำระ</dt>
          <dd className="font-head font-semibold text-cp-navy">฿{order.total_amount.toLocaleString()}</dd>
        </div>
      </dl>

      {!isPaid && !isReview && (
        <section className="panel p-6 mt-8">
          <h2 className="text-lg font-semibold text-cp-navy">แนบสลิป</h2>
          <p className="text-sm text-muted mb-5">รูปสลิปจากแอปธนาคาร (JPG, PNG)</p>

          {verifyError && (
            <div className="mb-4 rounded-xl bg-[#c0392b]/5 border border-[#c0392b]/20 p-3 text-sm text-[#c0392b] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {verifyError}
            </div>
          )}
          {verifySuccessMsg && (
            <div className="mb-4 rounded-xl bg-[#1b8a4b]/5 border border-[#1b8a4b]/20 p-3 text-sm text-[#1b8a4b] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {verifySuccessMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <label className="flex-1 w-full rounded-xl border-2 border-dashed border-[#CFD7E0] hover:border-cp-blue bg-cp-bg p-6 text-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className="font-head font-medium text-cp-navy block">
                {slipFile ? slipFile.name : "กดเพื่อเลือกรูปสลิป"}
              </span>
              <span className="text-sm text-muted">{slipFile ? "กดเพื่อเปลี่ยนรูป" : "JPG, PNG, WebP"}</span>
            </label>

            {slipPreview && (
              <div className="w-full sm:w-44 flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slipPreview} alt="สลิปที่เลือก" className="w-36 h-48 object-contain rounded-lg border border-line bg-white" />
                <button
                  type="button"
                  onClick={handleVerifySlip}
                  disabled={verifying}
                  className="btn-primary w-full cursor-pointer"
                >
                  {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "ยืนยันสลิป"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-cp-navy mb-2">
          ใบงานในคำสั่งซื้อ <span className="text-muted font-normal">({order.items.length})</span>
        </h2>
        <ul>
          {order.items.map((item, idx) => {
            const product = item.product;
            const isCopied = copiedId === product.id;
            const isDownloading = downloadingId === product.id;
            return (
              <li key={idx} className="flex gap-5 py-6 border-b border-line last:border-0">
                <div className="w-20 shrink-0 aspect-[210/297]">
                  <WorksheetPaperPreview
                    slug={product.slug}
                    title={product.title}
                    gradeLevel={product.grade_level}
                    subject={product.subject}
                    coverImage={product.cover_image}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted">
                    {product.subject} · {product.grade_level}
                  </div>
                  <h3 className="text-[17px] font-semibold text-cp-navy leading-snug mt-0.5">{product.title}</h3>
                  <p className="text-sm text-muted mt-1">
                    PDF A4 · {product.page_count} หน้า{product.has_answer_key ? " · มีเฉลย" : ""}
                  </p>

                  {isPaid ? (
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <button
                        type="button"
                        onClick={() => handleDownloadDirect(product.id)}
                        disabled={isDownloading}
                        className="btn-primary text-sm px-5 py-2.5 cursor-pointer"
                      >
                        {isDownloading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span className="grid place-items-center w-6 h-6 rounded-md bg-white">
                              <BrandIcon name="cloud-download" className="w-4 h-4" />
                            </span>
                            ดาวน์โหลด PDF
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(product.id)}
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-cp-navy cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-[#1b8a4b]" /> คัดลอกแล้ว (ใช้ได้ 15 นาที)
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> คัดลอกลิงก์ไปเปิดเครื่องอื่น
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted mt-3 flex items-center gap-2">
                      <BrandIcon name="padlock-square-1" className="w-5 h-5" />
                      {isReview ? "ร้านตรวจสลิปเสร็จแล้วปุ่มดาวน์โหลดจะขึ้นตรงนี้" : "แนบสลิปแล้วปุ่มดาวน์โหลดจะขึ้นตรงนี้"}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-sm text-muted mt-10 pt-6 border-t border-line">
        ลิงก์ที่คัดลอกใช้ได้ 15 นาที ถ้าหมดอายุ กลับมาหน้านี้แล้วกดดาวน์โหลดใหม่ได้เสมอ · มีปัญหาติดต่อ LINE @classpic
      </p>
    </div>
  );
}
