"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle2, 
  Download, 
  Clock, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowLeft, 
  Upload, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { Order } from "@/types";

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
        // อัปเดตสถานะออเดอร์ในหน้าจอเป็น PAID ทันที
        setOrder((prev) => ({
          ...prev,
          status: "PAID",
          trans_ref: data.transRef,
          paid_at: new Date().toISOString()
        }));
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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/downloads"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#142E4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปหน้าค้นหาใบงาน</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-[#2856B0] hover:underline font-medium"
          >
            ไปหน้าร้านแคตตาล็อกหลัก
          </Link>
        </div>

        {/* Status Banner */}
        {isPaid ? (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    ชำระเงินเรียบร้อย
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    ปลดล็อกไฟล์ PDF เรียบร้อยแล้ว!
                  </h1>
                  <p className="text-emerald-100 text-sm mt-1">
                    ขอบคุณที่สนับสนุนผลงานสร้างสรรค์จาก ClassPic Studio สามารถกดดาวน์โหลดไฟล์ด้านล่างได้ทันที
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  รอการยืนยันการชำระเงิน
                </h1>
                <p className="text-amber-100 text-sm mt-1">
                  คำสั่งซื้อนี้ยังไม่ได้รับการตรวจสอบสลิป กรุณาแนบรูปสลิปด้านล่างเพื่อปลดล็อกไฟล์ใบงาน A4
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Meta Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400 text-xs block">รหัสคำสั่งซื้อ</span>
              <span className="font-mono font-bold text-[#142E4F] text-base">
                #{order.id}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">ข้อมูลผู้ซื้อ</span>
              <span className="font-medium text-slate-800 break-all">
                {order.customer_contact}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">ยอดชำระสุทธิ</span>
              <span className="font-extrabold text-[#F26C28] text-base">
                ฿{order.total_amount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">รหัสอ้างอิงธนาคาร (TransRef)</span>
              <span className="font-mono text-xs text-slate-600 truncate block">
                {order.trans_ref || "— ยังไม่มีสลิป —"}
              </span>
            </div>
          </div>
        </div>

        {/* If PENDING: Show Slip Upload Section */}
        {!isPaid && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-[#2856B0]/40 p-6 sm:p-8 mb-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#142E4F] flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-[#2856B0]" />
              แนบรูปสลิปโอนเงินเพื่อปลดล็อกไฟล์ทันที
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              ระบบจะสแกน Mini QR บนสลิปและตรวจสอบกับฐานข้อมูลทันที เมื่อผ่านแล้วปุ่มดาวน์โหลดจะเปิดใช้งานอัตโนมัติ
            </p>

            {verifyError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{verifyError}</p>
              </div>
            )}

            {verifySuccessMsg && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{verifySuccessMsg}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-1/2">
                <label className="block w-full border-2 border-slate-200 hover:border-[#2856B0] rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-[#AED6F4]/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-slate-700 block">
                    {slipFile ? slipFile.name : "กดเพื่อเลือกรูปภาพสลิป"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    รองรับ JPG, PNG, WebP (รูปถ่ายสลิปจากแอปธนาคาร)
                  </span>
                </label>
              </div>

              {slipPreview && (
                <div className="w-full sm:w-1/2 flex flex-col items-center">
                  <div className="relative w-40 h-52 rounded-lg overflow-hidden border border-slate-300 shadow-sm mb-3">
                    <img
                      src={slipPreview}
                      alt="Slip preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifySlip}
                    disabled={verifying}
                    className="w-full py-3 bg-[#F26C28] hover:bg-[#e06800] text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {verifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>กำลังสแกนและตรวจสอบสลิป...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>ยืนยันและปลดล็อกไฟล์</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Worksheets Download Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#142E4F] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2856B0]" />
              รายการใบงานในคำสั่งซื้อ ({order.items.length} รายการ)
            </h2>
            {isPaid && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                พร้อมดาวน์โหลด A4 คมชัดสูง
              </span>
            )}
          </div>

          <div className="space-y-4">
            {order.items.map((item, idx) => {
              const product = item.product;
              const isCopied = copiedId === product.id;
              const isDownloading = downloadingId === product.id;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 transition-all hover:border-[#2856B0]/40"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                      <Image
                        src={product.cover_image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 96px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#AED6F4]/50 text-[#142E4F] text-xs font-medium">
                          {product.grade_level}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {product.subject}
                        </span>
                        {product.has_answer_key && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            มีเฉลยละเอียด
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#142E4F] line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        ขนาดกระดาษมาตรฐาน A4 (210 x 297 mm) • ความยาว {product.page_count} หน้า • มาสเตอร์คมชัด 300 DPI
                      </p>
                    </div>

                    {/* Download Controls */}
                    <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {isPaid ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadDirect(product.id)}
                            disabled={isDownloading}
                            className="px-5 py-3 bg-[#F26C28] hover:bg-[#e06800] text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                          >
                            {isDownloading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span>ดาวน์โหลด PDF (A4 คมชัดสูง)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(product.id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">คัดลอกลิงก์ 15 นาทีแล้ว!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>คัดลอกลิงก์ลับ (อายุ 15 นาที)</span>
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="text-center sm:text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium">
                            🔒 แนบสลิปเพื่อปลดล็อก
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Rule Card */}
        <div className="bg-[#AED6F4]/20 border border-[#AED6F4] rounded-2xl p-6 text-sm text-[#142E4F]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2856B0] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-[#142E4F]">
                มาตรฐานความปลอดภัยในการส่งมอบไฟล์ของ ClassPic Store
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                • ลิงก์ดาวน์โหลดตรงมีอายุความปลอดภัย 15 นาที หากลิงก์หมดอายุ ท่านสามารถกดปุ่ม <strong>&quot;ดาวน์โหลด PDF&quot;</strong> หรือเข้ามาที่หน้านี้เพื่อขอรับลิงก์ใหม่ได้ตลอดชีพ<br />
                • ไฟล์ใบงานทุกไฟล์ถูกสร้างและส่งตรงจากมาสเตอร์ A4 คมชัด 300 DPI ปริ้นท์แล้วตัวหนังสือไม่เบลอ ไม่แตก<br />
                • หากมีข้อสงสัยหรือต้องการความช่วยเหลือ สามารถแจ้งทีมงาน ClassPic ได้ตลอด 24 ชั่วโมง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
