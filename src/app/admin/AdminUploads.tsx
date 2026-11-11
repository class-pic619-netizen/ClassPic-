"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, FileText, ImagePlus, RefreshCw, UploadCloud, X } from "lucide-react";
import type { Product } from "@/types";

/* ------------------------------------------------------------------ */
/* อัปโหลดไฟล์ตรงเข้า Supabase Storage ผ่านลิงก์ชั่วคราวจาก /api/admin/uploads */
/* ------------------------------------------------------------------ */

export type UploadKind = "pdf" | "image";

export async function uploadToStorage(
  file: File,
  kind: UploadKind,
  onProgress?: (percent: number) => void
): Promise<string> {
  const res = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, filename: file.name, contentType: file.type, size: file.size }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.success) throw new Error(data.message || "ขอลิงก์อัปโหลดไม่ได้");

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "max-age=3600");
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (publicKey) xhr.setRequestHeader("apikey", publicKey);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`อัปโหลดไม่สำเร็จ (${xhr.status})`));
    xhr.onerror = () => reject(new Error("อินเทอร์เน็ตขัดข้องระหว่างอัปโหลด"));
    xhr.send(file);
  });
  onProgress?.(100);
  return data.path as string;
}

function formatSize(bytes: number): string {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

/* ------------------------------------------------------------------ */
/* ช่องเลือกไฟล์ PDF ใบงานตัวเต็ม                                          */
/* ------------------------------------------------------------------ */

export function PdfPicker({ file, onChange }: { file: File | null; onChange: (f: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">ไฟล์ใบงาน PDF ตัวเต็ม (A4)</label>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-sky-50 border border-[#AED6F4] rounded-xl">
          <FileText className="w-6 h-6 text-[#2856B0] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#142E4F] truncate">{file.name}</p>
            <p className="text-[11px] text-slate-500">{formatSize(file.size)}</p>
          </div>
          <button type="button" onClick={() => onChange(null)} className="p-1 text-slate-400 hover:text-red-500" aria-label="เอาไฟล์ออก">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full p-5 border-2 border-dashed border-slate-300 hover:border-[#2856B0] rounded-xl text-sm text-slate-500 flex flex-col items-center gap-1 transition-colors"
        >
          <UploadCloud className="w-6 h-6 text-[#2856B0]" />
          <span className="font-semibold text-[#142E4F]">กดเลือกไฟล์ PDF</span>
          <span className="text-[11px]">ไม่เกิน 50 MB · เก็บในถังลับ ลูกค้าโหลดได้หลังจ่ายเงินแล้วเท่านั้น</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ช่องเลือกรูปตัวอย่าง (รูปแรก = หน้าปก)                                    */
/* ------------------------------------------------------------------ */

export function ImagesPicker({ files, onChange }: { files: File[]; onChange: (f: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">รูปตัวอย่างใบงาน (สูงสุด 6 รูป · รูปแรกเป็นหน้าปก)</label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {files.map((f, i) => (
          <div key={`${f.name}-${i}`} className="relative aspect-[210/297] rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
            {urls[i] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urls[i]} alt={f.name} className="absolute inset-0 w-full h-full object-cover" />
            )}
            {i === 0 && (
              <span className="absolute bottom-1 left-1 bg-[#142E4F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">หน้าปก</span>
            )}
            <button
              type="button"
              onClick={() => onChange(files.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 text-slate-500 hover:text-red-500"
              aria-label="ลบรูป"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {files.length < 6 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-[210/297] border-2 border-dashed border-slate-300 hover:border-[#2856B0] rounded-lg flex flex-col items-center justify-center gap-1 text-[11px] text-slate-500"
          >
            <ImagePlus className="w-5 h-5 text-[#2856B0]" />
            <span>เพิ่มรูป</span>
          </button>
        )}
      </div>
      <span className="text-[10px] text-slate-400 mt-1 block">
        JPG / PNG / WEBP ไม่เกิน 8 MB ต่อรูป · หน้าร้านคาดลายน้ำ ClassPic Studio ให้อัตโนมัติ
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          onChange([...files, ...picked].slice(0, 6));
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ปุ่มแนบ/เปลี่ยนไฟล์ให้ใบงานที่มีอยู่แล้ว                                     */
/* ------------------------------------------------------------------ */

export function ProductFileButtons({ product, onUpdated }: { product: Product; onUpdated: () => void }) {
  const pdfRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string>("");
  const [error, setError] = useState<string>("");

  const save = async (patch: Record<string, unknown>) => {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, ...patch }),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.success) throw new Error(data.message || "บันทึกไม่สำเร็จ");
  };

  const handlePdf = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const path = await uploadToStorage(file, "pdf", (p) => setBusy(`กำลังอัป PDF ${p}%`));
      await save({ pdf_file_url: path });
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setBusy("");
    }
  };

  const handleImages = async (files: File[]) => {
    if (!files.length) return;
    setError("");
    try {
      const paths: string[] = [];
      for (const [i, f] of files.slice(0, 6).entries()) {
        paths.push(await uploadToStorage(f, "image", (p) => setBusy(`กำลังอัปรูป ${i + 1}/${Math.min(files.length, 6)} · ${p}%`)));
      }
      await save({ preview_images: paths });
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="px-4 pb-3 space-y-2">
      <div className="flex items-center gap-2 text-[11px]">
        {product.pdf_file_url ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> มีไฟล์ PDF จริงแล้ว
          </span>
        ) : (
          <span className="text-[#F26C28] font-semibold">ยังไม่มีไฟล์ PDF จริง (ลูกค้าจะได้ไฟล์ตัวอย่าง)</span>
        )}
      </div>
      {busy ? (
        <div className="text-xs text-[#2856B0] flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {busy}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => pdfRef.current?.click()}
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-[#2856B0] text-[#2856B0] hover:bg-sky-50 inline-flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> {product.pdf_file_url ? "เปลี่ยน PDF" : "แนบ PDF"}
          </button>
          <button
            type="button"
            onClick={() => imgRef.current?.click()}
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1"
          >
            <ImagePlus className="w-3.5 h-3.5" /> เปลี่ยนรูปตัวอย่าง
          </button>
        </div>
      )}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      <input
        ref={pdfRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          handlePdf(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={imgRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          handleImages(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
    </div>
  );
}
