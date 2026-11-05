import { NextRequest, NextResponse } from "next/server";
import {
  getAllProducts,
  addProduct,
  updateProductStatus,
  deleteProduct,
} from "@/lib/productsStore";
import { GradeLevel, SubjectCategory } from "@/types";

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({
      success: true,
      products,
      totalCount: products.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "ไม่สามารถดึงข้อมูลใบงานได้" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      grade_level,
      subject,
      page_count,
      has_answer_key,
      price,
      original_price,
      cover_image,
      preview_images,
      tags,
      is_coming_soon,
      is_free_sample,
    } = body;

    if (!title || !grade_level || !subject) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อ, ระดับชั้น, วิชา)" },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9ก-๙]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `worksheet-${Date.now().toString().slice(-4)}`;

    const newProduct = addProduct({
      title,
      slug: generatedSlug,
      description: description || "ชุดใบงานคุณภาพระดับมาตรฐาน A4 โดย ClassPic Studio",
      grade_level: grade_level as GradeLevel,
      subject: subject as SubjectCategory,
      page_count: Number(page_count) || 20,
      has_answer_key: Boolean(has_answer_key),
      price: Number(price) || 0,
      original_price: original_price ? Number(original_price) : undefined,
      cover_image:
        cover_image ||
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
      preview_images: preview_images?.length
        ? preview_images
        : [
            cover_image ||
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
          ],
      tags: tags || [subject, grade_level, "A4"],
      is_coming_soon: Boolean(is_coming_soon),
      is_free_sample: Boolean(is_free_sample),
    });

    return NextResponse.json({
      success: true,
      message: "เพิ่มใบงานชุดใหม่เรียบร้อยแล้ว",
      product: newProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการเพิ่มใบงาน" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, is_coming_soon } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ต้องระบุ id" }, { status: 400 });
    }

    const updated = updateProductStatus(id, Boolean(is_coming_soon));
    return NextResponse.json({
      success: updated,
      message: updated ? "อัปเดตสถานะสำเร็จ" : "ไม่พบสินค้า",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปเดต" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "ต้องระบุ id" }, { status: 400 });
    }

    const deleted = deleteProduct(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? "ลบชุดใบงานสำเร็จ" : "ไม่พบสินค้า",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบ" },
      { status: 500 }
    );
  }
}
