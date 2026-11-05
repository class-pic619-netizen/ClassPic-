export type GradeLevel = "อนุบาล" | "ป.1-ป.3" | "ป.4-ป.6" | "การศึกษาพิเศษ" | "2 ภาษา";

export type SubjectCategory = "ภาษาอังกฤษ" | "คณิตศาสตร์" | "ภาษาไทย" | "วิทยาศาสตร์" | "เชาวน์ปัญญา" | "ศิลปะและกิจกรรม";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  grade_level: GradeLevel;
  subject: SubjectCategory;
  page_count: number;
  has_answer_key: boolean;
  price: number;
  original_price?: number;
  is_free_sample?: boolean;
  is_coming_soon?: boolean;
  cover_image: string;
  preview_images: string[];
  pdf_file_url?: string; // Private Supabase storage key
  tags: string[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
