"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, KeyRound, RefreshCw, Send, ShieldCheck } from "lucide-react";

interface SettingsStatus {
  passwordSource: "web" | "env";
  twoFactor: boolean;
  telegram: {
    configured: boolean;
    tokenMasked: string;
    tokenSource: "web" | "env" | "none";
    chatId: string;
    chatSource: "web" | "env" | "none";
  };
}

type Msg = { ok: boolean; text: string } | null;

const inputClass =
  "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2856B0]";

function Notice({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <div
      className={`p-3 rounded-xl text-xs font-semibold border ${
        msg.ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-orange-50 border-orange-200 text-[#b8501a]"
      }`}
    >
      {msg.text}
    </div>
  );
}

function Section({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div>
        <h3 className="font-extrabold text-lg text-[#142E4F] flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      {children}
    </section>
  );
}

function CurrentPassword({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">รหัสผ่านปัจจุบัน (ยืนยันว่าเป็นเจ้าของร้าน)</label>
      <input
        type="password"
        autoComplete="current-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        required
      />
    </div>
  );
}

async function patch(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ success: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" }));
}

export default function AdminSettingsPanel() {
  const [status, setStatus] = useState<SettingsStatus | null>(null);
  const [busy, setBusy] = useState<string>("");

  // Telegram
  const [token, setToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [tgPassword, setTgPassword] = useState("");
  const [chats, setChats] = useState<{ id: string; name: string }[] | null>(null);
  const [tgMsg, setTgMsg] = useState<Msg>(null);

  // 2FA
  const [tfPassword, setTfPassword] = useState("");
  const [tfMsg, setTfMsg] = useState<Msg>(null);

  // Password
  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<Msg>(null);

  const reload = useCallback(async () => {
    const d = await fetch("/api/admin/settings").then((r) => r.json()).catch(() => null);
    if (d?.success) setStatus(d);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- โหลดสถานะครั้งแรกจากเซิร์ฟเวอร์
    reload();
  }, [reload]);

  const saveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("tg");
    setTgMsg(null);
    const d = await patch({ action: "set_telegram", currentPassword: tgPassword, botToken: token, chatId });
    setBusy("");
    setTgMsg({ ok: Boolean(d.success), text: d.message });
    if (d.success) {
      setToken("");
      setChatId("");
      setTgPassword("");
      reload();
    }
  };

  const findChat = async () => {
    setBusy("find");
    setTgMsg(null);
    const res = await fetch("/api/admin/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "find_chat" }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy("");
    if (!d.success) return setTgMsg({ ok: false, text: d.message || "หาห้องแชตไม่ได้" });
    setChats(d.chats);
    if (!d.chats.length) {
      setTgMsg({ ok: false, text: "ยังไม่พบข้อความ — เปิดแชตกับบอทของร้าน กด Start แล้วพิมพ์อะไรก็ได้ 1 ข้อความ แล้วกดใหม่" });
    }
  };

  const sendTest = async () => {
    setBusy("test");
    const res = await fetch("/api/admin/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "test" }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy("");
    setTgMsg({ ok: Boolean(d.success), text: d.message || "ส่งไม่สำเร็จ" });
  };

  const toggleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("tf");
    setTfMsg(null);
    const d = await patch({ action: "set_two_factor", currentPassword: tfPassword, enabled: !status?.twoFactor });
    setBusy("");
    setTfMsg({ ok: Boolean(d.success), text: d.message });
    if (d.success) {
      setTfPassword("");
      reload();
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setPwMsg({ ok: false, text: "รหัสใหม่ 2 ช่องไม่ตรงกัน" });
    setBusy("pw");
    setPwMsg(null);
    const d = await patch({ action: "change_password", currentPassword: curPassword, newPassword });
    setBusy("");
    setPwMsg({ ok: Boolean(d.success), text: d.message });
    if (d.success) {
      setCurPassword("");
      setNewPassword("");
      setConfirmPassword("");
      reload();
    }
  };

  const tg = status?.telegram;
  const sourceLabel = (src: string) => (src === "web" ? "ตั้งจากหน้านี้" : src === "env" ? "จาก Vercel/.env" : "ยังไม่ได้ตั้ง");
  const spin = <RefreshCw className="w-4 h-4 animate-spin" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Telegram */}
      <Section
        icon={<Bell className="w-5 h-5 text-[#F26C28]" />}
        title="แจ้งเตือนเข้า Telegram"
        desc="ส่งข้อความหาคุณเมื่อมีสลิปรออนุมัติ ขายได้ หรือมีคนรับใบงานฟรี — และใช้ส่งรหัสยืนยัน/รีเซ็ตรหัสผ่าน"
      >
        {tg && (
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-slate-500">Bot Token · {sourceLabel(tg.tokenSource)}</p>
              <p className="font-mono font-semibold text-[#142E4F] break-all">{tg.tokenMasked || "—"}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-slate-500">Chat ID · {sourceLabel(tg.chatSource)}</p>
              <p className="font-mono font-semibold text-[#142E4F]">{tg.chatId || "—"}</p>
            </div>
            <p className={`sm:col-span-2 font-bold ${tg.configured ? "text-emerald-700" : "text-[#F26C28]"}`}>
              {tg.configured ? "✓ พร้อมใช้งาน" : "ยังตั้งค่าไม่ครบ"}
            </p>
          </div>
        )}

        <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4">
          <li>
            ใน Telegram คุยกับ <b>@BotFather</b> → พิมพ์ <code className="bg-slate-100 px-1 rounded">/newbot</code> → ได้ Token มา
          </li>
          <li>ใส่ Token ด้านล่าง + รหัสผ่านปัจจุบัน → กดบันทึก</li>
          <li>เปิดแชตกับบอทของร้าน กด Start พิมพ์อะไรก็ได้ → กด &quot;หาเลข Chat ID&quot; → กดเลือกเลขของคุณ → บันทึก</li>
        </ol>

        <form onSubmit={saveTelegram} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bot Token (เว้นว่าง = ใช้ค่าเดิม)</label>
            <input
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="123456789:AA..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chat ID (เว้นว่าง = ใช้ค่าเดิม)</label>
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                value={chatId}
                onChange={(e) => setChatId(e.target.value.replace(/[^\d-]/g, ""))}
                placeholder="เช่น 5123456789"
                className={inputClass}
              />
              <button
                type="button"
                onClick={findChat}
                disabled={!!busy || tg?.tokenSource === "none"}
                className="shrink-0 text-xs font-bold px-3 rounded-xl bg-[#2856B0] text-white disabled:opacity-40"
              >
                {busy === "find" ? spin : "หาเลข Chat ID"}
              </button>
            </div>
            {chats && chats.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {chats.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setChatId(c.id)}
                      className="w-full text-left flex items-center gap-2 text-xs bg-sky-50 border border-[#AED6F4] rounded-lg px-3 py-2 hover:bg-sky-100"
                    >
                      <span className="font-semibold text-[#142E4F]">{c.name}</span>
                      <code className="ml-auto">{c.id}</code>
                      <span className="text-[#2856B0] font-bold">เลือก</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <CurrentPassword value={tgPassword} onChange={setTgPassword} />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!!busy}
              className="text-sm font-bold px-4 py-2.5 rounded-xl bg-[#142E4F] text-white disabled:opacity-50 inline-flex items-center gap-2"
            >
              {busy === "tg" ? spin : null} บันทึก Telegram
            </button>
            <button
              type="button"
              onClick={sendTest}
              disabled={!!busy || !tg?.configured}
              className="text-sm font-bold px-4 py-2.5 rounded-xl bg-[#F26C28] text-white disabled:opacity-40 inline-flex items-center gap-2"
            >
              {busy === "test" ? spin : <Send className="w-4 h-4" />} ส่งข้อความทดสอบ
            </button>
          </div>
        </form>
        <Notice msg={tgMsg} />
      </Section>

      {/* 2FA */}
      <Section
        icon={<ShieldCheck className="w-5 h-5 text-[#2856B0]" />}
        title="รหัสยืนยัน 2 ชั้น"
        desc="เมื่อเปิด ทุกครั้งที่ล็อกอินต้องใส่รหัสผ่าน + รหัส 6 หลักที่บอทส่งเข้า Telegram — ถึงมีคนรู้รหัสผ่านก็เข้าไม่ได้"
      >
        <p className={`text-sm font-bold ${status?.twoFactor ? "text-emerald-700" : "text-slate-500"}`}>
          สถานะ: {status?.twoFactor ? "✓ เปิดอยู่" : "ปิดอยู่"}
        </p>
        <form onSubmit={toggleTwoFactor} className="space-y-3">
          <CurrentPassword value={tfPassword} onChange={setTfPassword} />
          <button
            type="submit"
            disabled={!!busy || (!status?.twoFactor && !tg?.configured)}
            className={`text-sm font-bold px-4 py-2.5 rounded-xl text-white disabled:opacity-40 inline-flex items-center gap-2 ${
              status?.twoFactor ? "bg-slate-500" : "bg-[#2856B0]"
            }`}
          >
            {busy === "tf" ? spin : null} {status?.twoFactor ? "ปิดรหัสยืนยัน 2 ชั้น" : "เปิดรหัสยืนยัน 2 ชั้น"}
          </button>
          {!status?.twoFactor && !tg?.configured && (
            <p className="text-[11px] text-slate-400">ต้องตั้ง Telegram ด้านบนให้ใช้ได้ก่อน</p>
          )}
        </form>
        <Notice msg={tfMsg} />
      </Section>

      {/* Password */}
      <Section
        icon={<KeyRound className="w-5 h-5 text-[#F26C28]" />}
        title="เปลี่ยนรหัสผ่านหลังบ้าน"
        desc={`ตอนนี้ใช้รหัส${status?.passwordSource === "web" ? "ที่ตั้งจากหน้านี้" : "จาก ADMIN_PASSWORD ใน Vercel"} — ตั้งใหม่ที่นี่ได้เลย ไม่ต้องเข้า Vercel · ถ้าลืม กด "ลืมรหัสผ่าน" ที่หน้าเข้าสู่ระบบ (ต้องตั้ง Telegram ไว้)`}
      >
        <form onSubmit={changePassword} className="space-y-3">
          <CurrentPassword value={curPassword} onChange={setCurPassword} />
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">รหัสผ่านใหม่ (อย่างน้อย 10 ตัว)</label>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={10}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">พิมพ์รหัสใหม่อีกครั้ง</label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={10}
                className={inputClass}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!!busy}
            className="text-sm font-bold px-4 py-2.5 rounded-xl bg-[#F26C28] text-white disabled:opacity-50 inline-flex items-center gap-2"
          >
            {busy === "pw" ? spin : null} เปลี่ยนรหัสผ่าน
          </button>
        </form>
        <Notice msg={pwMsg} />
      </Section>
    </div>
  );
}
