"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product, Order, GradeLevel, SubjectCategory } from "@/types";
import { ImagesPicker, PdfPicker, ProductFileButtons, uploadToStorage } from "./AdminUploads";
import AdminLogin from "./AdminLogin";
import AdminSettingsPanel from "./AdminSettingsPanel";
import {
  Package,
  ShoppingCart,
  CheckCircle2,
  Clock,
  PlusCircle,
  Eye,
  RefreshCw,
  LogOut,
  TrendingUp,
  FileText,
  UploadCloud,
  Database,
  ExternalLink,
  Search,
  Check,
  X,
  ChevronRight,
  ShieldAlert,
  Bell,
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [canResetViaTelegram, setCanResetViaTelegram] = useState<boolean>(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "new_product" | "telegram" | "deploy">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<Order | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGradeLevel, setNewGradeLevel] = useState<GradeLevel>("ป.1-ป.3");
  const [newSubject, setNewSubject] = useState<SubjectCategory>("ภาษาอังกฤษ");
  const [newPageCount, setNewPageCount] = useState<number>(25);
  const [newPrice, setNewPrice] = useState<number>(59);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(99);
  const [newHasAnswerKey, setNewHasAnswerKey] = useState<boolean>(true);
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [newIsComingSoon, setNewIsComingSoon] = useState<boolean>(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState<boolean>(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState<string>("");

  // Check initial login session
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        setCanResetViaTelegram(Boolean(data.canResetViaTelegram));
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchDashboardData();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    fetch("/api/admin/auth", { method: "DELETE" }).finally(() => setIsAuthenticated(false));
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/products"),
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      if (ordersData.success) setOrders(ordersData.orders || []);
      if (productsData.success) setProducts(productsData.products || []);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  // ยืนยันบนหน้าเว็บเอง (ไม่ใช้ confirm() เพราะบางเบราว์เซอร์/หน้าต่างในแอปปิดกล่องนี้อัตโนมัติ)
  const [pendingAction, setPendingAction] = useState<{ orderId: string; action: "approve" | "reject" } | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  const runOrderAction = async (orderId: string, action: "approve" | "reject") => {
    if (pendingAction?.orderId !== orderId || pendingAction.action !== action) {
      setPendingAction({ orderId, action });
      setActionMessage("");
      return;
    }
    setPendingAction(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      setActionMessage(data.success ? `${orderId}: ${data.message}` : data.message || "ทำรายการไม่สำเร็จ");
      if (data.success) {
        fetchDashboardData();
        setSelectedSlipOrder(null);
      }
    } catch {
      setActionMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง");
    }
  };

  const handleApproveOrder = (orderId: string) => runOrderAction(orderId, "approve");
  const handleRejectOrder = (orderId: string) => runOrderAction(orderId, "reject");
  const isConfirming = (orderId: string, action: "approve" | "reject") =>
    pendingAction?.orderId === orderId && pendingAction.action === action;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProduct(true);
    setProductSuccessMsg("");

    try {
      // 1) ส่งไฟล์ตรงเข้า Supabase Storage ก่อน แล้วค่อยบันทึก path ลงตาราง products
      let pdfPath: string | undefined;
      if (newPdfFile) {
        pdfPath = await uploadToStorage(newPdfFile, "pdf", (p) => setUploadStatus(`กำลังอัปโหลด PDF ${p}%`));
      }
      const imagePaths: string[] = [];
      for (const [i, f] of newImageFiles.entries()) {
        imagePaths.push(
          await uploadToStorage(f, "image", (p) => setUploadStatus(`กำลังอัปโหลดรูป ${i + 1}/${newImageFiles.length} · ${p}%`))
        );
      }
      setUploadStatus("กำลังบันทึกข้อมูลใบงาน...");

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          grade_level: newGradeLevel,
          subject: newSubject,
          page_count: newPageCount,
          price: newPrice,
          original_price: newOriginalPrice,
          has_answer_key: newHasAnswerKey,
          cover_image: imagePaths[0] ?? "",
          preview_images: imagePaths,
          pdf_file_url: pdfPath,
          is_coming_soon: newIsComingSoon,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProductSuccessMsg("✓ เพิ่มใบงานชุดใหม่เรียบร้อยแล้ว!");
        setNewTitle("");
        setNewDescription("");
        setNewPdfFile(null);
        setNewImageFiles([]);
        fetchDashboardData();
        setTimeout(() => {
          setProductSuccessMsg("");
          setActiveTab("products");
        }, 1500);
      } else {
        alert(data.message || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setIsSubmittingProduct(false);
      setUploadStatus("");
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        canResetViaTelegram={canResetViaTelegram}
        onSuccess={() => {
          setIsAuthenticated(true);
          fetchDashboardData();
        }}
      />
    );
  }

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PENDING_REVIEW");
  const paidOrders = orders.filter((o) => o.status === "PAID");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2856B0] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ClassPic Admin Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142E4F]">
            ระบบจัดการร้านค้าหลังบ้าน
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ตรวจสลิปโอนเงิน อนุมัติการสั่งซื้อ และทยอยอัปโหลดใบงาน A4 ชุดใหม่
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ยอดขายรวม</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#142E4F]">
            ฿{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            จาก {paidOrders.length} ออเดอร์ที่ชำระสำเร็จ
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">รอตรวจสลิป</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F26C28]">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-amber-600 font-medium">ต้องกดอนุมัติเพื่อปลดล็อกไฟล์</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ออเดอร์ทั้งหมด</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#2856B0]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#142E4F]">
            {orders.length}
          </div>
          <p className="text-[11px] text-slate-400">ประวัติคำสั่งซื้อทั้งหมดในระบบ</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ใบงานในร้าน</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#142E4F]">
            {products.length}
          </div>
          <p className="text-[11px] text-slate-400">ชุดใบงานดิจิทัลพร้อมขาย</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-[#F26C28] text-[#142E4F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>จัดการออเดอร์ & ตรวจสลิป</span>
          {pendingOrders.length > 0 && (
            <span className="bg-[#F26C28] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "products"
              ? "border-[#F26C28] text-[#142E4F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>รายการใบงานทั้งหมด ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("new_product")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "new_product"
              ? "border-[#F26C28] text-[#142E4F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-[#F26C28]" />
          <span>เพิ่มใบงานชุดใหม่</span>
        </button>

        <button
          onClick={() => setActiveTab("telegram")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "telegram"
              ? "border-[#F26C28] text-[#142E4F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bell className="w-4 h-4 text-[#F26C28]" />
          <span>ตั้งค่า & ความปลอดภัย</span>
        </button>

        <button
          onClick={() => setActiveTab("deploy")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "deploy"
              ? "border-[#F26C28] text-[#142E4F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Database className="w-4 h-4 text-[#2856B0]" />
          <span>คู่มือ Supabase & ขึ้นออนไลน์</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-[#142E4F]">
                รายการคำสั่งซื้อและการตรวจสอบสลิป
              </h3>
              <p className="text-xs text-slate-500">
                คลิกดูรูปสลิปและกดอนุมัติเพื่อปลดล็อกไฟล์ PDF A4 ให้ลูกค้า
              </p>
            </div>
          </div>

          {actionMessage && (
            <div className="mx-6 mt-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-800">
              {actionMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">รหัสออเดอร์</th>
                  <th className="p-4">ข้อมูลติดต่อลูกค้า</th>
                  <th className="p-4">รายการใบงาน</th>
                  <th className="p-4">ยอดเงิน</th>
                  <th className="p-4">สถานะ</th>
                  <th className="p-4">รหัสสลิป (TransRef)</th>
                  <th className="p-4 text-center">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const isPaid = order.status === "PAID";
                  const isPending = order.status === "PENDING" || order.status === "PENDING_REVIEW";

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-[#142E4F]">
                        <Link
                          href={`/downloads/${order.id}`}
                          target="_blank"
                          className="hover:text-[#2856B0] flex items-center gap-1"
                        >
                          <span>{order.id}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(order.created_at).toLocaleString("th-TH")}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-700">
                          {order.customer_contact}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="truncate text-slate-600">
                              • {it.product.title}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 font-bold text-base text-[#F26C28]">
                        ฿{order.total_amount}
                      </td>

                      <td className="p-4">
                        {isPaid && (
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            ชำระแล้ว (PAID)
                          </span>
                        )}
                        {isPending && (
                          <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-md border border-amber-200 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.status === "PENDING_REVIEW" ? "มีสลิป รอตรวจ" : "ยังไม่แนบสลิป"}
                          </span>
                        )}
                        {order.status === "REJECTED" && (
                          <span className="bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-md border border-rose-200 inline-flex items-center gap-1">
                            <X className="w-3 h-3" />
                            ปฏิเสธ
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {order.trans_ref || "-"}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {order.slip_image_url && (
                            <button
                              onClick={() => setSelectedSlipOrder(order)}
                              className="p-1.5 bg-[#2856B0]/10 hover:bg-[#2856B0]/20 text-[#2856B0] rounded-lg transition-colors"
                              title="ดูรูปสลิป"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApproveOrder(order.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95 flex items-center gap-1"
                                title="อนุมัติออเดอร์ทันที"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isConfirming(order.id, "approve") ? "กดอีกครั้งเพื่อยืนยัน" : "อนุมัติ"}</span>
                              </button>

                              <button
                                onClick={() => handleRejectOrder(order.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
                                title="ปฏิเสธสลิป"
                              >
                                {isConfirming(order.id, "reject") ? "ยืนยันปฏิเสธ" : "✕"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Products List */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#142E4F]">
                รายการชุดใบงานทั้งหมด ({products.length} ชุด)
              </h3>
              <p className="text-xs text-slate-500">
                ใบงานขนาด A4 มาตรฐานไทย พร้อมรูปตัวอย่างคาดลายน้ำและไฟล์ PDF
              </p>
            </div>

            <button
              onClick={() => setActiveTab("new_product")}
              className="bg-[#F26C28] hover:bg-[#d96303] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มใบงานใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {p.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-xs text-slate-400">ยังไม่มีรูปตัวอย่าง</div>
                    )}
                    <span className="absolute top-2 left-2 bg-[#142E4F] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.grade_level}
                    </span>
                    {p.is_coming_soon && (
                      <span className="absolute bottom-2 right-2 bg-[#F26C28] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-[#2856B0]">{p.subject}</span>
                      <span>{p.page_count} หน้า A4</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#142E4F] line-clamp-1">{p.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                  </div>
                </div>

                <ProductFileButtons product={p} onUpdated={fetchDashboardData} />

                <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-bold text-[#F26C28]">฿{p.price}</span>
                  <Link
                    href={`/products/${p.slug}`}
                    target="_blank"
                    className="text-xs text-[#2856B0] hover:underline flex items-center gap-1"
                  >
                    <span>ดูหน้าร้าน</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: New Product Form */}
      {activeTab === "new_product" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-xl text-[#142E4F] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#F26C28]" />
              <span>เพิ่มชุดใบงานใหม่ (A4)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              กรอกข้อมูลเพื่อทยอยลงใบงานใหม่ขึ้นหน้าร้านได้ทันที โดยไม่ต้องแก้ไขโค้ดโปรแกรม
            </p>
          </div>

          {productSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{productSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อชุดใบงาน *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="เช่น ชุดแบบฝึกหัดคำศัพท์ภาษาอังกฤษ ป.2 (Fun with Phonics)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2856B0] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รายละเอียดและจุดเด่นใบงาน
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="อธิบายเนื้อหา เหมาะสำหรับระดับชั้นใด จุดเด่นของภาพประกอบ..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2856B0] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ระดับชั้น *</label>
                <select
                  value={newGradeLevel}
                  onChange={(e) => setNewGradeLevel(e.target.value as GradeLevel)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2856B0] outline-none"
                >
                  <option value="อนุบาล">อนุบาล</option>
                  <option value="ป.1-ป.3">ป.1-ป.3</option>
                  <option value="ป.4-ป.6">ป.4-ป.6</option>
                  <option value="การศึกษาพิเศษ">การศึกษาพิเศษ</option>
                  <option value="2 ภาษา">2 ภาษา</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">กลุ่มวิชา *</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as SubjectCategory)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2856B0] outline-none"
                >
                  <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                  <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                  <option value="ภาษาไทย">ภาษาไทย</option>
                  <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                  <option value="เชาวน์ปัญญา">เชาวน์ปัญญา</option>
                  <option value="ศิลปะและกิจกรรม">ศิลปะและกิจกรรม</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  จำนวนหน้า A4 *
                </label>
                <input
                  type="number"
                  min={1}
                  value={newPageCount}
                  onChange={(e) => setNewPageCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2856B0] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ราคาขายจริง (฿) *
                </label>
                <input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2856B0] outline-none font-bold text-[#F26C28]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ราคาปกติเต็ม (฿)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2856B0] outline-none"
                />
              </div>
            </div>

            <PdfPicker file={newPdfFile} onChange={setNewPdfFile} />

            <ImagesPicker files={newImageFiles} onChange={setNewImageFiles} />

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newHasAnswerKey}
                  onChange={(e) => setNewHasAnswerKey(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2856B0] focus:ring-[#2856B0]"
                />
                <span>มีเฉลยละเอียดในเล่ม</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsComingSoon}
                  onChange={(e) => setNewIsComingSoon(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F26C28] focus:ring-[#F26C28]"
                />
                <span>สถานะ: เร็วๆ นี้ (Coming Soon)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmittingProduct}
              className="w-full bg-[#F26C28] hover:bg-[#d96303] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              {isSubmittingProduct ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {uploadStatus && <span>{uploadStatus}</span>}
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>บันทึกและเปิดขายใบงานใหม่ทันที</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab: Settings — Telegram, 2FA, password */}
      {activeTab === "telegram" && <AdminSettingsPanel />}

      {/* Tab 4: Deployment & Supabase Guide */}
      {activeTab === "deploy" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-xl text-[#142E4F] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#2856B0]" />
              <span>คู่มือการเชื่อมต่อ Supabase & Vercel ขึ้นออนไลน์ (ฟรี ฿0)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ขั้นตอนการนำเว็บไซต์ขึ้นออนไลน์ พร้อมเชื่อมฐานข้อมูล PostgreSQL และ Storage Buckets
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#142E4F]">1. ตั้งค่าฐานข้อมูล Supabase</h4>
              <p className="text-xs text-slate-600">
                เข้าสู่ระบบ Supabase ไปที่เมนู <strong>SQL Editor</strong> แล้วรันโค้ด SQL จากไฟล์{" "}
                <code className="text-[#142E4F] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                  docs/BLUEPRINT.md
                </code>{" "}
                เพื่อสร้าง 4 ตารางหลัก:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 pl-2">
                <li><code>products</code> — เก็บข้อมูลใบงานและสเปก A4</li>
                <li><code>orders</code> — เก็บคำสั่งซื้อและสถานะชำระเงิน</li>
                <li><code>order_items</code> — รายการใบงานในแต่ละออเดอร์</li>
                <li><code>verified_slips</code> — เก็บประวัติรหัสสลิป TransRef ป้องกันใช้ซ้ำ 100%</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#142E4F]">2. สร้าง Storage Buckets ทั้ง 3 ถัง</h4>
              <ul className="list-disc list-inside text-xs text-slate-600 pl-2">
                <li><code>public-previews</code> (Public) — รูปหน้าปกและตัวอย่างใบงานติดลายน้ำ</li>
                <li><code>private-pdfs</code> (Private) — ไฟล์ PDF มาสเตอร์ A4 ตัวจริง (ความปลอดภัยสูง)</li>
                <li><code>payment-slips</code> (Private) — รูปสลิปโอนเงินที่ลูกค้าแนบมา</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#142E4F]">3. การนำขึ้นโฮสต์ Vercel (ฟรี ฿0)</h4>
              <p className="text-xs text-slate-600">
                นำโค้ดขึ้น GitHub จากนั้นกด Import ใน Vercel พร้อมใส่ตัวแปรใน <strong>Environment Variables</strong>:
              </p>
              <pre className="bg-[#142E4F] text-[#AED6F4] p-4 rounded-xl text-xs font-mono overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-secure-admin-password
TELEGRAM_BOT_TOKEN=optional-bot-token
TELEGRAM_CHAT_ID=optional-chat-id
NEXT_PUBLIC_SITE_URL=https://classpic.vercel.app
EASYSLIP_API_KEY=optional-easyslip-key`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Slip Viewer Modal */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#142E4F]">
                  รูปสลิปของคำสั่งซื้อ: {selectedSlipOrder.id}
                </h4>
                <span className="text-xs text-slate-500">
                  ยอดเงินที่ต้องตรงกัน: ฿{selectedSlipOrder.total_amount}
                </span>
              </div>
              <button
                onClick={() => setSelectedSlipOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              {selectedSlipOrder.slip_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedSlipOrder.slip_image_url}
                  alt="สลิปโอนเงิน"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  ไม่มีรูปสลิปแนบมา
                </div>
              )}
            </div>

            {(selectedSlipOrder.status === "PENDING" || selectedSlipOrder.status === "PENDING_REVIEW") && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleApproveOrder(selectedSlipOrder.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs"
                >
                  {isConfirming(selectedSlipOrder.id, "approve") ? "กดอีกครั้งเพื่อยืนยันอนุมัติ" : "✓ อนุมัติสลิปนี้"}
                </button>
                <button
                  onClick={() => handleRejectOrder(selectedSlipOrder.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2.5 rounded-xl text-xs border border-rose-200"
                >
                  {isConfirming(selectedSlipOrder.id, "reject") ? "ยืนยันปฏิเสธ" : "✕ ปฏิเสธ"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
