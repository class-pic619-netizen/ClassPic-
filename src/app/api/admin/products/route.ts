import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import {
  PRODUCTS_TAG,
  deleteProductById,
  getAllProductsForAdmin,
  insertProduct,
  updateProduct,
} from "@/lib/db";
import { GradeLevel, SubjectCategory } from "@/types";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const products = await getAllProductsForAdmin();
    return NextResponse.json({ success: true, products, totalCount: products.length });
  } catch (error) {
    console.error("admin products GET error:", error);
    return NextResponse.json({ success: false, message: "ไม่สามารถดึงข้อมูลใบงานได้" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { title, slug, description, grade_level, subject, page_count, has_answer_key, price, original_price } = body;

    if (!title || !grade_level || !subject) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อ, ระดับชั้น, วิชา)" },
        { status: 400 }
      );
    }

    const generatedSlug =
      (typeof slug === "string" && slug.trim()) ||
      String(title)
        .toLowerCase()
        .replace(/[^a-z0-9ก-๙]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `worksheet-${Date.now().toString().slice(-6)}`;

    const coverImage = typeof body.cover_image === "string" ? body.cover_image.trim() : "";
    const product = await insertProduct({
      title: String(title).trim(),
      slug: generatedSlug,
      description: description || "",
      grade_level: grade_level as GradeLevel,
      subject: subject as SubjectCategory,
      page_count: Math.max(1, Number(page_count) || 1),
      has_answer_key: Boolean(has_answer_key),
      price: Math.max(0, Number(price) || 0),
      original_price: original_price ? Number(original_price) : undefined,
      cover_image: coverImage,
      preview_images: Array.isArray(body.preview_images) ? body.preview_images : coverImage ? [coverImage] : [],
      pdf_file_url: typeof body.pdf_file_url === "string" && body.pdf_file_url.trim() ? body.pdf_file_url.trim() : undefined,
      tags: Array.isArray(body.tags) ? body.tags : [subject, grade_level],
      is_coming_soon: Boolean(body.is_coming_soon),
      is_free_sample: Boolean(body.is_free_sample),
    });

    revalidateTag(PRODUCTS_TAG, "max");
    return NextResponse.json({ success: true, message: "เพิ่มใบงานชุดใหม่เรียบร้อยแล้ว", product });
  } catch (error) {
    console.error("admin products POST error:", error);
    const message = error instanceof Error && error.message.includes("duplicate")
      ? "มีใบงานที่ใช้ slug นี้อยู่แล้ว ลองเปลี่ยนชื่อหรือ slug"
      : "เกิดข้อผิดพลาดในการเพิ่มใบงาน";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id, is_coming_soon } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: "ต้องระบุ id" }, { status: 400 });

    const updated = await updateProduct(id, { is_coming_soon: Boolean(is_coming_soon) });
    revalidateTag(PRODUCTS_TAG, "max");
    return NextResponse.json({ success: updated, message: updated ? "อัปเดตสถานะสำเร็จ" : "ไม่พบสินค้า" });
  } catch (error) {
    console.error("admin products PATCH error:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการอัปเดต" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ต้องระบุ id" }, { status: 400 });

    const deleted = await deleteProductById(id);
    revalidateTag(PRODUCTS_TAG, "max");
    return NextResponse.json({ success: deleted, message: deleted ? "ลบชุดใบงานสำเร็จ" : "ไม่พบสินค้า" });
  } catch (error) {
    console.error("admin products DELETE error:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการลบ" }, { status: 500 });
  }
}
