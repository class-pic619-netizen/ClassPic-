"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Lock, RefreshCw, ShieldCheck } from "lucide-react";

type Step = "password" | "code" | "forgot_code";

async function post(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ success: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" }));
}

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2856B0] transition-all";

export default function AdminLogin({
  canResetViaTelegram,
  onSuccess,
}: {
  canResetViaTelegram: boolean;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nonce, setNonce] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (body: Record<string, unknown>) => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      return await post(body);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "password") {
      const d = await run({ action: "login", password });
      if (!d.success) return setError(d.message || "รหัสผ่านไม่ถูกต้อง");
      if (d.needCode) {
        setNonce(d.nonce);
        setCode("");
        setStep("code");
        setInfo(d.message);
        return;
      }
      onSuccess();
    } else if (step === "code") {
      const d = await run({ action: "verify_login", nonce, code });
      if (!d.success) return setError(d.message);
      onSuccess();
    } else {
      const d = await run({ action: "reset", nonce, code, newPassword });
      if (!d.success) return setError(d.message);
      onSuccess();
    }
  };

  const startForgot = async () => {
    const d = await run({ action: "forgot" });
    if (!d.success) return setError(d.message);
    setNonce(d.nonce);
    setCode("");
    setNewPassword("");
    setStep("forgot_code");
    setInfo(d.message);
  };

  const back = () => {
    setStep("password");
    setError("");
    setInfo("");
    setCode("");
  };

  const title =
    step === "password" ? "เข้าสู่ระบบแอดมิน" : step === "code" ? "ยืนยันตัวตน" : "ตั้งรหัสผ่านใหม่";
  const Icon = step === "password" ? Lock : step === "code" ? ShieldCheck : KeyRound;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#142E4F] text-[#F26C28] flex items-center justify-center shadow-md">
            <Icon className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#142E4F]">{title}</h2>
          <p className="text-xs text-slate-500">
            {step === "password"
              ? "ระบบจัดการหลังบ้าน ClassPic Studio (อนุมัติสลิป & ทยอยลงใบงานใหม่)"
              : "เปิดแอป Telegram ดูรหัส 6 หลักที่บอทของร้านเพิ่งส่งไป (ใช้ได้ 5 นาที)"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "password" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">รหัสผ่านหลังบ้าน</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านหลังบ้าน"
                className={inputClass}
                required
              />
            </div>
          )}

          {step !== "password" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">รหัส 6 หลักจาก Telegram</label>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="______"
                className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`}
                required
              />
            </div>
          )}

          {step === "forgot_code" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">รหัสผ่านใหม่ (อย่างน้อย 10 ตัว)</label>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="ตั้งให้จำง่ายแต่เดายาก"
                className={inputClass}
                minLength={10}
                required
              />
            </div>
          )}

          {info && !error && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{info}</span>
            </div>
          )}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#142E4F] hover:bg-[#2856B0] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <span>
                {step === "password" ? "เข้าสู่ระบบหลังบ้าน" : step === "code" ? "ยืนยันรหัส" : "บันทึกรหัสใหม่และเข้าสู่ระบบ"}
              </span>
            )}
          </button>

          <div className="flex items-center justify-between text-xs">
            {step === "password" ? (
              <button
                type="button"
                onClick={startForgot}
                disabled={loading}
                className="text-[#2856B0] font-semibold hover:underline disabled:opacity-50"
              >
                ลืมรหัสผ่าน?
              </button>
            ) : (
              <button type="button" onClick={back} className="text-slate-500 hover:underline">
                ← กลับ
              </button>
            )}
            {step === "forgot_code" && (
              <button type="button" onClick={startForgot} disabled={loading} className="text-[#2856B0] font-semibold hover:underline">
                ขอรหัสใหม่
              </button>
            )}
          </div>

          {step === "password" && !canResetViaTelegram && (
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ยังไม่ได้ตั้ง Telegram — ถ้าลืมรหัส ให้แก้ค่า <code>ADMIN_PASSWORD</code> ใน Vercel (Settings → Environment
              Variables) แล้วกด Redeploy
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
